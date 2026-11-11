import sys
import os
from fastapi.testclient import TestClient

# Pastikan path backend terdaftar
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.models.models import User, MahasiswaProfile, Embedding, Match, JobBookmark, Notification

def _cleanup_test_user(email: str):
    db = SessionLocal()
    try:
        u = db.query(User).filter(User.email == email).first()
        if u:
            prof = db.query(MahasiswaProfile).filter(MahasiswaProfile.user_id == u.id).first()
            if prof:
                db.query(Match).filter(Match.mahasiswa_id == prof.id).delete()
                db.query(JobBookmark).filter(JobBookmark.mahasiswa_id == prof.id).delete()
                db.query(Embedding).filter(Embedding.mahasiswa_id == prof.id).delete()
                db.delete(prof)
            db.query(Notification).filter(Notification.user_id == u.id).delete()
            db.delete(u)
            db.commit()
    finally:
        db.close()

def run_all_tests():
    # Pastikan tabel dibuat
    Base.metadata.create_all(bind=engine)
    temp_student_email = "test-suite-tmp@student.uns.ac.id"
    _cleanup_test_user(temp_student_email)

    try:
        with TestClient(app) as client:
            # 1. Root Status
            res_root = client.get("/")
            assert res_root.status_code == 200
            assert res_root.json()["status"] == "operational"
            print("[OK] Test Root Status Passed")

            # 2. Registrasi & Login Mahasiswa Temporer + Sync GitHub
            reg_res = client.post("/api/v1/auth/register", json={
                "email": temp_student_email,
                "password": "TestPassword2026!",
                "full_name": "Test Suite Student",
                "nim": "V3999999",
                "github_username": "kho1rullll"
            })
            assert reg_res.status_code == 201, reg_res.text
            student_token = reg_res.json()["access_token"]
            assert reg_res.json()["user"]["role"] == "mahasiswa"
            print("[OK] Test Register & Login Mahasiswa Passed")

            # 3. Login Admin Khusus Pengelola
            admin_res = client.post("/api/v1/auth/login", json={
                "email": settings.ADMIN_EMAIL,
                "password": settings.ADMIN_PASSWORD
            })
            assert admin_res.status_code == 200, admin_res.text
            admin_token = admin_res.json()["access_token"]
            assert admin_res.json()["user"]["role"] == "admin"
            print("[OK] Test Login Dedicated Admin Passed")

            # 4. Sync GitHub untuk membentuk embedding & recommendations, lalu Ambil Jobs
            headers_mhs = {"Authorization": f"Bearer {student_token}"}
            sync_same_res = client.post("/api/v1/profiles/github/sync", json={"github_username": "kho1rullll"}, headers=headers_mhs)
            assert sync_same_res.status_code == 200
            assert sync_same_res.json()["status"] == "success"
            print("[OK] Test 1 Akun = 1 GitHub (Allow Same Bound Username) Passed")

            jobs_res = client.get("/api/v1/jobs", headers=headers_mhs)
            assert jobs_res.status_code == 200
            jobs = jobs_res.json()
            assert len(jobs) > 0
            first_job_id = jobs[0]["id"]
            print(f"[OK] Test Get Jobs Passed ({len(jobs)} jobs loaded)")

            rec_res = client.get("/api/v1/recommendations/me", headers=headers_mhs)
            assert rec_res.status_code == 200
            recs = rec_res.json()
            assert len(recs) > 0
            print(f"[OK] Test Recommendations Passed ({len(recs)} recommendations loaded)")

            # 5. Bookmark Job
            bm_res = client.post(f"/api/v1/jobs/{first_job_id}/bookmark", headers=headers_mhs)
            assert bm_res.status_code in [201, 409]
            print("[OK] Test Bookmark Job Passed")

            # 6. Admin Statistics & Immutable Dedicated Admin Role/Status Protection
            headers_adm = {"Authorization": f"Bearer {admin_token}"}
            stats_res = client.get("/api/v1/admin/statistics", headers=headers_adm)
            assert stats_res.status_code == 200
            stats = stats_res.json()
            assert "total_jobs" in stats
            assert "jobs_by_platform" in stats

            users_res = client.get("/api/v1/admin/users", headers=headers_adm)
            assert users_res.status_code == 200
            users_list = users_res.json()
            adm_entry = next((u for u in users_list if u["email"] == settings.ADMIN_EMAIL.lower()), None)
            assert adm_entry is not None
            assert adm_entry["is_permanent_admin"] is True
            assert adm_entry["role"] == "admin"

            downgrade_res = client.patch(
                "/api/v1/admin/users",
                json={"user_id": adm_entry["id"], "role": "mahasiswa"},
                headers=headers_adm,
            )
            assert downgrade_res.status_code == 403, downgrade_res.text

            deactivate_res = client.patch(
                "/api/v1/admin/users",
                json={"user_id": adm_entry["id"], "is_active": False},
                headers=headers_adm,
            )
            assert deactivate_res.status_code == 400, deactivate_res.text

            student_entry = next((u for u in users_list if u["email"] == temp_student_email), None)
            assert student_entry is not None
            assert student_entry["is_permanent_admin"] is False
            print("[OK] Test Admin Statistics & Permanent Admin Lock Passed")

            # 7. Kebijakan 1 Akun = 1 GitHub: Tolak perubahan ke username GitHub lain
            sync_diff_res = client.post("/api/v1/profiles/github/sync", json={"github_username": "other-github-user"}, headers=headers_mhs)
            assert sync_diff_res.status_code == 400
            assert "Satu akun hanya dapat disinkronkan dengan 1 akun GitHub permanen" in sync_diff_res.json()["detail"]
            print("[OK] Test 1 Akun = 1 GitHub (Reject Different Username) Passed")

            # 8. Validasi URL Lowongan Riil & Endpoint Refresh Live
            refresh_res = client.post("/api/v1/jobs/refresh-live", headers=headers_mhs)
            assert refresh_res.status_code == 200
            jobs_after = client.get("/api/v1/jobs", headers=headers_mhs).json()
            assert len(jobs_after) > 0, "Expected live real jobs from online platforms"
            allowed_platforms = {"linkedin", "freelancer", "kalibrr", "remotive", "manual"}
            for j in jobs_after:
                platform = (j.get("platform_source") or "").lower()
                url = j["external_url"]
                assert platform in allowed_platforms, f"Unexpected legacy/dummy platform: {platform}"
                assert "buyer-requests" not in url, f"Invalid Fiverr URL: {url}"
                assert "/nx/search/jobs" not in url, f"Search URL not allowed (must be direct job): {url}"
                assert "/search/gigs" not in url, f"Search URL not allowed (must be direct gig): {url}"
                assert "/jobs/search/" not in url, f"Search URL not allowed (must be direct job): {url}"
                assert not url.endswith("-2026"), f"Invalid mock LinkedIn URL: {url}"
                assert "_102" not in url and "_105" not in url, f"Invalid mock Upwork URL: {url}"
            print(f"[OK] Test Real Platform Job URLs & Live Sync Passed ({len(jobs_after)} active jobs verified)")

            print("\nALL BACKEND TESTS PASSED SUCCESSFULLY!")
    finally:
        _cleanup_test_user(temp_student_email)

if __name__ == "__main__":
    run_all_tests()
