import enum

from sqlalchemy import Enum


class LandlordStatus(str, enum.Enum):
    PENDING_CONTACT = "待聯絡"
    CONTACTING = "聯絡中"
    REPLIED = "已回覆"


class ViewingStatus(str, enum.Enum):
    NOT_STARTED = "未開始"
    SCHEDULED = "待開始"
    IN_PROGRESS = "進行中"
    FINISHED = "已結束"


class VoteChoice(str, enum.Enum):
    YES = "是"
    NO = "否"


def pg_enum(enum_class: type[enum.Enum], name: str) -> Enum:
    """DB 存中文值（與 erm.dbml / api.yml 一致），而非 Python 成員名稱。"""
    return Enum(enum_class, name=name, values_callable=lambda members: [m.value for m in members])
