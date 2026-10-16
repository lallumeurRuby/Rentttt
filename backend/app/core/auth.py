import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.deps import get_db
from app.core.security import ALGORITHM
from app.exceptions import BusinessError
from app.models.member import Member
from app.repositories.member_repository import MemberRepository

_bearer = HTTPBearer(auto_error=False)


def get_current_member(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: Session = Depends(get_db),
) -> Member:
    if credentials is None:
        raise BusinessError("請先登入", 401)
    try:
        payload = jwt.decode(credentials.credentials, settings.JWT_SECRET, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        raise BusinessError("請先登入", 401)
    member = MemberRepository(db).find_by_name(payload.get("member_name", ""))
    if member is None:
        raise BusinessError("請先登入", 401)
    return member
