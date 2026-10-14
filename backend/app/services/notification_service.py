from datetime import datetime, timezone
from typing import Dict, List, Optional
from fastapi import WebSocket
from sqlalchemy.orm import Session
from app.models.models import Notification

class ConnectionManager:
    """Pengelola koneksi aktif WebSocket per user (FR-09 & Section 6.4)."""

    def __init__(self):
        # Memetakan user_id -> List[WebSocket]
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    async def send_personal_message(self, message: dict, user_id: str):
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

    async def broadcast(self, message: dict):
        for connections in self.active_connections.values():
            for connection in connections:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

manager = ConnectionManager()

class NotificationService:
    """Layanan penyimpan dan pemicu notifikasi pengguna (FR-09)."""

    @staticmethod
    async def create_and_push_notification(
        db: Session,
        user_id: str,
        title: str,
        message: str,
        notif_type: str = "match_result",
        match_id: Optional[str] = None
    ) -> Notification:
        notif = Notification(
            user_id=user_id,
            type=notif_type,
            title=title,
            message=message,
            match_id=match_id,
            is_read=False,
            created_at=datetime.now(timezone.utc)
        )
        db.add(notif)
        db.commit()
        db.refresh(notif)

        # Mendorong notifikasi real-time via WebSocket
        payload = {
            "id": notif.id,
            "type": notif.type,
            "title": notif.title,
            "message": notif.message,
            "match_id": notif.match_id,
            "is_read": notif.is_read,
            "created_at": notif.created_at.isoformat()
        }
        await manager.send_personal_message(payload, user_id)
        return notif

notification_service = NotificationService()
