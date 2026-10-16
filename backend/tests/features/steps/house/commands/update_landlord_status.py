from behave import when
from helpers.auth import auth_headers
from helpers.house import house_id_of
from helpers.table import request_body


@when('成員 "{name}" 變更房屋 "{url}" 的房東狀態：')
def step_impl(context, name, url):
    body = request_body(context.table[0], {"房東狀態": "landlordStatus"})
    context.last_response = context.api_client.put(
        f"/api/houses/{house_id_of(context, url)}/landlord-status",
        json=body,
        headers=auth_headers(context, name),
    )
