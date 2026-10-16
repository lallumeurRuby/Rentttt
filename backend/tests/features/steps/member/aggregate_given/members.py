from behave import given

from app.models.member import Member
from app.repositories.member_repository import MemberRepository


@given("系統中有以下成員：")
def step_impl(context):
    repository = MemberRepository(context.db_session)
    for row in context.table:
        member = repository.save(
            Member(
                name=row["姓名"],
                max_budget=int(row["個人最高預算"]),
                rent_weight=int(row["分租權重"]),
            )
        )
        context.ids[row["姓名"]] = member.id
