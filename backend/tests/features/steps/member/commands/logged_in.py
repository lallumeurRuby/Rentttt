from behave import given


@given('成員 "{name}" 已登入')
def step_impl(context, name):
    response = context.api_client.post("/api/auth/login", json={"name": name})
    assert response.status_code == 200, f"前置登入失敗：{response.status_code} {response.text}"
    context.tokens[name] = response.json()["data"]["token"]
