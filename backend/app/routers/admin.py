from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.core.deps import RBACGuard
from app.models.models import User, MahasiswaProfile, JobVacancy, Match, JobBookmark
from app.schemas.schemas import AdminUserItem, UserUpdateStatusRole, AdminStatisticsResponse

router = APIRouter(prefix="/admin", tags=["Administrasi Sistem (FR-11, FR-12)"])

@router.get("/users", response_model=List[AdminUserItem])
def get_all_users(
    db: Session = Depends(get_db),
    admin: User = Depends(RBACGuard(["admin"]))
):
    """FR-11: Admin melihat daftar seluruh akun pengguna beserta peran dan status aktivasinya."""
    users = db.query(User).order_by(User.created_at.desc()).all()
    results = []

    for u in users:
        profile = db.query(MahasiswaProfile).filter(MahasiswaProfile.user_id == u.id).first()
        results.append(
            AdminUserItem(
                id=u.id,
                email=u.email,
                role=u.role,
                is_active=u.is_active,
                created_at=u.created_at,
                full_name=profile.full_name if profile else ("Administrator" if u.role == "admin" else None),
                nim=profile.nim if profile else None,
                github_username=profile.github_username if profile else None
            )
        )
    return results

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

    # Cegah admin menonaktifkan dirinya sendiri
    if user.id == admin.id and req.is_active is False:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Administrator tidak dapat menonaktifkan akun sendiri."
        )

    if req.is_active is not None:
        user.is_active = req.is_active

    if req.role is not None:
        if req.role not in ["mahasiswa", "admin"]:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Role yang diizinkan hanya 'mahasiswa' atau 'admin'."
            )
        user.role = req.role

    db.commit()
    db.refresh(user)

    profile = db.query(MahasiswaProfile).filter(MahasiswaProfile.user_id == user.id).first()
    return AdminUserItem(
        id=user.id,
        email=user.email,
        role=user.role,
        is_active=user.is_active,
        created_at=user.created_at,
        full_name=profile.full_name if profile else None,
        nim=profile.nim if profile else None,
        github_username=profile.github_username if profile else None
    )

@router.get("/statistics", response_model=AdminStatisticsResponse)
def get_system_statistics(
    db: Session = Depends(get_db),
    admin: User = Depends(RBACGuard(["admin"]))
):
    """FR-12: Analitik jumlah lowongan per platform (LinkedIn, Fiverr, Upwork), statistik kecocokan, dan interaksi mahasiswa."""
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    total_mahasiswa = db.query(User).filter(User.role == "mahasiswa").count()
    total_admin = db.query(User).filter(User.role == "admin").count()

    total_jobs = db.query(JobVacancy).count()

    # Agregasi per platform (LinkedIn, Fiverr, Upwork, Manual)
    platform_rows = (
        db.query(JobVacancy.platform_source, func.count(JobVacancy.id))
        .group_by(JobVacancy.platform_source)
        .all()
    )
    jobs_by_platform = {"linkedin": 0, "fiverr": 0, "upwork": 0, "manual": 0}
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
