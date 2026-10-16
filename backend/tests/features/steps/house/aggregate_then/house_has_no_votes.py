from behave import then

from app.repositories.house_repository import HouseRepository
from app.repositories.vote_repository import VoteRepository


@then('系統中房屋 "{url}" 應沒有任何投票')
def step_impl(context, url):
    context.db_session.expire_all()
    house_id = context.ids.get(url)
    if house_id is None:
        house = HouseRepository(context.db_session).find_by_url(url)
        assert house is not None, f"找不到房屋 {url}"
        house_id = house.id
    votes = VoteRepository(context.db_session).find_by_house(house_id)
    assert votes == [], f"房屋 {url} 應沒有任何投票，實際 {len(votes)} 張"
