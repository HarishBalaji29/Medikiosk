from sqlalchemy import Column, Integer, String, DateTime, Text, func
from app.database import Base


class Machine(Base):
    __tablename__ = "machines"

    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(200), nullable=False)
    location = Column(String(255), nullable=True)
    status = Column(String(20), default="online")  # online, offline, maintenance
    last_ping = Column(DateTime, nullable=True)
    last_dispense = Column(DateTime, nullable=True)
    dispensed_today = Column(Integer, default=0)
    error_log = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
