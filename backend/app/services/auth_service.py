from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import get_settings
import json
import os

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ─── OTP Store (file-based to survive server reloads) ───
OTP_FILE = os.path.join(os.path.dirname(__file__), "..", ".otp_store.json")


def _load_otp_store() -> dict:
    """Load OTP store from file."""
    try:
        if os.path.exists(OTP_FILE):
            with open(OTP_FILE, "r") as f:
                return json.load(f)
    except Exception:
        pass
    return {}


def _save_otp_store(store: dict):
    """Save OTP store to file."""
    try:
        with open(OTP_FILE, "w") as f:
            json.dump(store, f)
    except Exception as e:
        print(f"[OTP] Warning: could not save OTP store: {e}")


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


def is_twilio_configured() -> bool:
    """Check if Twilio credentials are set."""
    return bool(
        settings.TWILIO_ACCOUNT_SID
        and settings.TWILIO_AUTH_TOKEN
        and settings.TWILIO_PHONE_NUMBER
        and settings.TWILIO_ACCOUNT_SID.startswith("AC")
    )


def normalize_phone(phone: str) -> str:
    """Normalize phone number to consistent format."""
    phone = phone.strip().replace(" ", "").replace("-", "")
    if not phone.startswith("+"):
        phone = "+91" + phone
    return phone


def generate_otp(phone: str) -> str:
    """Generate a 6-digit OTP and persist it."""
    import random
    phone = normalize_phone(phone)
    otp = str(random.randint(100000, 999999))

    store = _load_otp_store()
    store[phone] = {
        "otp": otp,
        "expires": (datetime.utcnow() + timedelta(minutes=5)).isoformat(),
    }
    _save_otp_store(store)

    print(f"[OTP] Generated OTP {otp} for {phone}")
    print(f"[OTP] Store file: {os.path.abspath(OTP_FILE)}")
    print(f"[OTP] Full store after save: {store}")
    return otp


def send_otp_sms(phone: str, otp: str) -> bool:
    """Send OTP via Twilio SMS. Returns True if sent, False if simulated."""
    phone = normalize_phone(phone)
    if not is_twilio_configured():
        print(f"[OTP] Twilio not configured — simulated mode. OTP for {phone}: {otp}")
        return False  # Simulated mode

    try:
        from twilio.rest import Client
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(
            body=f"Your MEDIKIOSK verification code is: {otp}. Valid for 5 minutes.",
            from_=settings.TWILIO_PHONE_NUMBER,
            to=phone,
        )
        print(f"[OTP] SMS sent to {phone} via Twilio")
        return True  # Real SMS sent
    except Exception as e:
        print(f"[Twilio Error] Failed to send SMS to {phone}: {e}")
        return False  # Fallback to simulated


def verify_otp(phone: str, otp: str) -> bool:
    """Verify OTP from persistent store."""
    phone = normalize_phone(phone)
    otp = otp.strip()  # Remove any whitespace
    store = _load_otp_store()

    print(f"[OTP] ──── VERIFY START ────")
    print(f"[OTP] Phone (normalized): '{phone}'")
    print(f"[OTP] OTP input: '{otp}' (len={len(otp)})")
    print(f"[OTP] Store file: {os.path.abspath(OTP_FILE)}")
    print(f"[OTP] Store contents: {store}")
    print(f"[OTP] Store keys: {list(store.keys())}")

    stored = store.get(phone)
    if not stored:
        print(f"[OTP] FAILED — No OTP found for phone '{phone}'")
        # Check if there's a similar key
        for key in store.keys():
            print(f"[OTP]   Stored key: '{key}' | Match: {key == phone} | repr: {repr(key)} vs {repr(phone)}")
        return False

    # Check expiry
    expires = datetime.fromisoformat(stored["expires"])
    now = datetime.utcnow()
    print(f"[OTP] Expiry: {expires} | Now: {now} | Expired: {now > expires}")
    if now > expires:
        print(f"[OTP] FAILED — OTP expired for {phone}")
        del store[phone]
        _save_otp_store(store)
        return False

    # Check OTP match
    print(f"[OTP] Comparing: stored='{stored['otp']}' vs input='{otp}' | Match: {stored['otp'] == otp}")
    if stored["otp"] == otp:
        print(f"[OTP] SUCCESS — OTP verified for {phone}")
        del store[phone]
        _save_otp_store(store)
        return True

    print(f"[OTP] FAILED — Wrong OTP. Expected '{stored['otp']}', got '{otp}'")
    return False
