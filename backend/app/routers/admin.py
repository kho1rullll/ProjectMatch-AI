from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.config import settings
from app.core.database import get_db
from app.core.deps import RBACGuard
from app.core.security import get_password_hash
from app.models.models import User, MahasiswaProfile, JobVacancy, Match, JobBookmark, Embedding, Notification
from app.schemas.schemas import (
    AdminUserItem,
    UserUpdateStatusRole,
    AdminResetPasswordRequest,
    AdminStatisticsResponse,
)

router = APIRouter(prefix="/admin", tags=["Administrasi Sistem (FR-11, FR-12)"])


def _is_permanent_admin_user(user: User) -> bool:
    return bool(
        settings.ADMIN_EMAIL
        and user.email.lower() == settings.ADMIN_EMAIL.strip().lower()
    )


def _serialize_admin_user(user: User, db: Session) -> AdminUserItem:
    profile = db.query(MahasiswaProfile).filter(MahasiswaProfile.user_id == user.id).first()
    full_name = profile.full_name if profile else (settings.ADMIN_NAME if user.role == "admin" else None)
    return AdminUserItem(
        id=user.id,
        email=user.email,
        role=user.role,
        is_active=user.is_active,
        created_at=user.created_at,
        full_name=full_name,
        nim=profile.nim if profile else None,
        github_username=profile.github_username if profile else None,
        is_permanent_admin=_is_permanent_admin_user(user),
    )


@router.get("/users", response_model=List[AdminUserItem])
def get_all_users(
    db: Session = Depends(get_db),
    admin: User = Depends(RBACGuard(["admin"]))
):
    """FR-11: Admin melihat daftar seluruh akun pengguna beserta peran dan status aktivasinya."""
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [_serialize_admin_user(u, db) for u in users]


@router.patch("/users", response_model=AdminUserItem)
def update_user_status_or_role(
    req: UserUpdateStatusRole,
    db: Session = Depends(get_db),
    admin: User = Depends(RBACGuard(["admin"]))
):
    """FR-11: Admin mengubah status aktivasi (is_active) dan/atau role akun pengguna."""
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pengguna tidak ditemukan."
        )

    is_self = user.id == admin.id
    is_perm_admin = _is_permanent_admin_user(user)

    # Validasi seluruh larangan sebelum memodifikasi entitas
    if req.is_active is False and (is_self or is_perm_admin):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Akun administrator utama bersifat paten dan tidak dapat dinonaktifkan."
                if is_perm_admin
                else "Administrator tidak dapat menonaktifkan akun sendiri."
            ),
        )

    if req.role is not None:
        if req.role not in ["mahasiswa", "admin"]:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Role yang diizinkan hanya 'mahasiswa' atau 'admin'."
            )
        if (is_self or is_perm_admin) and req.role != user.role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Status peran administrator bersifat paten dan tidak dapat diubah pada akun sendiri."
            )

    if req.is_active is not None:
        user.is_active = req.is_active

    if req.role is not None:
        user.role = req.role

    db.commit()
    db.refresh(user)

    return _serialize_admin_user(user, db)


def _ensure_mutable_target_user(user: User, admin: User, action_label: str) -> None:
    if user.id == admin.id or _is_permanent_admin_user(user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Akun administrator utama/sendiri bersifat paten dan tidak dapat {action_label}.",
        )


@router.post("/users/{user_id}/reset-password", response_model=AdminUserItem)
def reset_user_password(
    user_id: str,
    req: AdminResetPasswordRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(RBACGuard(["admin"]))
):
    """FR-11: Admin mereset kata sandi akun pengguna non-paten."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pengguna tidak ditemukan."
        )

    _ensure_mutable_target_user(user, admin, "direset kata sandinya melalui manajemen pengguna")
    user.password_hash = get_password_hash(req.new_password)
    db.commit()
    db.refresh(user)
    return _serialize_admin_user(user, db)


@router.delete("/users/{user_id}")
def delete_user_account(
    user_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(RBACGuard(["admin"]))
):
    """FR-11: Admin menghapus akun pengguna non-paten beserta seluruh data profil dan kecocokannya."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pengguna tidak ditemukan."
        )

    _ensure_mutable_target_user(user, admin, "dihapus")

    profile = db.query(MahasiswaProfile).filter(MahasiswaProfile.user_id == user.id).first()
    if profile:
        db.query(Match).filter(Match.mahasiswa_id == profile.id).delete()
        db.query(JobBookmark).filter(JobBookmark.mahasiswa_id == profile.id).delete()
        db.query(Embedding).filter(Embedding.mahasiswa_id == profile.id).delete()
        db.delete(profile)

    db.query(Notification).filter(Notification.user_id == user.id).delete()
    db.delete(user)
    db.commit()
    return {"status": "deleted", "user_id": user_id, "email": user.email}

@router.get("/statistics", response_model=AdminStatisticsResponse)
def get_system_statistics(
    db: Session = Depends(get_db),
    admin: User = Depends(RBACGuard(["admin"]))
):
    """FR-12: Analitik jumlah lowongan per platform (LinkedIn, Freelancer.com, Kalibrr, Remotive), statistik kecocokan, dan interaksi mahasiswa."""
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    total_mahasiswa = db.query(User).filter(User.role == "mahasiswa").count()
    total_admin = db.query(User).filter(User.role == "admin").count()

    total_jobs = db.query(JobVacancy).count()

    # Agregasi per platform (LinkedIn, Freelancer.com, Kalibrr, Remotive)
    platform_rows = (
        db.query(JobVacancy.platform_source, func.count(JobVacancy.id))
        .group_by(JobVacancy.platform_source)
        .all()
    )
    jobs_by_platform = {"linkedin": 0, "freelancer": 0, "kalibrr": 0, "remotive": 0}
    for p, count in platform_rows:
        jobs_by_platform[p.lower()] = count

    # Agregasi per job type (freelance, part_time)
    type_rows = (
        db.query(JobVacancy.job_type, func.count(JobVacancy.id))
        .group_by(JobVacancy.job_type)
        .all()
    )
    jobs_by_type = {"freelance": 0, "part_time": 0}
    for t, count in type_rows:
        jobs_by_type[t.lower()] = count

    total_matches = db.query(Match).count()
    total_bookmarks = db.query(JobBookmark).count()

    avg_score_row = db.query(func.avg(Match.similarity_score)).scalar()
    avg_score = round(float(avg_score_row), 3) if avg_score_row is not None else 0.825

    return AdminStatisticsResponse(
        total_users=total_users,
        active_users=active_users,
        total_mahasiswa=total_mahasiswa,
        total_admin=total_admin,
        total_jobs=total_jobs,
        jobs_by_platform=jobs_by_platform,
        jobs_by_type=jobs_by_type,
        total_matches_computed=total_matches,
        total_bookmarks=total_bookmarks,
        average_similarity_score=avg_score
    )
