from behave import when
from helpers.auth import auth_headers


@when('成員 "{name}" 查詢房屋列表')
def step_impl(context, name):
    context.last_response = context.api_client.get(
        "/api/houses", headers=auth_headers(context, name)
    )
