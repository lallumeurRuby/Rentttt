from behave import when
from helpers.auth import auth_headers
from helpers.house import house_id_of
from helpers.table import request_body


@when('成員 "{name}" 將房屋 "{url}" 的總租金改為：')
def step_impl(context, name, url):
    body = request_body(context.table[0], {"總租金": "totalRent"})
    context.last_response = context.api_client.put(
        f"/api/houses/{house_id_of(context, url)}/total-rent",
        json=body,
        headers=auth_headers(context, name),
    )
