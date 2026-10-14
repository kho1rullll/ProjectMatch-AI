from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.core.security import decode_access_token
from app.services.notification_service import manager

router = APIRouter(tags=["WebSocket Real-Time Notifications (FR-09)"])

@router.websocket("/ws/notifications")
async def websocket_notifications_endpoint(
    websocket: WebSocket,
    token: str = Query(None)
):
    """FR-09: Kanal real-time notifikasi lowongan baru yang cocok, diautentikasi token JWT."""
    if not token:
        await websocket.close(code=1008)
        return

    payload = decode_access_token(token)
    if not payload:
        await websocket.close(code=1008)
        return

    user_id = payload.get("sub")
    if not user_id:
        await websocket.close(code=1008)
        return

    await manager.connect(websocket, user_id)
    try:
        # Kirim pesan sambutan koneksi aktif
        await websocket.send_json({
            "type": "connection_established",
            "message": "Terhubung ke kanal notifikasi real-time ProjectMatch AI",
            "user_id": user_id
        })
        while True:
            # Tetap menjaga koneksi terbuka (heartbeat/ping)
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
    except Exception:
        manager.disconnect(websocket, user_id)
