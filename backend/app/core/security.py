from datetime import datetime, timedelta, timezone
from typing import Any, Union, Optional
import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, VerificationError
from app.core.config import settings

# Inisialisasi PasswordHasher dengan parameter Argon2id default aman
ph = PasswordHasher()

def get_password_hash(password: str) -> str:
    """Hash password menggunakan algoritma Argon2id sesuai SKPL & NFR-05."""
    return ph.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifikasi password plain text terhadap hash Argon2id (dengan fallback bcrypt/plain bila ada migrasi)."""
    if not hashed_password:
        return False
    try:
        return ph.verify(hashed_password, plain_password)
    except (VerifyMismatchError, VerificationError):
        # Fallback jika ada password plain text legacy
        if plain_password == hashed_password:
            return True
        return False
    except Exception:
        return plain_password == hashed_password

def create_access_token(subject: Union[str, Any], role: str, expires_delta: Optional[timedelta] = None) -> str:
    """Penerbitan token JWT dengan klaim user_id, role, dan kedaluwarsa."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "sub": str(subject),
        "role": role,
        "exp": expire,
        "iat": datetime.now(timezone.utc)
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """Dekode dan verifikasi tanda tangan token JWT."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None
