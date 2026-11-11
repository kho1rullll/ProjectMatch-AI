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
    """Inisialisasi 1 akun khusus administrator pengelola ProjectMatch AI dan lowongan riil eksternal."""
    db = SessionLocal()
    try:
        # 1. Akun Khusus Administrator Pengelola ProjectMatch AI (tanpa akun dummy mahasiswa)
        admin_email = (settings.ADMIN_EMAIL or "").strip().lower()
        admin_password = settings.ADMIN_PASSWORD or ""
        if admin_email and admin_password:
            admin_user = db.query(User).filter(User.email == admin_email).first()
            if not admin_user:
                logger.info(f"Seeding dedicated Admin: {admin_email}...")
                admin_user = User(
                    email=admin_email,
                    password_hash=get_password_hash(admin_password),
                    role="admin",
                    is_active=True
                )
                db.add(admin_user)
                db.commit()

        # 2. Seed lowongan eksternal riil jika tabel masih kosong
        if db.query(JobVacancy).count() == 0:
            logger.info("Seeding external real job vacancies (LinkedIn, Freelancer.com, Kalibrr, Remotive)...")
            await job_ingestion_service.ingest_jobs(db)

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

# Konfigurasi CORS (Mendukung localhost port berapapun & domain deploy seperti Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if settings.CORS_ORIGINS else ["*"],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$|^https://.*\.vercel\.app$",
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

import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse

# Pasang Frontend Static Portal untuk Demonstrasi
static_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static")
if os.path.exists(static_dir):
    app.mount("/portal", StaticFiles(directory=static_dir, html=True), name="portal")

@app.get("/demo")
def demo_redirect():
    return RedirectResponse(url="/portal")

@app.get("/")
def root():
    return {
        "system": "ProjectMatch AI Backend",
        "architecture": "Three-Tier Architecture (Next.js + FastAPI + PostgreSQL/pgvector)",
        "api_docs": f"{settings.API_V1_STR}/docs",
        "portal_ui": "/portal",
        "websocket": "/ws/notifications",
        "status": "operational"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
