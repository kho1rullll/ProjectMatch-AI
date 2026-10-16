from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user, get_current_mahasiswa_profile
from app.models.models import User, MahasiswaProfile, Embedding, JobVacancy, Match
from app.schemas.schemas import ProfileResponse, ProfileUpdate, GitHubSyncRequest
from app.services.github_client import github_client
from app.services.groq_service import groq_service
from app.services.embedding_service import embedding_service
from app.services.matching_engine import matching_engine
from app.services.notification_service import notification_service

router = APIRouter(prefix="/profiles", tags=["Manajemen Profil & GitHub (FR-02, FR-03)"])

async def run_github_portfolio_pipeline(profile_id: str, db: Session):
    """Pipeline latar belakang asinkron: GitHub REST API -> Groq Synthesizer -> Embedding -> Semantic Matches (FR-03, FR-06, FR-09)."""
    profile = db.query(MahasiswaProfile).filter(MahasiswaProfile.id == profile_id).first()
    if not profile:
        return

    try:
        profile.processing_status = "processing"
        db.commit()

        # 1. Ambil data GitHub
        github_data = await github_client.fetch_user_data(profile.github_username)
        profile.github_data = github_data

        # 2. Sintesis portofolio kompetensi dengan Groq Llama 3.1
        extracted_skills = await groq_service.synthesize_github_portfolio(github_data)
        profile.extracted_skills = extracted_skills

        # 3. Buat representasi vektor embedding 384 dimensi
        portfolio_summary = f"{extracted_skills.get('headline', '')} {' '.join(extracted_skills.get('primary_domains', []))} {extracted_skills.get('strengths_summary', '')}"
        vector = embedding_service.generate_embedding(portfolio_summary)

        # Simpan embedding
        if profile.embedding:
            profile.embedding.embedding_vector = vector
        else:
            emb = Embedding(
                mahasiswa_id=profile.id,
                embedding_vector=vector,
                model_name=embedding_service.model_name
            )
            db.add(emb)

        # 4. Hitung Semantic Cosine Matching dengan seluruh lowongan berstatus 'open' (FR-06)
        open_jobs = db.query(JobVacancy).filter(JobVacancy.status == "open").all()
        for job in open_jobs:
            if job.embedding and job.embedding.embedding_vector:
                sim_score = matching_engine.calculate_cosine_similarity(vector, job.embedding.embedding_vector)
                breakdown = matching_engine.generate_score_breakdown(
                    extracted_skills,
                    job.extracted_skills or {},
                    sim_score
                )

                # D05: Upsert match pair
                existing_match = db.query(Match).filter(
                    Match.mahasiswa_id == profile.id,
                    Match.job_vacancy_id == job.id
                ).first()

                if existing_match:
                    existing_match.similarity_score = sim_score
                    existing_match.score_breakdown = breakdown
                    match_obj = existing_match
                else:
                    match_obj = Match(
                        mahasiswa_id=profile.id,
                        job_vacancy_id=job.id,
                        similarity_score=sim_score,
                        score_breakdown=breakdown
                    )
                    db.add(match_obj)
                    db.flush()

                # FR-09: Kirim notifikasi real-time jika kecocokan tinggi (>= 80% / 0.80)
                if sim_score >= 0.80:
                    await notification_service.create_and_push_notification(
                        db=db,
                        user_id=profile.user_id,
                        title="🎯 Rekomendasi Lowongan Baru Cocok!",
                        message=f"Lowongan '{job.title}' di {job.company_or_client or 'Mitra'} memiliki kecocokan tinggi ({int(sim_score * 100)}%) dengan portofolio GitHub Anda.",
                        notif_type="match_result",
                        match_id=match_obj.id
                    )

        profile.processing_status = "done"
        db.commit()

        # Notifikasi sukses
        await notification_service.create_and_push_notification(
            db=db,
            user_id=profile.user_id,
            title="✅ Portofolio GitHub Berhasil Disinkronkan",
            message=f"Repositori dari akun @{profile.github_username} telah berhasil dianalisis AI dan dipetakan ke radar chart kompetensi.",
            notif_type="system"
        )

    except Exception as e:
        profile.processing_status = "failed"
        db.commit()
        await notification_service.create_and_push_notification(
            db=db,
            user_id=profile.user_id,
            title="⚠️ Sinkronisasi GitHub Gagal",
            message=f"Terjadi kendala saat memproses portofolio @{profile.github_username}. Anda dapat memicu sinkronisasi ulang.",
            notif_type="system"
        )

@router.get("/me", response_model=ProfileResponse)
def get_my_profile(profile: MahasiswaProfile = Depends(get_current_mahasiswa_profile)):
    """FR-02: Melihat profil sendiri, data portofolio GitHub, dan extracted_skills."""
    return profile

@router.put("/me", response_model=ProfileResponse)
def update_my_profile(
    req: ProfileUpdate,
    profile: MahasiswaProfile = Depends(get_current_mahasiswa_profile),
    db: Session = Depends(get_db)
):
    """FR-02: Memperbarui data profil sendiri (nama, program studi, username GitHub)."""
    if req.full_name is not None:
        profile.full_name = req.full_name
    if req.program_studi is not None:
        profile.program_studi = req.program_studi
    if req.angkatan is not None:
        profile.angkatan = req.angkatan
    if req.github_username is not None and req.github_username.strip() != profile.github_username:
        # Cek keunikan D11
        existing = db.query(MahasiswaProfile).filter(
            MahasiswaProfile.github_username == req.github_username.strip(),
            MahasiswaProfile.id != profile.id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username GitHub tersebut sudah digunakan oleh akun lain."
            )
        profile.github_username = req.github_username.strip()
        profile.processing_status = "pending"

    db.commit()
    db.refresh(profile)
    return profile

@router.post("/github/sync")
async def sync_github_profile(
    background_tasks: BackgroundTasks,
    req: GitHubSyncRequest = None,
    profile: MahasiswaProfile = Depends(get_current_mahasiswa_profile),
    db: Session = Depends(get_db)
):
    """FR-02, FR-03: Memvalidasi akun GitHub dan memicu sintesis portofolio + embedding di latar belakang."""
    if req and req.github_username:
        profile.github_username = req.github_username.strip()

    profile.processing_status = "pending"
    db.commit()

    # Jalankan pipeline pemrosesan asinkron
    background_tasks.add_task(run_github_portfolio_pipeline, profile.id, db)

    return {
        "status": "success",
        "message": f"Sinkronisasi akun GitHub @{profile.github_username} berhasil dijadwalkan.",
        "processing_status": "pending"
    }
