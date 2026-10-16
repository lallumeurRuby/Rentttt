from typing import Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.repositories.member_repository import MemberRepository
from app.services.auth_service import AuthService

router = APIRouter()


class LoginRequest(BaseModel):
    name: str = ""


@router.post("/auth/login")
def login(request: LoginRequest, db: Session = Depends(get_db)) -> dict[str, Any]:
    token, member = AuthService(MemberRepository(db)).login(request.name)
    return {
        "success": True,
        "data": {
            "token": token,
            "member": {
                "name": member.name,
                "maxBudget": member.max_budget,
                "rentWeight": member.rent_weight,
            },
        },
    }
