from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.medicine import Medicine
from app.models.machine import Machine
from app.schemas.schemas import (
    MedicineCreate, MedicineUpdate, MedicineResponse,
    MachineCreate, MachineResponse, UserResponse, AdminStats,
    AdminUserResponse
)
from app.middleware.auth import require_role

router = APIRouter(prefix="/api/admin", tags=["Admin"])


# ─── Inventory ───
@router.get("/inventory", response_model=List[MedicineResponse])
def get_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    medicines = db.query(Medicine).all()
    return [MedicineResponse.model_validate(m) for m in medicines]


@router.post("/inventory/add", response_model=MedicineResponse)
def add_medicine(
    data: MedicineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    medicine = Medicine(**data.model_dump())
    db.add(medicine)
    db.commit()
    db.refresh(medicine)
    return MedicineResponse.model_validate(medicine)


@router.put("/inventory/{med_id}/update", response_model=MedicineResponse)
def update_medicine(
    med_id: int,
    data: MedicineUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    medicine = db.query(Medicine).filter(Medicine.id == med_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(medicine, key, value)
    db.commit()
    db.refresh(medicine)
    return MedicineResponse.model_validate(medicine)


@router.delete("/inventory/{med_id}")
def delete_medicine(
    med_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    medicine = db.query(Medicine).filter(Medicine.id == med_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    db.delete(medicine)
    db.commit()
    return {"message": "Medicine deleted"}


# ─── Machines ───
@router.get("/machines/status")
def get_machines(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    machines = db.query(Machine).all()
    output = []
    from datetime import datetime, timezone
    
    for m in machines:
        errors = len([e for e in m.error_log.split(',') if e.strip()]) if m.error_log else 0
        
        # Calculate human readable ping using last_ping
        ping_str = "Just now"
        if m.last_ping:
            diff = datetime.now() - m.last_ping
            if diff.total_seconds() < 60:
                ping_str = "Just now"
            elif diff.total_seconds() < 3600:
                ping_str = f"{int(diff.total_seconds() // 60)} mins ago"
            else:
                ping_str = f"{int(diff.total_seconds() // 3600)} hours ago"
        
        output.append({
            "id": m.machine_id,
            "name": m.name,
            "location": m.location or "Unknown",
            "status": m.status,
            "stockPct": 85, # Default hardware stock simulation
            "lastPing": ping_str,
            "errors": errors,
            "itemsDispensed": m.dispensed_today
        })
    return output


@router.post("/machines", response_model=MachineResponse)
def add_machine(
    data: MachineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    machine = Machine(**data.model_dump())
    db.add(machine)
    db.commit()
    db.refresh(machine)
    return MachineResponse.model_validate(machine)


# ─── Users ───
@router.get("/users", response_model=List[AdminUserResponse])
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    users = db.query(User).all()
    from app.models.prescription import Prescription

    output = []
    for u in users:
        data = UserResponse.model_validate(u).model_dump()

        data["status"] = "active" if getattr(u, "is_active", True) else "offline"
        data["joined"] = u.created_at.strftime("%b %d, %Y") if getattr(u, "created_at", None) else "Jan 01, 2026"

        # Activity summary
        if u.role == "patient":
            cnt = db.query(Prescription).filter(Prescription.patient_id == u.id).count()
            data["activity"] = f"{cnt} prescriptions uploaded"
        elif u.role == "doctor":
            cnt = db.query(Prescription).filter(Prescription.doctor_id == u.id).count()
            data["activity"] = f"{cnt} prescriptions handled"
        else:
            data["activity"] = "System Administrator"

        output.append(data)

    return output


# ─── Stats ───
@router.get("/stats", response_model=AdminStats)
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    total_users = db.query(User).count()
    total_patients = db.query(User).filter(User.role == "patient").count()
    total_doctors = db.query(User).filter(User.role == "doctor").count()
    total_medicines = db.query(Medicine).count()
    low_stock = db.query(Medicine).filter(
        Medicine.stock_quantity > 0,
        Medicine.stock_quantity <= Medicine.min_threshold,
    ).count()
    out_of_stock = db.query(Medicine).filter(Medicine.stock_quantity == 0).count()
    total_machines = db.query(Machine).count()
    active_machines = db.query(Machine).filter(Machine.status == "online").count()

    return AdminStats(
        total_users=total_users,
        total_patients=total_patients,
        total_doctors=total_doctors,
        total_medicines=total_medicines,
        low_stock_count=low_stock,
        out_of_stock_count=out_of_stock,
        active_machines=active_machines,
        total_machines=total_machines,
        dispensed_today=142,
    )
