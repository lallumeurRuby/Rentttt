from app.core.security import create_access_token
from app.exceptions import BusinessError
from app.models.member import Member
from app.repositories.member_repository import MemberRepository


class AuthService:
    def __init__(self, member_repository: MemberRepository):
        self.member_repository = member_repository

    def login(self, name: str) -> tuple[str, Member]:
        if not name:
            raise BusinessError("必要參數未提供", 400)
        member = self.member_repository.find_by_name(name)
        if member is None:
            raise BusinessError("查無此成員", 404)
        return create_access_token(member.name), member
