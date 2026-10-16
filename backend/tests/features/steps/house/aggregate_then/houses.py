from behave import then

from app.repositories.house_repository import HouseRepository

_COLUMN_GETTERS = {
    "網址": lambda house: house.url,
    "總租金": lambda house: str(house.total_rent),
    "備註": lambda house: house.note,
    "房東狀態": lambda house: house.landlord_status.value,
    "看房狀態": lambda house: house.viewing_status.value,
}


@then("系統中的房屋應為：")
def step_impl(context):
    context.db_session.expire_all()
    headings = context.table.headings
    houses = HouseRepository(context.db_session).find_all()
    actual = sorted(tuple(_COLUMN_GETTERS[h](house) for h in headings) for house in houses)
    expected = sorted(tuple(row[h] for h in headings) for row in context.table)
    assert actual == expected, f"預期系統中的房屋 {expected}，實際 {actual}"
