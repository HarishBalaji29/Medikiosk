from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.prescription import Prescription
from app.schemas.schemas import PrescriptionResponse
from app.middleware.auth import require_role

router = APIRouter(prefix="/api/doctor", tags=["Doctor"])


@router.get("/prescriptions/pending", response_model=List[PrescriptionResponse])
def get_pending(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("doctor")),
):
    prescriptions = db.query(Prescription).filter(
        Prescription.status.in_(["pending", "processed"])
    ).order_by(Prescription.created_at.desc()).all()
    return [PrescriptionResponse.model_validate(rx) for rx in prescriptions]


@router.post("/prescriptions/{rx_id}/approve", response_model=PrescriptionResponse)
def approve_prescription(
    rx_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("doctor")),
):
    rx = db.query(Prescription).filter(Prescription.id == rx_id).first()
    if not rx:
        raise HTTPException(status_code=404, detail="Prescription not found")
    rx.status = "approved"
    rx.doctor_id = current_user.id
    db.commit()
    db.refresh(rx)
    return PrescriptionResponse.model_validate(rx)


@router.post("/prescriptions/{rx_id}/reject", response_model=PrescriptionResponse)
def reject_prescription(
    rx_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("doctor")),
):
    rx = db.query(Prescription).filter(Prescription.id == rx_id).first()
    if not rx:
        raise HTTPException(status_code=404, detail="Prescription not found")
    rx.status = "rejected"
    rx.doctor_id = current_user.id
    db.commit()
    db.refresh(rx)
    return PrescriptionResponse.model_validate(rx)
