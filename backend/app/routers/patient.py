from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.models.prescription import Prescription
from app.schemas.schemas import PrescriptionCreate, PrescriptionResponse
from app.middleware.auth import require_role
from app.services.ocr_service import extract_text, parse_medicines
from app.services.storage_service import SupabaseStorage
from app.config import get_settings

router = APIRouter(prefix="/api/patient", tags=["Patient"])


# ─── Real OCR Scan + Supabase Upload + DB Save ───
@router.post("/prescriptions/scan")
async def scan_prescription(
    file: UploadFile = File(...),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """Upload a prescription image, save to Supabase Storage under user's folder, run OCR, and save to DB."""
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
        # Store under user-specific path: user_{id}/timestamp_filename
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

    # Run OCR
    ocr_result = extract_text(image_bytes)

    if ocr_result["error"]:
        raise HTTPException(status_code=422, detail=f"OCR failed: {ocr_result['error']}")

    # Parse medicines from extracted text
    medicines = parse_medicines(ocr_result["text"])

    # Save prescription to database if user is known
    prescription_id = None
    if user_id != "anonymous":
        try:
            rx = Prescription(
                patient_id=int(user_id),
                image_url=image_url,
                extracted_text=ocr_result["text"],
                medicines=[m.__dict__ if hasattr(m, '__dict__') else m for m in medicines],
                confidence_score=ocr_result["confidence"],
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
        "extracted_text": ocr_result["text"],
        "lines": ocr_result["lines"],
        "confidence": ocr_result["confidence"],
        "medicines": medicines,
        "image_url": image_url,
        "user_id": user_id,
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
    prescriptions = db.query(Prescription).filter(
        Prescription.patient_id == current_user.id
    ).order_by(Prescription.created_at.desc()).all()
    return [PrescriptionResponse.model_validate(rx) for rx in prescriptions]


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
