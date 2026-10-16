import jwt

from app.core.config import settings

ALGORITHM = "HS256"


def create_access_token(member_name: str) -> str:
    return jwt.encode({"member_name": member_name}, settings.JWT_SECRET, algorithm=ALGORITHM)
