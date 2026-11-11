from datetime import datetime, timezone
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.models import JobVacancy, Embedding
from app.services.groq_service import groq_service
from app.services.embedding_service import embedding_service

class JobIngestionService:
    """Layanan agregasi lowongan pekerjaan multi-platform (LinkedIn, Fiverr, Upwork) (FR-04, FR-10)."""

    @staticmethod
    def get_seed_external_jobs() -> List[Dict[str, Any]]:
        """Daftar lowongan pekerjaan realistis dari LinkedIn, Fiverr, dan Upwork untuk mahasiswa TI."""
        return [
            {
                "platform_source": "linkedin",
                "external_job_id": "li-job-2026-001",
                "job_type": "part_time",
                "title": "Junior AI & Python Backend Engineer (Part-Time)",
                "company_or_client": "BioInformatika Nusantara & RS Cipto",
                "description": "Membangun endpoint REST API berbasis FastAPI dan pipeline embedding Sentence Transformers untuk klasifikasi data riil medis. Membutuhkan penguasaan Python, PostgreSQL, dan integrasi LLM.",
                "external_url": "https://www.linkedin.com/jobs/view/bioinformatika-ai-backend-2026",
                "budget_or_salary": "Rp 6.000.000 / bulan",
                "status": "open"
            },
            {
                "platform_source": "upwork",
                "external_job_id": "up-job-2026-102",
                "job_type": "freelance",
                "title": "FastAPI & pgvector Semantic Search Integration",
                "company_or_client": "CloudScale Global Solutions Inc.",
                "description": "Looking for a talented developer to integrate pgvector HNSW indexing and cosine distance semantic retrieval in an existing FastAPI codebase. High quality GitHub repos preferred.",
                "external_url": "https://www.upwork.com/jobs/fastapi-pgvector-semantic-search_102",
                "budget_or_salary": "$800 - $1,500 (Fixed Price)",
                "status": "open"
            },
            {
                "platform_source": "fiverr",
                "external_job_id": "fiv-job-2026-554",
                "job_type": "freelance",
                "title": "Fullstack Next.js 15 & Recharts Interactive Radar Dashboard",
                "company_or_client": "EduTech Creative Studio",
                "description": "Need a responsive Next.js frontend with modern Recharts radar visualization and WebSocket live notification alerts. Clean TypeScript code and Tailwind styling required.",
                "external_url": "https://www.fiverr.com/buyer-requests/nextjs-recharts-radar-dashboard-554",
                "budget_or_salary": "$450 / Project",
                "status": "open"
            },
            {
                "platform_source": "linkedin",
                "external_job_id": "li-job-2026-004",
                "job_type": "part_time",
                "title": "Frontend Developer Intern (React / Next.js)",
                "company_or_client": "PT Inovasi Digital Mahasiswa",
                "description": "Membantu pengembangan antarmuka dashboard pengguna, optimasi performa web, dan integrasi API RESTful dengan Next.js App Router.",
                "external_url": "https://www.linkedin.com/jobs/view/frontend-developer-intern-idm-2026",
                "budget_or_salary": "Rp 4.500.000 / bulan",
                "status": "open"
            },
            {
                "platform_source": "upwork",
                "external_job_id": "up-job-2026-105",
                "job_type": "freelance",
                "title": "LLM Criteria Extraction Pipeline with Groq Llama 3.1",
                "company_or_client": "DeepMatch AI Tech Labs",
                "description": "Build automated JSON criteria normalization for unorganized text documents using Groq Cloud API Llama 3.1 8b instant model with retry handling.",
                "external_url": "https://www.upwork.com/jobs/llm-criteria-extraction-groq-llama_105",
                "budget_or_salary": "$600 - $1,200",
                "status": "open"
            },
            {
                "platform_source": "fiverr",
                "external_job_id": "fiv-job-2026-556",
                "job_type": "freelance",
                "title": "REST API Security Audit & Argon2id Auth Implementation",
                "company_or_client": "SecureStack Cyber Consulting",
                "description": "Refactor legacy authentication systems to use Argon2id password hashing and robust role-based JWT guards in Python.",
                "external_url": "https://www.fiverr.com/buyer-requests/argon2id-auth-audit-556",
                "budget_or_salary": "$350 / Milestone",
                "status": "open"
            }
        ]

    async def ingest_jobs(self, db: Session) -> Dict[str, int]:
        """Tarik lowongan dari platform, lakukan deduplikasi (D14), ekstrak kriteria, dan buat embedding."""
        raw_jobs = self.get_seed_external_jobs()
        added_count = 0
        updated_count = 0

        for item in raw_jobs:
            platform = item["platform_source"]
            ext_id = item["external_job_id"]

            existing_job = db.query(JobVacancy).filter(
                JobVacancy.platform_source == platform,
                JobVacancy.external_job_id == ext_id
            ).first()

            # Ekstraksi kriteria LLM Llama 3.1
            extracted_skills = await groq_service.extract_job_criteria(
                job_title=item["title"],
                description=item["description"],
                platform=platform
            )

            # Buat vektor embedding 384 dimensi
            job_text = f"{item['title']} {item['description']} {extracted_skills.get('work_scope', '')}"
            vector = embedding_service.generate_embedding(job_text)

            if existing_job:
                # Perbarui jika sudah ada (D14)
                existing_job.title = item["title"]
                existing_job.company_or_client = item["company_or_client"]
                existing_job.description = item["description"]
                existing_job.external_url = item["external_url"]
                existing_job.budget_or_salary = item["budget_or_salary"]
                existing_job.extracted_skills = extracted_skills
                existing_job.status = item["status"]
                existing_job.processing_status = "done"
                
                # Perbarui embedding
                if existing_job.embedding:
                    existing_job.embedding.embedding_vector = vector
                else:
                    new_emb = Embedding(
                        job_vacancy_id=existing_job.id,
                        embedding_vector=vector,
                        model_name=embedding_service.model_name
                    )
                    db.add(new_emb)
                
                updated_count += 1
            else:
                # Buat entri baru
                new_job = JobVacancy(
                    platform_source=platform,
                    external_job_id=ext_id,
                    job_type=item["job_type"],
                    title=item["title"],
                    company_or_client=item["company_or_client"],
                    description=item["description"],
                    external_url=item["external_url"],
                    budget_or_salary=item["budget_or_salary"],
                    extracted_skills=extracted_skills,
                    status=item["status"],
                    processing_status="done"
                )
                db.add(new_job)
                db.flush()

                new_emb = Embedding(
                    job_vacancy_id=new_job.id,
                    embedding_vector=vector,
                    model_name=embedding_service.model_name
                )
                db.add(new_emb)
                added_count += 1

        db.commit()
        return {"added": added_count, "updated": updated_count}

job_ingestion_service = JobIngestionService()
