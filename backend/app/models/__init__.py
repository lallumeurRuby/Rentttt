from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


from app.models.house import House  # noqa: E402,F401

# 匯入所有 model，讓 Base.metadata 收錄全部資料表（Alembic / 測試清表用）
from app.models.member import Member  # noqa: E402,F401
from app.models.vote import Vote  # noqa: E402,F401
