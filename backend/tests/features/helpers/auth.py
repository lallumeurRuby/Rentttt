def auth_headers(context, member_name: str) -> dict:
    """該成員已登入（Given 成員 "x" 已登入）則帶 Bearer token；未登入則不帶，用於驗證「請先登入」。"""
    token = context.tokens.get(member_name)
    return {"Authorization": f"Bearer {token}"} if token else {}
