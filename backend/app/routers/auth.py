from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.models import User, MahasiswaProfile
from app.schemas.schemas import UserRegister, UserLogin, Token

router = APIRouter(prefix="/auth", tags=["Autentikasi (FR-01)"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_user(req: UserRegister, db: Session = Depends(get_db)):
    """FR-01: Registrasi akun baru (khusus mahasiswa sesuai Catatan Penyelarasan SKPL Bab 14)."""
    normalized_email = req.email.strip().lower()
    normalized_nim = req.nim.strip().upper()
    normalized_github = req.github_username.strip()

    # D01: Email tidak boleh ganda
    if db.query(User).filter(func.lower(User.email) == normalized_email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email sudah terdaftar dalam sistem."
        )

    # D01: NIM tidak boleh ganda
    if db.query(MahasiswaProfile).filter(func.upper(MahasiswaProfile.nim) == normalized_nim).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Nomor Induk Mahasiswa (NIM) sudah terdaftar."
        )

    # D11: GitHub username unik (case-insensitive)
    if db.query(MahasiswaProfile).filter(func.lower(MahasiswaProfile.github_username) == normalized_github.lower()).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username GitHub sudah ditautkan ke akun lain."
        )

    # D03: Password di-hash menggunakan Argon2id
    password_hash = get_password_hash(req.password)

    new_user = User(
        email=normalized_email,
        password_hash=password_hash,
        role="mahasiswa",
        is_active=True
    )
    db.add(new_user)
    db.flush()

    new_profile = MahasiswaProfile(
        user_id=new_user.id,
        full_name=req.full_name.strip(),
        nim=normalized_nim,
        program_studi=req.program_studi,
        angkatan=req.angkatan,
        github_username=normalized_github,
        processing_status="pending"
    )
    db.add(new_profile)
    db.commit()

    token = create_access_token(subject=new_user.id, role=new_user.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "role": new_user.role,
            "name": new_profile.full_name,
            "full_name": new_profile.full_name,
            "nim": new_profile.nim,
            "github_username": new_profile.github_username
        }
    }

@router.post("/login", response_model=Token, status_code=status.HTTP_200_OK)
def login_user(req: UserLogin, db: Session = Depends(get_db)):
    """FR-01: Login dengan email & password ter-hash Argon2id, menerbitkan token JWT."""
    normalized_email = req.email.strip().lower()
    user = db.query(User).filter(func.lower(User.email) == normalized_email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau kata sandi tidak valid.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun ini telah dinonaktifkan oleh administrator."
        )

    profile = db.query(MahasiswaProfile).filter(MahasiswaProfile.user_id == user.id).first()
    token = create_access_token(subject=user.id, role=user.role)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "name": profile.full_name if profile else settings.ADMIN_NAME,
            "full_name": profile.full_name if profile else settings.ADMIN_NAME,
            "nim": profile.nim if profile else None,
            "github_username": profile.github_username if profile else None
        }
    }
