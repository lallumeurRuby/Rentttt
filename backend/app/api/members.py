from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.repositories.member_repository import MemberRepository
from app.services.member_service import MemberService

router = APIRouter()


@router.get("/members")
def list_members(db: Session = Depends(get_db)) -> dict[str, Any]:
    names = MemberService(MemberRepository(db)).list_member_names()
    return {"success": True, "data": [{"name": name} for name in names]}
