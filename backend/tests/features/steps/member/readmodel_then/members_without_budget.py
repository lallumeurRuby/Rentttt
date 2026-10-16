from behave import then


@then("查詢結果的成員不應包含個人最高預算與分租權重")
def step_impl(context):
    data = context.last_response.json()["data"]
    assert len(data) > 0, "查詢結果沒有任何成員"
    for item in data:
        leaked = {"maxBudget", "rentWeight"} & item.keys()
        assert not leaked, f"成員 {item.get('name')} 不應回傳 {sorted(leaked)}"
