from behave import when


@when("訪客查詢成員列表")
def step_impl(context):
    context.last_response = context.api_client.get("/api/members")
