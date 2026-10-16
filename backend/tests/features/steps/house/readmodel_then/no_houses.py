from behave import then


@then("查詢結果應沒有任何房屋")
def step_impl(context):
    data = context.last_response.json()["data"]
    assert data == [], f"查詢結果應沒有任何房屋，實際 {len(data)} 筆"
