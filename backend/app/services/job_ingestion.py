import re
import json
import html as html_lib
import urllib.request
import urllib.parse
from datetime import datetime, timezone
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.models import JobVacancy, Embedding, MahasiswaProfile, Match, JobBookmark
from app.services.groq_service import groq_service
from app.services.embedding_service import embedding_service
from app.services.matching_engine import matching_engine

try:
    from bs4 import BeautifulSoup
    HAS_BS4 = True
except ImportError:
    HAS_BS4 = False

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"


def _strip_html(raw_html: str) -> str:
    """Bersihkan tag HTML dan entitas agar deskripsi terbaca rapi."""
    if not raw_html:
        return ""
    if HAS_BS4:
        text = BeautifulSoup(raw_html, "html.parser").get_text(" ", strip=True)
    else:
        text = re.sub(r"<[^>]+>", " ", raw_html)
    text = html_lib.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


class JobIngestionService:
    """Layanan agregasi lowongan pekerjaan 100% RIIL dari API publik (LinkedIn, Freelancer.com, Kalibrr, Remotive)."""

    def _fetch_linkedin_job_description(self, job_url: str) -> str:
        """Ambil ringkasan deskripsi asli langsung dari halaman detail lowongan LinkedIn."""
        try:
            req = urllib.request.Request(job_url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=6) as r:
                raw = r.read().decode("utf-8", errors="ignore")
                if HAS_BS4:
                    soup = BeautifulSoup(raw, "html.parser")
                    desc_el = soup.find("div", class_=re.compile("show-more-less-html__markup"))
                    if desc_el:
                        text = desc_el.get_text(" ", strip=True)
                        return text[:600] + "..." if len(text) > 600 else text
        except Exception:
            pass
        return ""

    def fetch_live_linkedin_jobs(self, keywords: List[str] = None, max_per_keyword: int = 2) -> List[Dict[str, Any]]:
        """Ambil lowongan kerja riil & aktif dari LinkedIn Guest Search API dengan tautan langsung ke posting."""
        if keywords is None:
            keywords = ["python developer", "frontend react developer", "machine learning engineer"]

        live_jobs: List[Dict[str, Any]] = []
        seen_ids = set()

        for kw in keywords:
            url = f"https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords={urllib.parse.quote(kw)}&location=Indonesia"
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            try:
                with urllib.request.urlopen(req, timeout=8) as response:
                    raw_html = response.read().decode("utf-8", errors="ignore")
                    if not HAS_BS4:
                        continue
                    soup = BeautifulSoup(raw_html, "html.parser")
                    cards = soup.find_all("div", class_=re.compile("base-search-card"))
                    count_for_kw = 0
                    for card in cards:
                        title_el = card.find("h3", class_=re.compile("base-search-card__title"))
                        comp_el = card.find("h4", class_=re.compile("base-search-card__subtitle"))
                        link_el = card.find("a", class_=re.compile("base-card__full-link"))
                        loc_el = card.find("span", class_=re.compile("job-search-card__location"))

                        if not (title_el and link_el and "href" in link_el.attrs):
                            continue

                        clean_link = link_el["href"].split("?")[0].strip()
                        if "/jobs/view/" not in clean_link:
                            continue

                        id_m = re.search(r"-(\d+)$", clean_link)
                        ext_id = f"li-{id_m.group(1)}" if id_m else f"li-{abs(hash(clean_link))}"
                        if ext_id in seen_ids:
                            continue
                        seen_ids.add(ext_id)

                        clean_title = title_el.get_text(strip=True)
                        clean_comp = comp_el.get_text(strip=True) if comp_el else "Perusahaan di LinkedIn"
                        loc = loc_el.get_text(strip=True) if loc_el else "Indonesia"

                        desc = self._fetch_linkedin_job_description(clean_link)
                        if not desc:
                            desc = f"Lowongan aktif di LinkedIn untuk posisi {clean_title} di {clean_comp} ({loc}). Klik Lamar untuk melihat kualifikasi lengkap dan melamar langsung."

                        title_lower = clean_title.lower()
                        j_type = "freelance" if ("freelance" in title_lower or "contract" in title_lower or "project" in title_lower) else "part_time"

                        live_jobs.append({
                            "platform_source": "linkedin",
                            "external_job_id": ext_id,
                            "job_type": j_type,
                            "title": clean_title,
                            "company_or_client": f"{clean_comp} ({loc})",
                            "description": desc,
                            "external_url": clean_link,
                            "budget_or_salary": "Lihat Gaji / Penawaran di LinkedIn",
                            "status": "open"
                        })
                        count_for_kw += 1
                        if count_for_kw >= max_per_keyword:
                            break
            except Exception:
                continue

        return live_jobs

    def fetch_live_freelancer_jobs(self, limit_per_skill: int = 3) -> List[Dict[str, Any]]:
        """Ambil proyek freelance riil & aktif dari Official Public API Freelancer.com."""
        # Skill IDs resmi Freelancer.com: 13=Python, 759=React.js
        skill_groups = [13, 759]
        live_jobs: List[Dict[str, Any]] = []
        seen_ids = set()

        for skill_id in skill_groups:
            url = (
                f"https://www.freelancer.com/api/projects/0.1/projects/active/"
                f"?jobs[]={skill_id}&languages[]=en&limit={limit_per_skill}&full_description=true&job_details=true"
            )
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            try:
                with urllib.request.urlopen(req, timeout=10) as response:
                    data = json.loads(response.read().decode("utf-8", errors="ignore"))
                    projects = data.get("result", {}).get("projects", [])
                    for p in projects:
                        pid = str(p.get("id", ""))
                        seo_url = (p.get("seo_url") or "").strip()
                        title = (p.get("title") or "").strip()
                        if not pid or not seo_url or not title or pid in seen_ids:
                            continue
                        seen_ids.add(pid)

                        direct_url = f"https://www.freelancer.com/projects/{seo_url.lstrip('/')}"
                        raw_desc = p.get("description") or p.get("preview_description") or ""
                        clean_desc = _strip_html(raw_desc)
                        if len(clean_desc) > 550:
                            clean_desc = clean_desc[:550] + "..."
                        if not clean_desc:
                            clean_desc = f"Proyek freelance aktif di Freelancer.com: {title}."

                        skills_list = [j.get("name") for j in p.get("jobs", []) if j.get("name")]
                        if skills_list:
                            clean_desc = f"{clean_desc} [Keahlian: {', '.join(skills_list[:5])}]"

                        currency = p.get("currency", {}).get("code", "USD")
                        sign = p.get("currency", {}).get("sign", "$")
                        b_min = p.get("budget", {}).get("minimum")
                        b_max = p.get("budget", {}).get("maximum")
                        p_type = p.get("type", "fixed")
                        suffix = " / jam" if p_type == "hourly" else " (Fixed Price)"

                        if b_min and b_max:
                            budget_str = f"{sign}{int(b_min):,} - {sign}{int(b_max):,} {currency}{suffix}"
                        elif b_min:
                            budget_str = f"Mulai {sign}{int(b_min):,} {currency}{suffix}"
                        else:
                            budget_str = f"Penawaran Terbuka ({currency}){suffix}"

                        owner_id = p.get("owner_id")
                        client_label = f"Klien Freelancer.com (#{owner_id})" if owner_id else "Klien Terverifikasi Freelancer.com"

                        live_jobs.append({
                            "platform_source": "freelancer",
                            "external_job_id": f"fl-{pid}",
                            "job_type": "freelance",
                            "title": title,
                            "company_or_client": client_label,
                            "description": clean_desc,
                            "external_url": direct_url,
                            "budget_or_salary": budget_str,
                            "status": "open"
                        })
            except Exception:
                continue

        return live_jobs

    def fetch_live_kalibrr_jobs(self, keywords: List[str] = None, max_per_keyword: int = 2) -> List[Dict[str, Any]]:
        """Ambil lowongan IT riil & aktif dari Official API Kalibrr Indonesia dengan tautan langsung ke lowongan."""
        if keywords is None:
            keywords = ["python", "frontend", "backend"]

        live_jobs: List[Dict[str, Any]] = []
        seen_ids = set()

        for kw in keywords:
            url = f"https://www.kalibrr.com/api/job_board/search?limit=5&text={urllib.parse.quote(kw)}"
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            try:
                with urllib.request.urlopen(req, timeout=8) as response:
                    data = json.loads(response.read().decode("utf-8", errors="ignore"))
                    jobs = data.get("jobs", [])
                    count_kw = 0
                    for j in jobs:
                        jid = str(j.get("id", ""))
                        slug = j.get("slug", "")
                        comp_code = j.get("company", {}).get("code", "")
                        title = (j.get("name") or "").strip()
                        comp_name = (j.get("company_name") or "").strip()

                        if not (jid and slug and comp_code and title) or jid in seen_ids:
                            continue

                        # Filter agar tetap relevan dengan lowongan teknologi/IT
                        combined_check = f"{title} {j.get('function', '')}".lower()
                        if not any(t in combined_check for t in ["dev", "engineer", "software", "python", "react", "frontend", "backend", "full", "stack", "data", "ai", "it", "web", "qa", "devops", "system", "programmer", "mobile", "cloud"]):
                            continue

                        seen_ids.add(jid)
                        direct_url = f"https://www.kalibrr.com/c/{comp_code}/jobs/{jid}/{slug}"

                        clean_desc = _strip_html(j.get("description") or "")
                        if len(clean_desc) > 550:
                            clean_desc = clean_desc[:550] + "..."
                        if not clean_desc:
                            clean_desc = f"Lowongan aktif di Kalibrr untuk posisi {title} di {comp_name}."

                        b_min = j.get("base_salary")
                        b_max = j.get("maximum_salary")
                        curr = j.get("salary_currency") or "IDR"
                        if b_min and b_max:
                            salary_str = f"{curr} {int(b_min):,} - {int(b_max):,} / bulan"
                        elif b_max:
                            salary_str = f"Hingga {curr} {int(b_max):,} / bulan"
                        elif b_min:
                            salary_str = f"Mulai {curr} {int(b_min):,} / bulan"
                        else:
                            salary_str = "Kompetitif (Lihat Detail Kalibrr)"

                        tenure = (j.get("tenure") or "").lower()
                        j_type = "freelance" if ("contract" in tenure or "project" in title.lower() or "freelance" in tenure) else "part_time"

                        live_jobs.append({
                            "platform_source": "kalibrr",
                            "external_job_id": f"kb-{jid}",
                            "job_type": j_type,
                            "title": title,
                            "company_or_client": comp_name or "Perusahaan Indonesia",
                            "description": clean_desc,
                            "external_url": direct_url,
                            "budget_or_salary": salary_str,
                            "status": "open"
                        })
                        count_kw += 1
                        if count_kw >= max_per_keyword:
                            break
            except Exception:
                continue

        return live_jobs

    def fetch_live_remotive_jobs(self, max_count: int = 4) -> List[Dict[str, Any]]:
        """Ambil lowongan remote IT riil & aktif dari Official Public API Remotive."""
        url = "https://remotive.com/api/remote-jobs"
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        live_jobs: List[Dict[str, Any]] = []
        try:
            with urllib.request.urlopen(req, timeout=8) as response:
                data = json.loads(response.read().decode("utf-8", errors="ignore"))
                jobs = data.get("jobs", [])
                for j in jobs:
                    title = (j.get("title") or "").strip()
                    category = (j.get("category") or "").lower()
                    direct_url = (j.get("url") or "").strip()
                    jid = str(j.get("id", ""))
                    if not (jid and title and direct_url):
                        continue

                    combined = f"{title} {category}".lower()
                    if not any(k in combined for k in ["software", "dev", "engineer", "python", "react", "frontend", "backend", "full-stack", "fullstack", "ai", "data"]):
                        continue

                    clean_desc = _strip_html(j.get("description") or "")
                    if len(clean_desc) > 550:
                        clean_desc = clean_desc[:550] + "..."

                    raw_type = (j.get("job_type") or "").lower()
                    j_type = "freelance" if ("contract" in raw_type or "freelance" in raw_type) else "part_time"

                    salary = (j.get("salary") or "").strip() or "Competitive Remote Compensation"

                    live_jobs.append({
                        "platform_source": "remotive",
                        "external_job_id": f"rm-{jid}",
                        "job_type": j_type,
                        "title": title,
                        "company_or_client": j.get("company_name") or "Remote Tech Company",
                        "description": clean_desc,
                        "external_url": direct_url,
                        "budget_or_salary": salary,
                        "status": "open"
                    })
                    if len(live_jobs) >= max_count:
                        break
        except Exception:
            pass
        return live_jobs

    def _delete_job_cascade(self, db: Session, job: JobVacancy) -> None:
        db.query(Match).filter(Match.job_vacancy_id == job.id).delete()
        db.query(Embedding).filter(Embedding.job_vacancy_id == job.id).delete()
        db.query(JobBookmark).filter(JobBookmark.job_vacancy_id == job.id).delete()
        db.delete(job)

    async def ingest_jobs(self, db: Session) -> Dict[str, int]:
        """Tarik lowongan 100% riil dari 4 platform online, bersihkan dummy/duplikat lama, ekstrak kriteria AI, dan hitung embedding."""
        # 1. Bersihkan entri dummy/pencarian lama jika masih tersisa di database
        obsolete_jobs = db.query(JobVacancy).filter(
            (JobVacancy.platform_source.in_(["upwork", "fiverr"])) |
            (JobVacancy.external_url.contains("buyer-requests")) |
            (JobVacancy.external_url.contains("/nx/search/jobs")) |
            (JobVacancy.external_url.contains("/search/gigs")) |
            (JobVacancy.external_url.contains("/jobs/search/")) |
            (JobVacancy.company_or_client.contains("(#None)"))
        ).all()
        deleted_ids = set()
        for oj in obsolete_jobs:
            self._delete_job_cascade(db, oj)
            deleted_ids.add(oj.id)

        # Hapus duplikat URL eksternal agar setiap lowongan tampil 1 kali saja
        seen_urls = set()
        for job_row in db.query(JobVacancy).all():
            if job_row.id in deleted_ids:
                continue
            if job_row.external_url in seen_urls:
                self._delete_job_cascade(db, job_row)
                deleted_ids.add(job_row.id)
            else:
                seen_urls.add(job_row.external_url)

        if deleted_ids:
            db.commit()

        # 2. Tarik lowongan 100% RIIL secara langsung dari ke-4 platform API
        all_live_jobs: List[Dict[str, Any]] = []
        all_live_jobs.extend(self.fetch_live_linkedin_jobs(
            keywords=["python backend developer", "frontend react developer", "machine learning engineer"],
            max_per_keyword=2
        ))
        all_live_jobs.extend(self.fetch_live_freelancer_jobs(limit_per_skill=3))
        all_live_jobs.extend(self.fetch_live_kalibrr_jobs(
            keywords=["python", "frontend", "backend"],
            max_per_keyword=2
        ))
        all_live_jobs.extend(self.fetch_live_remotive_jobs(max_count=4))

        # Deduplikasi berdasarkan (platform_source, external_job_id) dan external_url
        jobs_map: Dict[str, Dict[str, Any]] = {}
        seen_live_urls = set()
        for item in all_live_jobs:
            key = f"{item['platform_source']}::{item['external_job_id']}"
            if item["external_url"] in seen_live_urls and key not in jobs_map:
                continue
            seen_live_urls.add(item["external_url"])
            jobs_map[key] = item

        added_count = 0
        updated_count = 0

        for item in jobs_map.values():
            platform = item["platform_source"]
            ext_id = item["external_job_id"]

            existing_job = db.query(JobVacancy).filter(
                ((JobVacancy.platform_source == platform) & (JobVacancy.external_job_id == ext_id)) |
                (JobVacancy.external_url == item["external_url"])
            ).first()

            if existing_job and existing_job.extracted_skills and existing_job.embedding:
                existing_job.external_job_id = ext_id
                existing_job.title = item["title"]
                existing_job.company_or_client = item["company_or_client"]
                existing_job.external_url = item["external_url"]
                existing_job.budget_or_salary = item["budget_or_salary"]
                existing_job.status = item["status"]
                updated_count += 1
                continue

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
                existing_job.title = item["title"]
                existing_job.company_or_client = item["company_or_client"]
                existing_job.description = item["description"]
                existing_job.external_url = item["external_url"]
                existing_job.budget_or_salary = item["budget_or_salary"]
                existing_job.extracted_skills = extracted_skills
                existing_job.status = item["status"]
                existing_job.processing_status = "done"

                if existing_job.embedding:
                    existing_job.embedding.embedding_vector = vector
                else:
                    db.add(Embedding(
                        job_vacancy_id=existing_job.id,
                        embedding_vector=vector,
                        model_name=embedding_service.model_name
                    ))
                updated_count += 1
            else:
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

                db.add(Embedding(
                    job_vacancy_id=new_job.id,
                    embedding_vector=vector,
                    model_name=embedding_service.model_name
                ))
                added_count += 1

        db.commit()

        # 3. Hitung ulang skor kecocokan semantik untuk seluruh profil mahasiswa aktif
        try:
            profiles = db.query(MahasiswaProfile).all()
            open_jobs = db.query(JobVacancy).filter(JobVacancy.status == "open").all()
            for profile in profiles:
                if not profile.embedding or not profile.embedding.embedding_vector:
                    continue
                for job in open_jobs:
                    if not job.embedding or not job.embedding.embedding_vector:
                        continue
                    sim = matching_engine.calculate_cosine_similarity(
                        profile.embedding.embedding_vector,
                        job.embedding.embedding_vector
                    )
                    breakdown = matching_engine.generate_score_breakdown(
                        profile.extracted_skills or {},
                        job.extracted_skills or {},
                        sim
                    )
                    existing_match = db.query(Match).filter(
                        Match.mahasiswa_id == profile.id,
                        Match.job_vacancy_id == job.id
                    ).first()
                    if existing_match:
                        existing_match.similarity_score = sim
                        existing_match.score_breakdown = breakdown
                    else:
                        db.add(Match(
                            mahasiswa_id=profile.id,
                            job_vacancy_id=job.id,
                            similarity_score=sim,
                            score_breakdown=breakdown
                        ))
            db.commit()
        except Exception:
            db.rollback()

        return {"added": added_count, "updated": updated_count}


job_ingestion_service = JobIngestionService()
