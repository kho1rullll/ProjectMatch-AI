import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app

def print_all():
    print("=== API OPENAPI PATHS ===")
    openapi = app.openapi()
    for path, methods in openapi.get("paths", {}).items():
        for m in methods.keys():
            print(f"{m.upper():7} {path}")

print_all()
