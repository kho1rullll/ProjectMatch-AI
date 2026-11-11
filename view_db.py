"""
Script utilitas untuk melihat isi database SQLite ProjectMatch AI langsung dari terminal.
Penggunaan:
    python view_db.py              # Tampilkan ringkasan semua tabel
    python view_db.py users        # Tampilkan data tabel users
    python view_db.py jobs         # Tampilkan data tabel job_vacancies
    python view_db.py profiles     # Tampilkan data tabel mahasiswa_profiles
    python view_db.py matches      # Tampilkan data tabel matches
"""
import os
import sys
import sqlite3
import json

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DB = os.path.join(ROOT_DIR, "projectmatch_ai.db")
BACKEND_DB = os.path.join(ROOT_DIR, "backend", "projectmatch_ai.db")
DB_PATH = ROOT_DB if os.path.exists(ROOT_DB) else BACKEND_DB

def get_connection():
    return sqlite3.connect(DB_PATH)

def show_summary():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [t[0] for t in cursor.fetchall() if not t[0].startswith("sqlite_")]
    
    print("\n" + "=" * 60)
    print("      DATABASE PROJECTMATCH AI (backend/projectmatch_ai.db)")
    print("=" * 60)
    for table in tables:
        count = cursor.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
        print(f"  * {table:<22} : {count} data baris")
    print("=" * 60)
    print("Tips: Jalankan 'python view_db.py <nama_tabel>' untuk melihat isinya.\n")
    conn.close()

def show_table(table_name):
    alias_map = {
        "jobs": "job_vacancies",
        "profiles": "mahasiswa_profiles",
        "bookmark": "job_bookmarks",
        "bookmarks": "job_bookmarks",
        "notif": "notifications"
    }
    table = alias_map.get(table_name.lower(), table_name.lower())
    
    conn = get_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    try:
        cursor.execute(f"SELECT * FROM {table}")
        rows = cursor.fetchall()
        if not rows:
            print(f"\nTabel '{table}' kosong.\n")
            return
        
        print(f"\n=== ISI TABEL: {table} ({len(rows)} baris) ===")
        for i, row in enumerate(rows, 1):
            print(f"\n[Baris {i}]")
            for key in row.keys():
                val = row[key]
                # Format string panjang atau JSON agar rapi
                if isinstance(val, str) and (val.startswith("{") or val.startswith("[")):
                    try:
                        parsed = json.loads(val)
                        val = json.dumps(parsed, indent=2)[:300] + ("..." if len(str(parsed)) > 300 else "")
                    except:
                        pass
                elif isinstance(val, str) and len(val) > 120:
                    val = val[:120] + "..."
                print(f"  {key:<22}: {val}")
        print("\n" + "=" * 60)
    except sqlite3.OperationalError as e:
        print(f"\nError: Tabel '{table}' tidak ditemukan ({e}).")
        show_summary()
    finally:
        conn.close()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        show_table(sys.argv[1])
    else:
        show_summary()

