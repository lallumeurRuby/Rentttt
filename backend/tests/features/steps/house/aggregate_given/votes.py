from behave import given

from app.models.enums import VoteChoice
from app.models.vote import Vote
from app.repositories.vote_repository import VoteRepository


@given("系統中有以下投票：")
def step_impl(context):
    repository = VoteRepository(context.db_session)
    for row in context.table:
        repository.save(
            Vote(
                house_id=context.ids[row["網址"]],
                member_id=context.ids[row["姓名"]],
                choice=VoteChoice(row["選擇"]),
            )
        )
