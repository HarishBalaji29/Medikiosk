from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime, func
from app.database import Base


class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    generic_name = Column(String(200), nullable=True)
    dosage = Column(String(100), nullable=False)
    dosage_form = Column(String(50), nullable=True)  # tablet, capsule, syrup
    stock_quantity = Column(Integer, default=0)
    min_threshold = Column(Integer, default=10)
    unit_price = Column(Float, default=0.0)
    manufacturer = Column(String(200), nullable=True)
    expiry_date = Column(Date, nullable=True)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
