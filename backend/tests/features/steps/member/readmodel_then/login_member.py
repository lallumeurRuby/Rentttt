from behave import then


@then("查詢結果的登入成員應為：")
def step_impl(context):
    member = context.last_response.json()["data"]["member"]
    row = context.table[0]
    expected = {
        "name": row["姓名"],
        "maxBudget": int(row["個人最高預算"]),
        "rentWeight": int(row["分租權重"]),
    }
    actual = {key: member.get(key) for key in expected}
    assert actual == expected, f"預期登入成員 {expected}，實際 {actual}"
