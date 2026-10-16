from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.member import Member


class MemberRepository:
    def __init__(self, session: Session):
        self.session = session

    def save(self, member: Member) -> Member:
        """Upsert by name：成員由 migration 預建，測試 Given 會以同名資料覆蓋。"""
        existing = self.find_by_name(member.name)
        if existing is not None:
            existing.max_budget = member.max_budget
            existing.rent_weight = member.rent_weight
            member = existing
        else:
            self.session.add(member)
        self.session.commit()
        return member

    def find_by_name(self, name: str) -> Member | None:
        return self.session.scalars(select(Member).where(Member.name == name)).first()

    def find_all(self) -> list[Member]:
        return list(self.session.scalars(select(Member).order_by(Member.id)))
