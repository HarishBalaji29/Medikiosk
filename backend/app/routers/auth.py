from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.schemas import UserCreate, UserLogin, UserResponse, Token, OTPRequest, OTPVerify
from app.services.auth_service import (
    hash_password, verify_password, create_access_token,
    generate_otp, verify_otp, send_otp_sms, normalize_phone
)
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=Token)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    import traceback
    try:
        # Check existing email
        existing = db.query(User).filter(User.email == user_data.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Check existing phone
        if user_data.phone:
            phone = normalize_phone(user_data.phone)
            existing_phone = db.query(User).filter(User.phone == phone).first()
            if existing_phone:
                raise HTTPException(
                    status_code=400,
                    detail=f"Phone number {phone} is already registered to another account"
                )
        else:
            phone = None

        user = User(
            name=user_data.name,
            email=user_data.email,
            phone=phone,
            hashed_password=hash_password(user_data.password),
            role=user_data.role,
            specialization=user_data.specialization,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        token = create_access_token({"sub": str(user.id), "role": user.role})
        return Token(
            access_token=token,
            user=UserResponse.model_validate(user),
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        tb = traceback.format_exc()
        print(f"\n[REGISTER ERROR]\n{tb}")
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {str(e)}")


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return Token(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/send-otp")
def send_otp(request: OTPRequest):
    """Send OTP to phone number (via Twilio or simulated)."""
    phone = normalize_phone(request.phone)
    otp = generate_otp(phone)
    sms_sent = send_otp_sms(phone, otp)

    if sms_sent:
        return {"message": f"OTP sent to {phone}", "mode": "twilio"}
    else:
        # Simulated mode — return OTP in response for testing
        return {"message": f"OTP sent to {phone}", "mode": "simulated", "demo_otp": otp}


@router.post("/verify-otp", response_model=Token)
def verify_otp_endpoint(request: OTPVerify, db: Session = Depends(get_db)):
    phone = normalize_phone(request.phone)

    if not verify_otp(phone, request.otp):
        raise HTTPException(status_code=400, detail="Incorrect OTP. Please check and try again.")

    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        # Auto-create user with the given name or fallback
        patient_name = request.name.strip() if request.name and request.name.strip() else f"Patient {phone[-4:]}"
        user = User(
            name=patient_name,
            email=f"{phone.replace('+', '')}@otp.medikiosk.com",
            phone=phone,
            hashed_password=hash_password("otp-user"),
            role=request.role or "patient",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"[Auth] New user created via OTP: {user.name} ({user.role}) - {phone}")
    elif request.name and request.name.strip() and user.name.startswith("Patient "):
        # Update name if user still has the auto-generated name
        user.name = request.name.strip()
        db.commit()
        db.refresh(user)
        print(f"[Auth] Updated user name to: {user.name}")

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return Token(access_token=token, user=UserResponse.model_validate(user))


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)
