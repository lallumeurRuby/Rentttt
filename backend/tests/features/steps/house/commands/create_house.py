from behave import when
from helpers.auth import auth_headers
from helpers.table import request_body


@when('成員 "{name}" 新增房屋：')
def step_impl(context, name):
    body = request_body(context.table[0], {"網址": "url", "總租金": "totalRent", "備註": "note"})
    context.last_response = context.api_client.post(
        "/api/houses", json=body, headers=auth_headers(context, name)
    )
