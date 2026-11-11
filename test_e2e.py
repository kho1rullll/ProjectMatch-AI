import urllib.request
import json
import asyncio
import websockets

def test_http():
    print("=" * 60)
    print(" PROJECTMATCH AI: FRONTEND <-> BACKEND INTEGRATION TEST")
    print("=" * 60)

    # 1. Backend direct
    print("\n[1/7] Testing Backend Direct (http://127.0.0.1:8000/)...")
    with urllib.request.urlopen('http://127.0.0.1:8000/') as res:
        data = json.loads(res.read().decode())
        print(f"      Status: {data.get('status')} | System: {data.get('system')}")
        assert data.get('status') == 'operational'

    # 2. Next.js Frontend
    print("\n[2/7] Testing Next.js Frontend (http://localhost:3000/)...")
    with urllib.request.urlopen('http://localhost:3000/') as res:
        print(f"      Frontend HTTP Status: {res.status}")
        assert res.status == 200

    # 3. Next.js Reverse Proxy to Backend
    print("\n[3/7] Testing Next.js Reverse Proxy (http://localhost:3000/api/v1/openapi.json)...")
    with urllib.request.urlopen('http://localhost:3000/api/v1/openapi.json') as res:
        spec = json.loads(res.read().decode())
        title = spec.get('info', {}).get('title')
        print(f"      Reverse Proxy Working! OpenAPI Title: {title}")
        assert "ProjectMatch" in title

    # 4. Login via Backend through Frontend Proxy
    print("\n[4/7] Testing Student Authentication through Proxy...")
    req = urllib.request.Request(
        'http://localhost:3000/api/v1/auth/login',
        data=json.dumps({'email': 'satria@student.itb.ac.id', 'password': 'password123'}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as res:
        auth_data = json.loads(res.read().decode())
        student_token = auth_data['access_token']
        print(f"      Login Success! User: {auth_data['user']['full_name']} ({auth_data['user']['email']})")

    # 5. Fetch Profile with Bearer Token via Proxy
    print("\n[5/7] Testing Profile Retrieval (FR-02, FR-03)...")
    req_profile = urllib.request.Request(
        'http://localhost:3000/api/v1/profiles/me',
        headers={'Authorization': f'Bearer {student_token}'}
    )
    with urllib.request.urlopen(req_profile) as res:
        profile_data = json.loads(res.read().decode())
        print(f"      NIM: {profile_data['nim']} | GitHub: @{profile_data['github_username']}")
        print(f"      Headline: {profile_data.get('extracted_skills', {}).get('headline')}")

    # 6. Fetch Recommendations via Proxy
    print("\n[6/7] Testing AI Recommendations (FR-06, FR-07)...")
    req_rec = urllib.request.Request(
        'http://localhost:3000/api/v1/recommendations/me',
        headers={'Authorization': f'Bearer {student_token}'}
    )
    with urllib.request.urlopen(req_rec) as res:
        recs = json.loads(res.read().decode())
        print(f"      Total Matched Recommendations: {len(recs)} lowongan")
        if recs:
            top_job = recs[0]['job']
            pct = recs[0]['match_percentage']
            print(f"      Top Match ({pct}%): {top_job['title']} [{top_job['platform_source'].upper()}]")

    # 7. Admin Statistics via Proxy
    print("\n[7/7] Testing Admin Module through Proxy (FR-11, FR-12)...")
    req_admin_login = urllib.request.Request(
        'http://localhost:3000/api/v1/auth/login',
        data=json.dumps({'email': 'admin@projectmatch.ac.id', 'password': 'password123'}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req_admin_login) as res:
        admin_data = json.loads(res.read().decode())
        admin_token = admin_data['access_token']

    req_stats = urllib.request.Request(
        'http://localhost:3000/api/v1/admin/statistics',
        headers={'Authorization': f'Bearer {admin_token}'}
    )
    with urllib.request.urlopen(req_stats) as res:
        stats = json.loads(res.read().decode())
        print(f"      Admin Statistics: Total Users: {stats['total_users']}, Total Jobs: {stats['total_jobs']}")
        print(f"      Job breakdown by platform: {stats['jobs_by_platform']}")

    print("\n" + "=" * 60)
    print(" ALL HTTP & PROXY INTEGRATION CHECKS PASSED!")
    print("=" * 60)
    return student_token

async def test_websocket(token):
    print("\n[WS] Testing Real-Time WebSocket Notification Endpoint (FR-09)...")
    uri = f"ws://127.0.0.1:8000/ws/notifications?token={token}"
    async with websockets.connect(uri) as ws:
        msg = await asyncio.wait_for(ws.recv(), timeout=5.0)
        data = json.loads(msg)
        print(f"     WebSocket Connection Established: {data.get('message')}")
        # Send heartbeat ping
        await ws.send("ping")
        pong = await asyncio.wait_for(ws.recv(), timeout=5.0)
        print(f"     WebSocket Heartbeat Response: {pong}")
        assert pong == "pong"
    print(" [OK] WebSocket Notification Verified!\n")

if __name__ == "__main__":
    token = test_http()
    asyncio.run(test_websocket(token))

