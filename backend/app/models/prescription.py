from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON, func
from app.database import Base


class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    image_url = Column(String(500), nullable=True)
    extracted_text = Column(Text, nullable=True)
    medicines = Column(JSON, nullable=True)
    status = Column(String(20), default="pending")  # pending, approved, rejected, dispensed
    confidence_score = Column(Float, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
