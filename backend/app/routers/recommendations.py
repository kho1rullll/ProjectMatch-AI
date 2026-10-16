from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_mahasiswa_profile
from app.models.models import MahasiswaProfile, JobVacancy, Match, JobBookmark
from app.schemas.schemas import RecommendationItem, MatchDetailResponse, JobResponse, SkillRadarScore
from app.services.matching_engine import matching_engine

router = APIRouter(tags=["AI Semantic Matching & Radar Chart (FR-06, FR-07)"])

@router.get("/recommendations/me", response_model=List[RecommendationItem])
def get_my_recommendations(
    profile: MahasiswaProfile = Depends(get_current_mahasiswa_profile),
    db: Session = Depends(get_db)
):
    """FR-06: Mendapatkan daftar lowongan freelance & part-time yang cocok dengan portofolio GitHub mahasiswa (terurut skor tertinggi)."""
    # Ambil matches yang sudah dihitung untuk mahasiswa ini terhadap lowongan berstatus 'open' (D08)
    matches = (
        db.query(Match, JobVacancy)
        .join(JobVacancy, Match.job_vacancy_id == JobVacancy.id)
        .filter(
            Match.mahasiswa_id == profile.id,
            JobVacancy.status == "open"
        )
        .order_by(Match.similarity_score.desc())
        .all()
    )

    # Ambil bookmark status
    bookmarks = db.query(JobBookmark.job_vacancy_id).filter(JobBookmark.mahasiswa_id == profile.id).all()
    bookmarked_ids = {b[0] for b in bookmarks}

    # Jika belum ada match yang dihitung (misal sebelum sinkronisasi pertama kali), hitung on-the-fly
    if not matches:
        if not profile.embedding or not profile.embedding.embedding_vector:
            from app.services.embedding_service import embedding_service
            from app.models.models import Embedding
            skills_txt = f"{profile.full_name} ({profile.github_username}). Keahlian: {str(profile.extracted_skills)}"
            vec = embedding_service.generate_embedding(skills_txt)
            if profile.embedding:
                profile.embedding.embedding_vector = vec
            else:
                new_emb = Embedding(mahasiswa_id=profile.id, embedding_vector=vec)
                db.add(new_emb)
            db.commit()
            db.refresh(profile)

        open_jobs = db.query(JobVacancy).filter(JobVacancy.status == "open").all()
        for j in open_jobs:
            if j.embedding and j.embedding.embedding_vector:
                sim = matching_engine.calculate_cosine_similarity(
                    profile.embedding.embedding_vector,
                    j.embedding.embedding_vector
                )
                breakdown = matching_engine.generate_score_breakdown(
                    profile.extracted_skills or {},
                    j.extracted_skills or {},
                    sim
                )
                new_match = Match(
                    mahasiswa_id=profile.id,
                    job_vacancy_id=j.id,
                    similarity_score=sim,
                    score_breakdown=breakdown
                )
                db.add(new_match)
        db.commit()

        # Query ulang
        matches = (
            db.query(Match, JobVacancy)
            .join(JobVacancy, Match.job_vacancy_id == JobVacancy.id)
            .filter(
                Match.mahasiswa_id == profile.id,
                JobVacancy.status == "open"
            )
            .order_by(Match.similarity_score.desc())
            .all()
        )

    recommendations = []
    for match, job in matches:
        job_resp = JobResponse.model_validate(job)
        job_resp.is_bookmarked = job.id in bookmarked_ids
        job_resp.similarity_score = match.similarity_score

        recommendations.append(
            RecommendationItem(
                job=job_resp,
                similarity_score=match.similarity_score,
                match_percentage=int(round(match.similarity_score * 100)),
                score_breakdown=match.score_breakdown
            )
        )

    return recommendations

@router.get("/matches/{job_id}/me", response_model=MatchDetailResponse)
def get_match_breakdown_detail(
    job_id: str,
    profile: MahasiswaProfile = Depends(get_current_mahasiswa_profile),
    db: Session = Depends(get_db)
):
    """FR-06, FR-07: Detail skor kecocokan dan breakdown per skill untuk visualisasi Radar Chart overlay & drill-down."""
    job = db.query(JobVacancy).filter(JobVacancy.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lowongan pekerjaan tidak ditemukan."
        )

    match = db.query(Match).filter(
        Match.mahasiswa_id == profile.id,
        Match.job_vacancy_id == job.id
    ).first()

    # Jika match belum ada, hitung sekarang
    if not match:
        student_vec = profile.embedding.embedding_vector if profile.embedding else []
        job_vec = job.embedding.embedding_vector if job.embedding else []
        sim_score = matching_engine.calculate_cosine_similarity(student_vec, job_vec) if student_vec and job_vec else 0.75
        breakdown = matching_engine.generate_score_breakdown(
            profile.extracted_skills or {},
            job.extracted_skills or {},
            sim_score
        )
        match = Match(
            mahasiswa_id=profile.id,
            job_vacancy_id=job.id,
            similarity_score=sim_score,
            score_breakdown=breakdown
        )
        db.add(match)
        db.commit()
        db.refresh(match)

    raw_breakdown = match.score_breakdown or []
    breakdown_list = [
        SkillRadarScore(
            skill=item.get("skill", "General"),
            student_score=float(item.get("student_score", 70)),
            required_score=float(item.get("required_score", 70)),
            description=item.get("description", "")
        )
        for item in raw_breakdown
    ]

    pct = int(round(match.similarity_score * 100))
    summary_reason = f"Kecocokan semantik sebesar {pct}% didorong oleh kesesuaian kuat antara repositori publik GitHub mahasiswa dengan spesifikasi teknis {job.title} di {job.platform_source.capitalize()}."

    return MatchDetailResponse(
        match_id=match.id,
        job_id=job.id,
        job_title=job.title,
        company=job.company_or_client,
        platform_source=job.platform_source,
        external_url=job.external_url,
        similarity_score=match.similarity_score,
        match_percentage=pct,
        score_breakdown=breakdown_list,
        summary_reason=summary_reason
    )
