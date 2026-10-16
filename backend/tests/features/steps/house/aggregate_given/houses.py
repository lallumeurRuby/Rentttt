from behave import given
from helpers.table import parse_datetime

from app.models.enums import LandlordStatus, ViewingStatus
from app.models.house import House
from app.repositories.house_repository import HouseRepository


@given("系統中有以下房屋：")
def step_impl(context):
    repository = HouseRepository(context.db_session)
    headings = context.table.headings
    for row in context.table:
        house = House(url=row["網址"], total_rent=int(row["總租金"]), note=row["備註"])
        if "房東狀態" in headings:
            house.landlord_status = LandlordStatus(row["房東狀態"])
        if "看房狀態" in headings:
            house.viewing_status = ViewingStatus(row["看房狀態"])
        if "新增時間" in headings:
            house.created_at = parse_datetime(row["新增時間"])
        house = repository.save(house)
        context.ids[row["網址"]] = house.id
