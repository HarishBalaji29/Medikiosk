from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import get_settings

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ─── OTP Store (in-memory for demo) ───
otp_store = {}


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None


def generate_otp(phone: str) -> str:
    """Generate a 6-digit OTP (simulated)."""
    import random
    otp = str(random.randint(100000, 999999))
    otp_store[phone] = {"otp": otp, "expires": datetime.utcnow() + timedelta(minutes=5)}
    return otp


def verify_otp(phone: str, otp: str) -> bool:
    """Verify OTP (simulated)."""
    stored = otp_store.get(phone)
    if not stored:
        return False
    if datetime.utcnow() > stored["expires"]:
        del otp_store[phone]
        return False
    if stored["otp"] == otp:
        del otp_store[phone]
        return True
    return False
