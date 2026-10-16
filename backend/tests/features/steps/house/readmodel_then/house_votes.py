from behave import then

_COLUMN_FIELDS = {"投票結果": "voteResult", "我的投票": "myVote"}
_NOT_VOTED = "未投票"


@then("查詢結果中各房屋的投票應為：")
def step_impl(context):
    houses = {item["url"]: item for item in context.last_response.json()["data"]}
    columns = [h for h in context.table.headings if h != "網址"]
    for row in context.table:
        house = houses.get(row["網址"])
        assert house is not None, f"查詢結果中找不到房屋 {row['網址']}"
        for column in columns:
            actual = house[_COLUMN_FIELDS[column]]
            actual = _NOT_VOTED if actual is None else actual
            assert (
                actual == row[column]
            ), f"房屋 {row['網址']} 的{column}應為 {row[column]}，實際 {actual}"
