from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ─── Auth Schemas ───
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = None
    role: str = "patient"
    specialization: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


class OTPRequest(BaseModel):
    phone: str


class OTPVerify(BaseModel):
    phone: str
    otp: str
    role: str = "patient"


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    role: str
    specialization: Optional[str] = None
    is_active: bool = True

    class Config:
        from_attributes = True


# ─── Prescription Schemas ───
class PrescriptionCreate(BaseModel):
    image_url: Optional[str] = None


class MedicineItem(BaseModel):
    name: str
    dosage: str
    frequency: str
    duration: str
    available: bool = True
    price: float = 0.0


class PrescriptionResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: Optional[int] = None
    image_url: Optional[str] = None
    extracted_text: Optional[str] = None
    medicines: Optional[list] = None
    status: str
    confidence_score: Optional[float] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Medicine Schemas ───
class MedicineCreate(BaseModel):
    name: str
    dosage: str
    generic_name: Optional[str] = None
    dosage_form: Optional[str] = None
    stock_quantity: int = 0
    min_threshold: int = 10
    unit_price: float = 0.0
    manufacturer: Optional[str] = None
    expiry_date: Optional[str] = None


class MedicineUpdate(BaseModel):
    name: Optional[str] = None
    stock_quantity: Optional[int] = None
    unit_price: Optional[float] = None
    min_threshold: Optional[int] = None
    expiry_date: Optional[str] = None
    is_available: Optional[bool] = None


class MedicineResponse(BaseModel):
    id: int
    name: str
    dosage: str
    generic_name: Optional[str] = None
    stock_quantity: int
    min_threshold: int
    unit_price: float
    manufacturer: Optional[str] = None
    expiry_date: Optional[str] = None
    is_available: bool

    class Config:
        from_attributes = True


# ─── Machine Schemas ───
class MachineCreate(BaseModel):
    machine_id: str
    name: str
    location: Optional[str] = None


class MachineResponse(BaseModel):
    id: int
    machine_id: str
    name: str
    location: Optional[str] = None
    status: str
    dispensed_today: int
    last_dispense: Optional[datetime] = None
    error_log: Optional[str] = None

    class Config:
        from_attributes = True


# ─── Stats ───
class AdminStats(BaseModel):
    total_users: int
    total_patients: int
    total_doctors: int
    total_medicines: int
    low_stock_count: int
    out_of_stock_count: int
    active_machines: int
    total_machines: int
    dispensed_today: int
