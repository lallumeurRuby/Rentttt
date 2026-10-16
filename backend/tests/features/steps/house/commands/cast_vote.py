from behave import when
from helpers.auth import auth_headers
from helpers.house import house_id_of
from helpers.table import request_body


@when('成員 "{name}" 對房屋 "{url}" 投票：')
def step_impl(context, name, url):
    body = request_body(context.table[0], {"選擇": "choice"})
    context.last_response = context.api_client.put(
        f"/api/houses/{house_id_of(context, url)}/my-vote",
        json=body,
        headers=auth_headers(context, name),
    )
