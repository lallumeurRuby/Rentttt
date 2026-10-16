from behave import when
from helpers.auth import auth_headers
from helpers.house import house_id_of


@when('成員 "{name}" 刪除房屋 "{url}"')
def step_impl(context, name, url):
    context.last_response = context.api_client.delete(
        f"/api/houses/{house_id_of(context, url)}", headers=auth_headers(context, name)
    )
