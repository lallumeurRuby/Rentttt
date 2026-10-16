from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base


class Member(Base):
    __tablename__ = "members"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    max_budget: Mapped[int] = mapped_column(Integer, nullable=False)
    rent_weight: Mapped[int] = mapped_column(Integer, nullable=False)
