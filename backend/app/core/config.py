import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ProjectMatch AI Backend"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "projectmatch-super-secret-jwt-key-2026-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 jam

    DATABASE_URL: str = "sqlite:///./projectmatch_ai.db"
    
    # Groq Cloud API
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = "llama-3.1-8b-instant"

    # GitHub REST API
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001"
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"

settings = Settings()
