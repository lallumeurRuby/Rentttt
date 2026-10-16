from sqlalchemy import ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base
from app.models.enums import VoteChoice, pg_enum


class Vote(Base):
    __tablename__ = "votes"
    __table_args__ = (UniqueConstraint("house_id", "member_id", name="uq_votes_house_member"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    house_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("houses.id", ondelete="CASCADE"), nullable=False
    )
    member_id: Mapped[int] = mapped_column(Integer, ForeignKey("members.id"), nullable=False)
    choice: Mapped[VoteChoice] = mapped_column(pg_enum(VoteChoice, "vote_choice"), nullable=False)
