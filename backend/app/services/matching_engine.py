import numpy as np
from typing import List, Dict, Any, Tuple

class MatchingEngine:
    """Mesin AI Semantic Matching & Cosine Similarity Calculator (FR-06 & FR-07)."""

    @staticmethod
    def calculate_cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
        """Menghitung Cosine Similarity antara dua vektor 384-dimensi, di-clamp ke rentang [0.0, 1.0]."""
        if not vec1 or not vec2:
            return 0.0

        v1 = np.array(vec1, dtype=np.float32)
        v2 = np.array(vec2, dtype=np.float32)

        norm1 = np.linalg.norm(v1)
        norm2 = np.linalg.norm(v2)

        if norm1 == 0.0 or norm2 == 0.0:
            return 0.0

        dot = np.dot(v1, v2)
        raw_sim = float(dot / (norm1 * norm2))
        
        # Sesuai aturan D06: Pembatasan ketat (clamp) 0.0 s/d 1.0
        clamped_sim = max(0.0, min(1.0, (raw_sim + 1.0) / 2.0 if raw_sim < 0 else raw_sim))
        return round(clamped_sim, 4)

    @staticmethod
    def generate_score_breakdown(
        student_skills: Dict[str, Any],
        job_skills: Dict[str, Any],
        base_similarity: float
    ) -> List[Dict[str, Any]]:
        """Membuat rincian skor per skill (score_breakdown) untuk Radar Chart overlay dan drill-down."""
        student_radar = (student_skills or {}).get("radar_competencies", {})
        job_radar = (job_skills or {}).get("radar_requirements", {})

        categories = [
            ("AI & Machine Learning", "AI_ML", "Penguasaan dasar NLP, machine learning, dan model data riil"),
            ("Frontend Engineering", "Frontend", "Implementasi UI responsif, state management, dan komponen modern"),
            ("Backend Services", "Backend", "Desain REST API, arsitektur microservices/monolitik, dan otentikasi"),
            ("Database & Cloud", "Database_Cloud", "Manajemen data relasional, pencarian vektor pgvector, dan deployment"),
            ("Software Architecture", "Software_Architecture", "Pola desain modular, skalabilitas, dan integrasi clean code")
        ]

        breakdown = []
        for label, key, desc in categories:
            s_val = float(student_radar.get(key, 80))
            j_val = float(job_radar.get(key, 75))
            
            # Kalibrasi proporsional berdasarkan cosine similarity
            calibrated_student = min(100.0, max(40.0, s_val * (0.8 + 0.3 * base_similarity)))
            
            breakdown.append({
                "skill": label,
                "student_score": round(calibrated_student, 1),
                "required_score": round(j_val, 1),
                "description": desc
            })

        return breakdown

matching_engine = MatchingEngine()
