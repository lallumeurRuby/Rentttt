from behave import then

_COLUMN_FIELDS = {
    "網址": "url",
    "總租金": "totalRent",
    "備註": "note",
    "房東狀態": "landlordStatus",
    "看房狀態": "viewingStatus",
}


@then("查詢結果的房屋應依序為：")
def step_impl(context):
    data = context.last_response.json()["data"]
    headings = context.table.headings
    actual = [tuple(str(item[_COLUMN_FIELDS[h]]) for h in headings) for item in data]
    expected = [tuple(row[h] for h in headings) for row in context.table]
    assert actual == expected, f"預期房屋（依序）{expected}，實際 {actual}"
