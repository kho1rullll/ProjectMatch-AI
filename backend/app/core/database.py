import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# Engine setup dengan dukungan SQLite & PostgreSQL
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    # Pastikan jalur SQLite selalu konsisten ke file projectmatch_ai.db
    if "projectmatch_ai.db" in db_url:
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        root_dir = os.path.dirname(backend_dir)
        target_db = os.path.join(root_dir, "projectmatch_ai.db")
        if not os.path.exists(target_db):
            target_db = os.path.join(backend_dir, "projectmatch_ai.db")
        db_url = f"sqlite:///{target_db.replace(os.sep, '/')}"

engine = create_engine(
    db_url,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
