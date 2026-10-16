from behave import then
from helpers.jwt_helper import JwtHelper


@then('查詢結果應包含可識別成員 "{name}" 的登入憑證')
def step_impl(context, name):
    token = context.last_response.json()["data"]["token"]
    assert token, "查詢結果沒有登入憑證"
    actual = JwtHelper().decode_member_name(token)
    assert actual == name, f"憑證識別的成員應為 {name}，實際 {actual}"
