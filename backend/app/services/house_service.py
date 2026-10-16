from typing import Any, TypeVar

from app.exceptions import BusinessError
from app.models.enums import LandlordStatus, ViewingStatus
from app.models.house import House
from app.repositories.house_repository import HouseRepository

StatusEnum = TypeVar("StatusEnum", LandlordStatus, ViewingStatus)


class HouseService:
    def __init__(self, house_repository: HouseRepository):
        self.house_repository = house_repository

    def create_house(self, url: Any, total_rent: Any, note: Any) -> House:
        if any(_is_missing(value) for value in (url, total_rent, note)):
            raise BusinessError("必要參數未提供", 400)
        if not _is_positive_integer(total_rent):
            raise BusinessError("總租金必須為正整數", 400)
        if self.house_repository.find_by_url(url) is not None:
            raise BusinessError("網址已存在", 422)
        return self.house_repository.save(House(url=url, total_rent=total_rent, note=note))

    def update_total_rent(self, house_id: int, total_rent: Any) -> House:
        house = self._get_house(house_id)
        if _is_missing(total_rent):
            raise BusinessError("必要參數未提供", 400)
        if not _is_positive_integer(total_rent):
            raise BusinessError("總租金必須為正整數", 400)
        house.total_rent = total_rent
        return self.house_repository.save(house)

    def update_landlord_status(self, house_id: int, status: Any) -> House:
        house = self._get_house(house_id)
        house.landlord_status = _parse_status(status, LandlordStatus)
        return self.house_repository.save(house)

    def update_viewing_status(self, house_id: int, status: Any) -> House:
        house = self._get_house(house_id)
        house.viewing_status = _parse_status(status, ViewingStatus)
        return self.house_repository.save(house)

    def delete_house(self, house_id: int) -> None:
        self.house_repository.delete(self._get_house(house_id))

    def _get_house(self, house_id: int) -> House:
        house = self.house_repository.find_by_id(house_id)
        if house is None:
            raise BusinessError("房屋不存在", 404)
        return house


def _parse_status(value: Any, status_enum: type[StatusEnum]) -> StatusEnum:
    """狀態可任意切換至清單中任一值（含往回改），只驗證值是否在清單中。"""
    if _is_missing(value):
        raise BusinessError("必要參數未提供", 400)
    if value not in {status.value for status in status_enum}:
        raise BusinessError("狀態不合法", 400)
    return status_enum(value)


def _is_missing(value: Any) -> bool:
    return value is None or value == ""


def _is_positive_integer(value: Any) -> bool:
    return isinstance(value, int) and not isinstance(value, bool) and value > 0
