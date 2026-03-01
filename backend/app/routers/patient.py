from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.prescription import Prescription
from app.schemas.schemas import PrescriptionCreate, PrescriptionResponse
from app.middleware.auth import require_role

router = APIRouter(prefix="/api/patient", tags=["Patient"])


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


@router.post("/prescriptions/process", response_model=PrescriptionResponse)
def process_prescription(
    prescription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("patient")),
):
    rx = db.query(Prescription).filter(
        Prescription.id == prescription_id,
        Prescription.patient_id == current_user.id,
    ).first()
    if not rx:
        raise HTTPException(status_code=404, detail="Prescription not found")

    # Simulated AI processing
    rx.extracted_text = "Dr. Priya Patel\nRx:\n1. Amoxicillin 500mg 1-0-1 x 7 days\n2. Paracetamol 650mg SOS"
    rx.medicines = [
        {"name": "Amoxicillin", "dosage": "500mg", "frequency": "1-0-1", "duration": "7 days", "available": True, "price": 5.50},
        {"name": "Paracetamol", "dosage": "650mg", "frequency": "SOS", "duration": "As needed", "available": True, "price": 2.00},
    ]
    rx.confidence_score = 94.7
    rx.status = "processed"
    db.commit()
    db.refresh(rx)
    return PrescriptionResponse.model_validate(rx)


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
