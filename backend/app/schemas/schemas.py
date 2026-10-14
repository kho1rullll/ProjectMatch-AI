from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

# ==================== AUTH SCHEMAS ====================
class UserRegister(BaseModel):
    email: str = Field(description="Email pengguna")
    password: str = Field(min_length=6)
    full_name: str
    nim: str
    github_username: str
    program_studi: Optional[str] = "D3 Teknik Informatika PSDKU Madiun UNS"
    angkatan: Optional[int] = 2025

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

# ==================== PROFILE SCHEMAS ====================
class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    program_studi: Optional[str] = None
    angkatan: Optional[int] = None
    github_username: Optional[str] = None

class GitHubSyncRequest(BaseModel):
    github_username: Optional[str] = None

class ProfileResponse(BaseModel):
    id: str
    user_id: str
    full_name: str
    nim: str
    program_studi: Optional[str] = None
    angkatan: Optional[int] = None
    github_username: str
    github_data: Optional[Dict[str, Any]] = None
    extracted_skills: Optional[Dict[str, Any]] = None
    processing_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ==================== JOB SCHEMAS ====================
class JobResponse(BaseModel):
    id: str
    platform_source: str
    external_job_id: Optional[str] = None
    job_type: str
    title: str
    company_or_client: Optional[str] = None
    description: str
    external_url: str
    budget_or_salary: Optional[str] = None
    extracted_skills: Optional[Dict[str, Any]] = None
    status: str
    processing_status: str
    created_at: datetime
    is_bookmarked: Optional[bool] = False
    similarity_score: Optional[float] = None

    class Config:
        from_attributes = True

class BookmarkResponse(BaseModel):
    id: str
    job_id: str
    message: str
    created_at: datetime

# ==================== MATCHING & RECOMMENDATION SCHEMAS ====================
class SkillRadarScore(BaseModel):
    skill: str
    student_score: float
    required_score: float
    description: Optional[str] = None

class MatchDetailResponse(BaseModel):
    match_id: str
    job_id: str
    job_title: str
    company: Optional[str] = None
    platform_source: str
    external_url: str
    similarity_score: float  # 0.0 - 1.0
    match_percentage: int    # 0 - 100%
    score_breakdown: List[SkillRadarScore]
    summary_reason: Optional[str] = None

class RecommendationItem(BaseModel):
    job: JobResponse
    similarity_score: float
    match_percentage: int
    score_breakdown: Optional[List[Dict[str, Any]]] = None

# ==================== NOTIFICATION SCHEMAS ====================
class NotificationResponse(BaseModel):
    id: str
    type: str
    title: str
    message: str
    match_id: Optional[str] = None
    is_read: bool
    created_at: datetime
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ==================== ADMIN SCHEMAS ====================
class UserUpdateStatusRole(BaseModel):
    user_id: str
    is_active: Optional[bool] = None
    role: Optional[str] = None

class AdminUserItem(BaseModel):
    id: str
    email: str
    role: str
    is_active: bool
    created_at: datetime
    full_name: Optional[str] = None
    nim: Optional[str] = None
    github_username: Optional[str] = None

class AdminStatisticsResponse(BaseModel):
    total_users: int
    active_users: int
    total_mahasiswa: int
    total_admin: int
    total_jobs: int
    jobs_by_platform: Dict[str, int]
    jobs_by_type: Dict[str, int]
    total_matches_computed: int
    total_bookmarks: int
    average_similarity_score: float
