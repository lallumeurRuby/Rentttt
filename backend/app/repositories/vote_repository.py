from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.vote import Vote


class VoteRepository:
    def __init__(self, session: Session):
        self.session = session

    def save(self, vote: Vote) -> Vote:
        vote = self.session.merge(vote)
        self.session.commit()
        return vote

    def find_by_house_and_member(self, house_id: int, member_id: int) -> Vote | None:
        return self.session.scalars(
            select(Vote).where(Vote.house_id == house_id, Vote.member_id == member_id)
        ).first()

    def find_by_house(self, house_id: int) -> list[Vote]:
        return list(self.session.scalars(select(Vote).where(Vote.house_id == house_id)))
