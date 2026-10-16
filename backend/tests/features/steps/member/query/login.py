from behave import use_step_matcher, when

# 姓名可為空字串（驗證「姓名必須提供」），parse matcher 的 {name} 不接受空值，改用 regex
use_step_matcher("re")


@when('以姓名 "(?P<name>[^"]*)" 登入')
def step_impl(context, name):
    context.last_response = context.api_client.post("/api/auth/login", json={"name": name})


use_step_matcher("parse")
