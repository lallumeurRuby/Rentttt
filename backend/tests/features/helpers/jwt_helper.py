import jwt

from app.core.config import settings


class JwtHelper:
    """以與後端相同的密鑰解碼登入憑證，驗證 token 識別的成員。"""

    ALGORITHM = "HS256"

    def decode_member_name(self, token: str) -> str:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[self.ALGORITHM])
        return payload["member_name"]
