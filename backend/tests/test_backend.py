import sys
import os
from fastapi.testclient import TestClient

# Pastikan path backend terdaftar
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.core.database import Base, engine
from app.main import seed_initial_data

def run_all_tests():
    # Pastikan tabel dibuat & data awal diisi
    Base.metadata.create_all(bind=engine)
    seed_initial_data()

    with TestClient(app) as client:
        # 1. Root Status
        res_root = client.get("/")
        assert res_root.status_code == 200
        assert res_root.json()["status"] == "operational"
        print("[OK] Test Root Status Passed")

        # 2. Login Mahasiswa (Raden Satria)
        login_res = client.post("/api/v1/auth/login", json={
            "email": "satria@student.itb.ac.id",
            "password": "password123"
        })
        assert login_res.status_code == 200
        student_token = login_res.json()["access_token"]
        assert login_res.json()["user"]["role"] == "mahasiswa"
        print("[OK] Test Login Mahasiswa Passed")

        # 3. Login Admin
        admin_res = client.post("/api/v1/auth/login", json={
            "email": "admin@projectmatch.ac.id",
            "password": "password123"
        })
        assert admin_res.status_code == 200
        admin_token = admin_res.json()["access_token"]
        assert admin_res.json()["user"]["role"] == "admin"
        print("[OK] Test Login Admin Passed")

        # 4. Ambil Jobs & Recommendations Mahasiswa
        headers_mhs = {"Authorization": f"Bearer {student_token}"}
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

        # 6. Admin Statistics
        headers_adm = {"Authorization": f"Bearer {admin_token}"}
        stats_res = client.get("/api/v1/admin/statistics", headers=headers_adm)
        assert stats_res.status_code == 200
        stats = stats_res.json()
        assert "total_jobs" in stats
        assert "jobs_by_platform" in stats
        print("[OK] Test Admin Statistics Passed")

        print("\nALL BACKEND TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_all_tests()
