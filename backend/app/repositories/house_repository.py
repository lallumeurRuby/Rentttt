from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.house import House


class HouseRepository:
    def __init__(self, session: Session):
        self.session = session

    def save(self, house: House) -> House:
        house = self.session.merge(house)
        self.session.commit()
        return house

    def delete(self, house: House) -> None:
        """永久刪除；投票由 DB 外鍵 ON DELETE CASCADE 一併刪除。"""
        self.session.delete(house)
        self.session.commit()

    def find_by_id(self, house_id: int) -> House | None:
        return self.session.get(House, house_id)

    def find_by_url(self, url: str) -> House | None:
        return self.session.scalars(select(House).where(House.url == url)).first()

    def find_all_by_rent_then_newest(self) -> list[House]:
        """列表排序：總租金由低到高，相同時新增時間由新到舊。"""
        return list(
            self.session.scalars(
                select(House).order_by(
                    House.total_rent.asc(), House.created_at.desc(), House.id.desc()
                )
            )
        )

    def find_all(self) -> list[House]:
        return list(self.session.scalars(select(House).order_by(House.id)))
