from behave import then

_OVER_BUDGET_LABEL = {True: "是", False: "否"}


@then('查詢結果中房屋 "{url}" 的分租試算應為：')
def step_impl(context, url):
    data = context.last_response.json()["data"]
    house = next((item for item in data if item["url"] == url), None)
    assert house is not None, f"查詢結果中找不到房屋 {url}"
    splits = {split["memberName"]: split for split in house["rentSplits"]}

    headings = context.table.headings
    expected, actual = [], []
    for row in context.table:
        split = splits.get(row["姓名"])
        assert split is not None, f"房屋 {url} 沒有成員 {row['姓名']} 的分租試算"
        actual_row = {"分租租金": str(split["amount"])}
        if "超出預算" in headings:
            actual_row["超出預算"] = _OVER_BUDGET_LABEL[split["overBudget"]]
        actual.append((row["姓名"], actual_row))
        expected.append((row["姓名"], {h: row[h] for h in headings if h != "姓名"}))
    assert actual == expected, f"預期分租試算 {expected}，實際 {actual}"
