from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.models.prescription import Prescription
from app.schemas.schemas import PrescriptionCreate, PrescriptionResponse
from app.middleware.auth import require_role
from app.services.ocr_service import extract_text, parse_medicines
from app.services.groq_service import analyze_prescription_image, structure_prescription_text
from app.services.storage_service import SupabaseStorage
from app.config import get_settings
import json
import os

router = APIRouter(prefix="/api/patient", tags=["Patient"])


# ─── Vision-First Prescription Processing Pipeline ───
@router.post("/prescriptions/scan")
async def scan_prescription(
    file: UploadFile = File(...),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """
    Upload a prescription image → process with AI vision + OCR pipeline.
    
    Pipeline priority:
    1. Groq Vision (Llama 4 Scout) — reads image directly (best for handwriting)
    2. EasyOCR + Groq Text (Llama 3.3 70B) — fallback for printed text
    3. EasyOCR + Regex — final fallback
    """
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are accepted")

    # Read image bytes
    image_bytes = await file.read()
    if len(image_bytes) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="Image too large (max 10MB)")

    # Determine user folder path
    user_id = x_user_id or "anonymous"

    # Upload to Supabase Storage under user_id folder
    image_url = None
    settings = get_settings()
    if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY and settings.SUPABASE_SERVICE_KEY != "PASTE_YOUR_SERVICE_ROLE_KEY_HERE":
        storage = SupabaseStorage(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
        import uuid
        from datetime import datetime
        safe_filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:6]}_{file.filename or 'prescription.jpg'}"
        user_path = f"user_{user_id}/{safe_filename}"
        upload_result = storage.upload_image(
            image_bytes,
            filename=user_path,
            content_type=file.content_type or "image/jpeg",
        )
        if upload_result["error"]:
            print(f"[Storage] Upload warning: {upload_result['error']}")
        else:
            image_url = upload_result["url"]
            print(f"[Storage] Image saved for user {user_id}: {image_url}")
    else:
        print("[Storage] Supabase not configured — image not saved to cloud")

    # ═══════════════════════════════════════════════════════
    # PIPELINE: Vision-First → OCR+Text LLM → OCR+Regex
    # ═══════════════════════════════════════════════════════

    structured_data = None
    structured_text_json = None
    used_llm = False
    ai_method = "none"
    display_text = ""
    confidence = 0.0
    medicines = []

    has_groq_key = settings.GROQ_API_KEY and not settings.GROQ_API_KEY.startswith("gsk_YOUR")

    # ── STEP 1: Try Groq Vision (direct image reading) ──
    if has_groq_key:
        print("=" * 60)
        print("[Pipeline] Step 1: Trying Groq Vision (Llama 4 Scout)...")
        print("=" * 60)
        vision_result = await analyze_prescription_image(
            image_bytes=image_bytes,
            api_key=settings.GROQ_API_KEY,
            content_type=file.content_type or "image/jpeg",
        )
        if vision_result["error"] is None and vision_result["structured"]:
            structured_data = vision_result["structured"]
            structured_text_json = json.dumps(structured_data)
            medicines = structured_data.get("medicines", [])
            display_text = structured_data.get("cleaned_text", "")
            used_llm = True
            ai_method = "vision"
            # Vision model gives high confidence for readable prescriptions
            confidence = 85.0 + min(10.0, len(medicines) * 2.5)
            print(f"[Pipeline] ✅ Vision succeeded: {len(medicines)} medicines, {confidence}% confidence")
        else:
            print(f"[Pipeline] ⚠️ Vision failed: {vision_result.get('error', 'unknown')}")

    # ── STEP 2: Fallback to EasyOCR + Groq Text LLM ──
    if not structured_data:
        print("[Pipeline] Step 2: Running EasyOCR + Groq Text fallback...")
        ocr_result = extract_text(image_bytes)

        if ocr_result["error"]:
            # If OCR also fails, raise error
            if not has_groq_key:
                raise HTTPException(status_code=422, detail=f"OCR failed: {ocr_result['error']}")
            # Otherwise use empty text
            raw_text = ""
            confidence = 0.0
        else:
            raw_text = ocr_result["text"]
            confidence = float(ocr_result["confidence"])

        display_text = raw_text

        if has_groq_key and raw_text.strip():
            print("[Pipeline] Structuring OCR text with Llama 3.3 70B...")
            groq_result = await structure_prescription_text(
                raw_text=raw_text,
                api_key=settings.GROQ_API_KEY,
                model=settings.GROQ_MODEL,
            )
            if groq_result["error"] is None and groq_result["structured"]:
                structured_data = groq_result["structured"]
                structured_text_json = json.dumps(structured_data)
                medicines = structured_data.get("medicines", [])
                display_text = structured_data.get("cleaned_text", raw_text)
                used_llm = True
                ai_method = "text"
                print(f"[Pipeline] ✅ Text LLM succeeded: {len(medicines)} medicines")
            else:
                print(f"[Pipeline] ⚠️ Text LLM failed: {groq_result.get('error', 'unknown')}")

        # ── STEP 3: Final fallback to regex parsing ──
        if not structured_data and raw_text:
            print("[Pipeline] Step 3: Using regex parser as final fallback...")
            medicines = parse_medicines(raw_text)
            ai_method = "regex"

    # Ensure confidence is a plain Python float (not np.float64)
    confidence = float(confidence)

    print("=" * 60)
    print(f"[Pipeline] DONE — Method: {ai_method}, Medicines: {len(medicines)}, Confidence: {confidence}%")
    print("=" * 60)

    # ── Save prescription to database ──
    prescription_id = None
    if user_id != "anonymous":
        try:
            # Ensure medicines are plain dicts (no numpy types)
            clean_medicines = []
            for m in medicines:
                d = m if isinstance(m, dict) else m.__dict__
                clean_medicines.append({k: (float(v) if hasattr(v, 'item') else v) for k, v in d.items()})

            rx = Prescription(
                patient_id=int(user_id),
                image_url=image_url,
                extracted_text=display_text,
                structured_text=structured_text_json,
                medicines=clean_medicines,
                confidence_score=confidence,
                status="pending",
            )
            db.add(rx)
            db.commit()
            db.refresh(rx)
            prescription_id = rx.id
            print(f"[DB] Prescription #{rx.id} saved for user {user_id}")
        except Exception as e:
            print(f"[DB] Failed to save prescription: {e}")
            db.rollback()

    return {
        "prescription_id": prescription_id,
        "extracted_text": display_text,
        "structured_data": structured_data,
        "lines": display_text.split("\n") if display_text else [],
        "confidence": confidence,
        "medicines": medicines,
        "image_url": image_url,
        "user_id": user_id,
        "used_llm": used_llm,
        "ai_method": ai_method,
    }




# ─── Existing Endpoints ───
@router.post("/prescriptions/upload", response_model=PrescriptionResponse)
def upload_prescription(
    data: PrescriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("patient")),
):
    prescription = Prescription(
        patient_id=current_user.id,
        image_url=data.image_url,
        status="pending",
    )
    db.add(prescription)
    db.commit()
    db.refresh(prescription)
    return PrescriptionResponse.model_validate(prescription)


@router.get("/prescriptions", response_model=List[PrescriptionResponse])
def get_prescriptions(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("patient")),
):
    from sqlalchemy.orm import aliased
    Doctor = aliased(User)
    
    results = (
        db.query(Prescription, Doctor.name.label("doctor_name"))
        .outerjoin(Doctor, Prescription.doctor_id == Doctor.id)
        .filter(Prescription.patient_id == current_user.id)
        .order_by(Prescription.created_at.desc())
        .all()
    )
    
    output = []
    for rx, doctor_name in results:
        data = PrescriptionResponse.model_validate(rx).model_dump()
        data["doctor_name"] = doctor_name
        output.append(data)
    return output


@router.get("/prescriptions/{rx_id}", response_model=PrescriptionResponse)
def get_prescription(
    rx_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("patient")),
):
    rx = db.query(Prescription).filter(
        Prescription.id == rx_id,
        Prescription.patient_id == current_user.id,
    ).first()
    if not rx:
        raise HTTPException(status_code=404, detail="Prescription not found")
    return PrescriptionResponse.model_validate(rx)


@router.post("/prescriptions/{rx_id}/dispense")
def dispense(
    rx_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("patient")),
):
    rx = db.query(Prescription).filter(
        Prescription.id == rx_id,
        Prescription.patient_id == current_user.id,
    ).first()
    if not rx:
        raise HTTPException(status_code=404, detail="Prescription not found")

    rx.status = "dispensed"
    db.commit()
    return {"message": "Medicines dispensed successfully", "prescription_id": rx_id}


@router.post("/receipts/upload")
async def upload_receipt(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("patient")),
):
    """
    Upload a generated PDF receipt to local Desktop and Supabase storage.
    """
    if not file.content_type or "pdf" not in file.content_type.lower():
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
        
    pdf_bytes = await file.read()
    
    # 1. Save to local Desktop
    desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
    safe_name = current_user.name.strip().replace(" ", "_")
    receipts_dir = os.path.join(desktop_path, "Medikiosk_Receipts", safe_name)
    
    os.makedirs(receipts_dir, exist_ok=True)
    local_file_path = os.path.join(receipts_dir, file.filename or "receipt.pdf")
    
    try:
        with open(local_file_path, "wb") as f:
            f.write(pdf_bytes)
        print(f"[Desktop] Saved receipt locally to {local_file_path}")
    except Exception as e:
        print(f"[Desktop] Failed to save locally: {e}")
        
    # 2. Upload to Supabase Storage
    supabase_url = None
    settings = get_settings()
    if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY and settings.SUPABASE_SERVICE_KEY != "PASTE_YOUR_SERVICE_ROLE_KEY_HERE":
        storage = SupabaseStorage(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY, bucket="prescriptions")
        
        storage_filename = f"receipts/{safe_name}/{file.filename or 'receipt.pdf'}"
        
        upload_result = storage.upload_image(
            pdf_bytes,
            filename=storage_filename,
            content_type="application/pdf",
        )
        
        if upload_result["error"]:
            print(f"[Storage] Upload warning: {upload_result['error']}")
        else:
            supabase_url = upload_result["url"]
            print(f"[Storage] Receipt saved for user {current_user.name}: {supabase_url}")
            
    return {
        "message": "Receipt saved successfully",
        "local_path": local_file_path,
        "supabase_url": supabase_url
    }
