from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.prescription import Prescription
from app.schemas.schemas import PrescriptionResponse
from app.middleware.auth import require_role

router = APIRouter(prefix="/api/doctor", tags=["Doctor"])


@router.get("/prescriptions")
def get_all_prescriptions(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("doctor")),
):
    # Join with User to get patient name
    results = (
        db.query(Prescription, User.name)
        .join(User, Prescription.patient_id == User.id)
        .order_by(Prescription.created_at.desc())
        .all()
    )
    
    output = []
    for rx, patient_name in results:
        data = PrescriptionResponse.model_validate(rx).model_dump()
        data["patient_name"] = patient_name
        output.append(data)
        
    return output

@router.get("/patients")
def get_patients(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("doctor")),
):
    # Get all users who have the role 'patient'
    patients = db.query(User).filter(User.role == "patient").all()
    
    output = []
    for p in patients:
        # Count their prescriptions
        rx_count = db.query(Prescription).filter(Prescription.patient_id == p.id).count()
        output.append({
            "id": p.id,
            "name": p.name,
            "phone": p.phone,
            "email": p.email,
            "rx_count": rx_count,
        })
    return output


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
