from behave import then
from helpers.house import house_id_of

from app.models.enums import VoteChoice
from app.repositories.house_repository import HouseRepository
from app.repositories.vote_repository import VoteRepository

CONSIDER_THRESHOLD = 2  # 規格：至少 2 位成員投「是」即列入考慮清單


def _is_in_consider_list(context, url: str) -> bool:
    context.db_session.expire_all()
    house_id = house_id_of(context, url)
    if HouseRepository(context.db_session).find_by_id(house_id) is None:
        return False
    votes = VoteRepository(context.db_session).find_by_house(house_id)
    return sum(vote.choice == VoteChoice.YES for vote in votes) >= CONSIDER_THRESHOLD


@then('房屋 "{url}" 應在考慮清單中')
def step_in_consider_list(context, url):
    assert _is_in_consider_list(context, url), f"房屋 {url} 應在考慮清單中"


@then('房屋 "{url}" 不應在考慮清單中')
def step_not_in_consider_list(context, url):
    assert not _is_in_consider_list(context, url), f"房屋 {url} 不應在考慮清單中"
