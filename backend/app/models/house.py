from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base
from app.models.enums import LandlordStatus, ViewingStatus, pg_enum


class House(Base):
    __tablename__ = "houses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    url: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    total_rent: Mapped[int] = mapped_column(Integer, nullable=False)
    note: Mapped[str] = mapped_column(Text, nullable=False)
    landlord_status: Mapped[LandlordStatus] = mapped_column(
        pg_enum(LandlordStatus, "landlord_status"),
        nullable=False,
        default=LandlordStatus.PENDING_CONTACT,
    )
    viewing_status: Mapped[ViewingStatus] = mapped_column(
        pg_enum(ViewingStatus, "viewing_status"),
        nullable=False,
        default=ViewingStatus.NOT_STARTED,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now()
    )
