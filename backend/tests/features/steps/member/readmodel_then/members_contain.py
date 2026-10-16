from behave import then


@then("查詢結果應包含以下成員（不限順序）：")
def step_impl(context):
    data = context.last_response.json()["data"]
    actual = sorted(item["name"] for item in data)
    expected = sorted(row["姓名"] for row in context.table)
    assert actual == expected, f"預期成員 {expected}，實際 {actual}"
