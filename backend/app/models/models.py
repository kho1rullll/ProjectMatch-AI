import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Boolean, SmallInteger, Float, Text,
    DateTime, ForeignKey, UniqueConstraint, CheckConstraint, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

# 1. Tabel Users (FR-01, FR-11)
class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="mahasiswa")  # 'mahasiswa' | 'admin'
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)

    # Relasi
    mahasiswa_profile = relationship("MahasiswaProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

# 2. Tabel Mahasiswa_Profiles (FR-02, FR-03)
class MahasiswaProfile(Base):
    __tablename__ = "mahasiswa_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = Column(String(150), nullable=False)
    nim = Column(String(20), unique=True, nullable=False, index=True)
    program_studi = Column(String(100), nullable=True)
    angkatan = Column(SmallInteger, nullable=True)
    github_username = Column(String(100), unique=True, nullable=False, index=True)
    github_data = Column(JSON, nullable=True)  # repos, total commits, languages breakdown, README
    extracted_skills = Column(JSON, nullable=True)  # JSON kompetensi LLM Llama 3.1
    processing_status = Column(String(20), nullable=False, default="pending")  # 'pending', 'processing', 'done', 'failed'
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now)

    # Relasi
    user = relationship("User", back_populates="mahasiswa_profile")
    embedding = relationship("Embedding", back_populates="mahasiswa", uselist=False, cascade="all, delete-orphan")
    matches = relationship("Match", back_populates="mahasiswa", cascade="all, delete-orphan")
    bookmarks = relationship("JobBookmark", back_populates="mahasiswa", cascade="all, delete-orphan")

# 3. Tabel Job_Vacancies (FR-04, FR-05, FR-10)
class JobVacancy(Base):
    __tablename__ = "job_vacancies"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    platform_source = Column(String(20), nullable=False, index=True)  # 'linkedin', 'fiverr', 'upwork', 'manual'
    external_job_id = Column(String(150), nullable=True)
    job_type = Column(String(20), nullable=False)  # 'freelance', 'part_time'
    title = Column(String(200), nullable=False)
    company_or_client = Column(String(150), nullable=True)
    description = Column(Text, nullable=False)
    external_url = Column(Text, nullable=False)
    budget_or_salary = Column(String(100), nullable=True)
    extracted_skills = Column(JSON, nullable=True)  # JSON kriteria teknis hasil LLM Llama 3.1
    status = Column(String(20), nullable=False, default="open", index=True)  # 'open', 'expired', 'closed'
    processing_status = Column(String(20), nullable=False, default="pending")  # 'pending', 'processing', 'done', 'failed'
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now)

    __table_args__ = (
        UniqueConstraint("platform_source", "external_job_id", name="uq_platform_external_job"),
    )

    # Relasi
    embedding = relationship("Embedding", back_populates="job_vacancy", uselist=False, cascade="all, delete-orphan")
    matches = relationship("Match", back_populates="job_vacancy", cascade="all, delete-orphan")
    bookmarks = relationship("JobBookmark", back_populates="job_vacancy", cascade="all, delete-orphan")

# 4. Tabel Embeddings (FR-03, FR-05, FR-06)
class Embedding(Base):
    __tablename__ = "embeddings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    mahasiswa_id = Column(String(36), ForeignKey("mahasiswa_profiles.id", ondelete="CASCADE"), unique=True, nullable=True)
    job_vacancy_id = Column(String(36), ForeignKey("job_vacancies.id", ondelete="CASCADE"), unique=True, nullable=True)
    embedding_vector = Column(JSON, nullable=False)  # List 384 float untuk Sentence Transformers
    model_name = Column(String(100), nullable=False, default="paraphrase-multilingual-MiniLM-L12-v2")
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now)

    __table_args__ = (
        CheckConstraint(
            "(mahasiswa_id IS NOT NULL AND job_vacancy_id IS NULL) OR (mahasiswa_id IS NULL AND job_vacancy_id IS NOT NULL)",
            name="chk_embedding_owner"
        ),
    )

    # Relasi
    mahasiswa = relationship("MahasiswaProfile", back_populates="embedding")
    job_vacancy = relationship("JobVacancy", back_populates="embedding")

# 5. Tabel Matches (FR-06, FR-07)
class Match(Base):
    __tablename__ = "matches"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    mahasiswa_id = Column(String(36), ForeignKey("mahasiswa_profiles.id", ondelete="CASCADE"), nullable=False)
    job_vacancy_id = Column(String(36), ForeignKey("job_vacancies.id", ondelete="CASCADE"), nullable=False)
    similarity_score = Column(Float, nullable=False)  # 0.0 s/d 1.0
    score_breakdown = Column(JSON, nullable=True)  # breakdown skor per skill untuk radar chart & drill-down
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now)

    __table_args__ = (
        UniqueConstraint("mahasiswa_id", "job_vacancy_id", name="uq_match_pair"),
        CheckConstraint("similarity_score >= 0.0 AND similarity_score <= 1.0", name="chk_similarity_score_range")
    )

    # Relasi
    mahasiswa = relationship("MahasiswaProfile", back_populates="matches")
    job_vacancy = relationship("JobVacancy", back_populates="matches")
    notifications = relationship("Notification", back_populates="match")

# 6. Tabel Job_Bookmarks (FR-08)
class JobBookmark(Base):
    __tablename__ = "job_bookmarks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    mahasiswa_id = Column(String(36), ForeignKey("mahasiswa_profiles.id", ondelete="CASCADE"), nullable=False)
    job_vacancy_id = Column(String(36), ForeignKey("job_vacancies.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)

    __table_args__ = (
        UniqueConstraint("mahasiswa_id", "job_vacancy_id", name="uq_bookmark_pair"),
    )

    # Relasi
    mahasiswa = relationship("MahasiswaProfile", back_populates="bookmarks")
    job_vacancy = relationship("JobVacancy", back_populates="bookmarks")

# 7. Tabel Notifications (FR-09)
class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String(20), nullable=False)  # 'match_result', 'system'
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    match_id = Column(String(36), ForeignKey("matches.id", ondelete="SET NULL"), nullable=True)
    is_read = Column(Boolean, nullable=False, default=False, index=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)
    read_at = Column(DateTime(timezone=True), nullable=True)

    # Relasi
    user = relationship("User", back_populates="notifications")
    match = relationship("Match", back_populates="notifications")
