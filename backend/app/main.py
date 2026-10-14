import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.core.security import get_password_hash
from app.models.models import User, MahasiswaProfile, JobVacancy, Embedding, Match
from app.routers import auth, profile, jobs, recommendations, notifications, admin, websocket
from app.services.job_ingestion import job_ingestion_service
from app.services.matching_engine import matching_engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("projectmatch_ai")

async def seed_initial_data():
    """Inisialisasi akun bawaan sesuai Panduan Sistem/account.text dan lowongan eksternal."""
    db = SessionLocal()
    try:
        # 1. Akun Mahasiswa Bawaan (Raden Satria)
        satria_user = db.query(User).filter(User.email == "satria@student.itb.ac.id").first()
        if not satria_user:
            logger.info("Seeding Mahasiswa: satria@student.itb.ac.id...")
            satria_user = User(
                email="satria@student.itb.ac.id",
                password_hash=get_password_hash("password123"),
                role="mahasiswa",
                is_active=True
            )
            db.add(satria_user)
            db.flush()

            satria_profile = MahasiswaProfile(
                user_id=satria_user.id,
                full_name="Raden Satria",
                nim="V3925028",
                program_studi="D3 Teknik Informatika PSDKU Madiun UNS",
                angkatan=2025,
                github_username="kho1rullll",
                processing_status="done",
                github_data={
                    "username": "kho1rullll",
                    "total_repositories": 5,
                    "total_commits": 184,
                    "languages_breakdown": {
                        "TypeScript": 45.0,
                        "Python": 35.0,
                        "HTML/CSS": 12.0,
                        "SQL": 8.0
                    },
                    "top_repositories": [
                        {
                            "name": "ProjectMatch-AI",
                            "description": "Link-and-Match Pendidikan dengan Kebutuhan Industri melalui AI Semantic Matching",
                            "language": "TypeScript",
                            "stars": 15
                        },
                        {
                            "name": "fastapi-pgvector-microservices",
                            "description": "High performance vector retrieval and async worker pipeline",
                            "language": "Python",
                            "stars": 9
                        }
                    ]
                },
                extracted_skills={
                    "headline": "Fullstack AI Engineer specializing in Next.js, FastAPI & Semantic Search",
                    "primary_domains": ["AI & Machine Learning", "Fullstack Web", "Backend Systems"],
                    "technical_skills": [
                        {"name": "Python & FastAPI", "category": "Backend", "level": 92},
                        {"name": "Next.js & TypeScript", "category": "Frontend", "level": 88},
                        {"name": "PyTorch & Transformers", "category": "AI/ML", "level": 85},
                        {"name": "PostgreSQL & pgvector", "category": "Database", "level": 89},
                        {"name": "System Architecture", "category": "Architecture", "level": 84}
                    ],
                    "radar_competencies": {
                        "AI_ML": 88,
                        "Frontend": 86,
                        "Backend": 92,
                        "Database_Cloud": 87,
                        "Software_Architecture": 85
                    },
                    "strengths_summary": "Memiliki keunggulan dalam arsitektur three-tier, integrasi API eksternal, dan evaluasi cosine similarity berbasis pgvector."
                }
            )
            db.add(satria_profile)
            db.commit()

        # Seed embedding & matches untuk Raden Satria jika belum ada
        satria_profile = db.query(MahasiswaProfile).filter(MahasiswaProfile.user_id == satria_user.id).first()
        if satria_profile and not satria_profile.embedding:
            from app.services.embedding_service import embedding_service
            from app.models.models import Embedding
            skills_txt = f"{satria_profile.full_name} ({satria_profile.github_username}). Keahlian: {str(satria_profile.extracted_skills)}"
            vec = embedding_service.generate_embedding(skills_txt)
            db.add(Embedding(mahasiswa_id=satria_profile.id, embedding_vector=vec))
            db.commit()

        # 2. Akun Administrator Bawaan
        admin_user = db.query(User).filter(User.email == "admin@projectmatch.ac.id").first()
        if not admin_user:
            logger.info("Seeding Admin: admin@projectmatch.ac.id...")
            admin_user = User(
                email="admin@projectmatch.ac.id",
                password_hash=get_password_hash("password123"),
                role="admin",
                is_active=True
            )
            db.add(admin_user)
            db.commit()

        # 3. Seed lowongan eksternal jika tabel masih kosong
        if db.query(JobVacancy).count() == 0:
            logger.info("Seeding external job vacancies (LinkedIn, Upwork, Fiverr)...")
            await job_ingestion_service.ingest_jobs(db)

        # 4. Hitung matches awal jika belum ada
        if satria_profile and satria_profile.embedding and db.query(Match).filter(Match.mahasiswa_id == satria_profile.id).count() == 0:
            open_jobs = db.query(JobVacancy).filter(JobVacancy.status == "open").all()
            for job in open_jobs:
                if job.embedding and job.embedding.embedding_vector:
                    sim = matching_engine.calculate_cosine_similarity(
                        satria_profile.embedding.embedding_vector,
                        job.embedding.embedding_vector
                    )
                    breakdown = matching_engine.generate_score_breakdown(
                        satria_profile.extracted_skills or {},
                        job.extracted_skills or {},
                        sim
                    )
                    db.add(Match(
                        mahasiswa_id=satria_profile.id,
                        job_vacancy_id=job.id,
                        similarity_score=sim,
                        score_breakdown=breakdown
                    ))
            db.commit()

    except Exception as e:
        logger.error(f"Error during initial seeding: {e}")
        db.rollback()
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Inisialisasi tabel basis data & data awal
    Base.metadata.create_all(bind=engine)
    await seed_initial_data()
    yield
    # Shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend REST API & WebSocket ProjectMatch AI sesuai SKPL & Laporan Arsitektur Backend",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan
)

# Konfigurasi CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Mengizinkan koneksi dari klien Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pasang Router REST API dengan awalan /api/v1 (Sesuai Bab 9 Laporan Arsitektur Backend)
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(profile.router, prefix=settings.API_V1_STR)
app.include_router(jobs.router, prefix=settings.API_V1_STR)
app.include_router(recommendations.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

# Pasang Endpoint WebSocket
app.include_router(websocket.router)

@app.get("/")
def root():
    return {
        "system": "ProjectMatch AI Backend",
        "architecture": "Three-Tier Architecture (Next.js + FastAPI + PostgreSQL/pgvector)",
        "api_docs": f"{settings.API_V1_STR}/docs",
        "websocket": "/ws/notifications",
        "status": "operational"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
