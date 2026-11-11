from typing import Optional, List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user, get_current_mahasiswa_profile, RBACGuard
from app.models.models import JobVacancy, JobBookmark, User, MahasiswaProfile, Match
from app.schemas.schemas import JobResponse, BookmarkResponse
from app.services.job_ingestion import job_ingestion_service

router = APIRouter(tags=["Lowongan & Bookmarks (FR-04, FR-08, FR-10)"])

@router.get("/jobs", response_model=List[JobResponse])
def get_jobs(
    platform: Optional[str] = Query(None, description="Filter: linkedin, fiverr, upwork"),
    job_type: Optional[str] = Query(None, description="Filter: freelance, part_time"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """FR-04, FR-08: Mengambil daftar lowongan freelance dan part-time berstatus open (D08)."""
    query = db.query(JobVacancy).filter(JobVacancy.status == "open")

    if platform and platform.lower() != "semua":
        query = query.filter(JobVacancy.platform_source == platform.lower())
    if job_type and job_type.lower() != "semua":
        query = query.filter(JobVacancy.job_type == job_type.lower())

    jobs = query.order_by(JobVacancy.created_at.desc()).all()

    # Periksa apakah mahasiswa telah mem-bookmark atau memiliki skor kecocokan
    bookmarked_job_ids = set()
    similarity_map = {}
    if current_user.role == "mahasiswa":
        profile = db.query(MahasiswaProfile).filter(MahasiswaProfile.user_id == current_user.id).first()
        if profile:
            bookmarks = db.query(JobBookmark.job_vacancy_id).filter(JobBookmark.mahasiswa_id == profile.id).all()
            bookmarked_job_ids = {b[0] for b in bookmarks}

            matches = db.query(Match.job_vacancy_id, Match.similarity_score).filter(Match.mahasiswa_id == profile.id).all()
            similarity_map = {m[0]: m[1] for m in matches}

    results = []
    for j in jobs:
        resp = JobResponse.model_validate(j)
        resp.is_bookmarked = j.id in bookmarked_job_ids
        resp.similarity_score = similarity_map.get(j.id)
        results.append(resp)

    return results

@router.get("/jobs/{job_id}", response_model=JobResponse)
def get_job_detail(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """FR-08: Melihat rincian lowongan eksternal dan tautan lamaran (external_url)."""
    job = db.query(JobVacancy).filter(JobVacancy.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lowongan pekerjaan tidak ditemukan."
        )

    resp = JobResponse.model_validate(job)
    if current_user.role == "mahasiswa":
        profile = db.query(MahasiswaProfile).filter(MahasiswaProfile.user_id == current_user.id).first()
        if profile:
            bm = db.query(JobBookmark).filter(
                JobBookmark.mahasiswa_id == profile.id,
                JobBookmark.job_vacancy_id == job.id
            ).first()
            resp.is_bookmarked = bm is not None

            mt = db.query(Match).filter(
                Match.mahasiswa_id == profile.id,
                Match.job_vacancy_id == job.id
            ).first()
            if mt:
                resp.similarity_score = mt.similarity_score

    return resp

@router.post("/jobs/sync", status_code=status.HTTP_200_OK)
async def sync_external_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(RBACGuard(["admin"]))
):
    """FR-04, FR-10: Memicu penarikan data lowongan dari LinkedIn, Fiverr, dan Upwork (Admin / Scheduler)."""
    result = await job_ingestion_service.ingest_jobs(db)
    return {
        "status": "success",
        "message": f"Agregasi lowongan berhasil disinkronkan. {result['added']} lowongan baru ditambahkan, {result['updated']} diperbarui.",
        "details": result
    }

@router.post("/jobs/{job_id}/bookmark", response_model=BookmarkResponse, status_code=status.HTTP_201_CREATED)
def bookmark_job(
    job_id: str,
    profile: MahasiswaProfile = Depends(get_current_mahasiswa_profile),
    db: Session = Depends(get_db)
):
    """FR-08: Menyimpan lowongan favorit untuk dilamar mahasiswa ke platform asal."""
    job = db.query(JobVacancy).filter(JobVacancy.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lowongan pekerjaan tidak ditemukan."
        )

    # D07: Mahasiswa tidak dapat menyimpan bookmark yang sama dua kali (409 Conflict)
    existing_bookmark = db.query(JobBookmark).filter(
        JobBookmark.mahasiswa_id == profile.id,
        JobBookmark.job_vacancy_id == job_id
    ).first()

    if existing_bookmark:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Lowongan ini sudah ada di daftar bookmark tersimpan Anda."
        )

    bookmark = JobBookmark(
        mahasiswa_id=profile.id,
        job_vacancy_id=job.id,
        created_at=datetime.now(timezone.utc)
    )
    db.add(bookmark)
    db.commit()
    db.refresh(bookmark)

    return {
        "id": bookmark.id,
        "job_id": job.id,
        "message": f"Lowongan '{job.title}' berhasil disimpan.",
        "created_at": bookmark.created_at
    }

@router.delete("/jobs/{job_id}/bookmark", status_code=status.HTTP_200_OK)
def remove_bookmark(
    job_id: str,
    profile: MahasiswaProfile = Depends(get_current_mahasiswa_profile),
    db: Session = Depends(get_db)
):
    """FR-08: Menghapus bookmark lowongan dari daftar tersimpan mahasiswa."""
    bookmark = db.query(JobBookmark).filter(
        JobBookmark.mahasiswa_id == profile.id,
        JobBookmark.job_vacancy_id == job_id
    ).first()

    if not bookmark:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bookmark tidak ditemukan."
        )

    db.delete(bookmark)
    db.commit()
    return {"status": "success", "message": "Lowongan dihapus dari bookmark."}

@router.get("/bookmarks/me", response_model=List[JobResponse])
def get_my_bookmarks(
    profile: MahasiswaProfile = Depends(get_current_mahasiswa_profile),
    db: Session = Depends(get_db)
):
    """FR-08: Mengambil seluruh lowongan tersimpan milik mahasiswa yang sedang login."""
    bookmarks = db.query(JobBookmark).filter(JobBookmark.mahasiswa_id == profile.id).all()
    job_ids = [b.job_vacancy_id for b in bookmarks]

    jobs = db.query(JobVacancy).filter(JobVacancy.id.in_(job_ids)).all()
    results = []
    for j in jobs:
        resp = JobResponse.model_validate(j)
        resp.is_bookmarked = True
        results.append(resp)
    return results
