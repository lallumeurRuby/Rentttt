from app.repositories.member_repository import MemberRepository


class MemberService:
    def __init__(self, member_repository: MemberRepository):
        self.member_repository = member_repository

    def list_member_names(self) -> list[str]:
        return [member.name for member in self.member_repository.find_all()]
