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
@router.get("/machines/status", response_model=List[MachineResponse])
def get_machines(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    machines = db.query(Machine).all()
    return [MachineResponse.model_validate(m) for m in machines]


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
@router.get("/users", response_model=List[UserResponse])
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    users = db.query(User).all()
    return [UserResponse.model_validate(u) for u in users]


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
