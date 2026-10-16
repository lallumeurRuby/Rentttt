from behave import then
from helpers.house import house_id_of

from app.models.member import Member
from app.repositories.vote_repository import VoteRepository


@then('系統中房屋 "{url}" 的投票應為：')
def step_impl(context, url):
    context.db_session.expire_all()
    votes = VoteRepository(context.db_session).find_by_house(house_id_of(context, url))
    actual = sorted(
        (context.db_session.get(Member, vote.member_id).name, vote.choice.value) for vote in votes
    )
    expected = sorted((row["姓名"], row["選擇"]) for row in context.table)
    assert actual == expected, f"預期房屋 {url} 的投票 {expected}，實際 {actual}"
