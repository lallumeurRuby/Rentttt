from behave import when
from helpers.auth import auth_headers
from helpers.house import house_id_of
from helpers.table import request_body


@when('成員 "{name}" 編輯房屋 "{url}"：')
def step_impl(context, name, url):
    # 備註留空 → 不放入 body → 依 api.yml 視為清空備註
    body = request_body(context.table[0], {"總租金": "totalRent", "備註": "note"})
    context.last_response = context.api_client.put(
        f"/api/houses/{house_id_of(context, url)}",
        json=body,
        headers=auth_headers(context, name),
    )
