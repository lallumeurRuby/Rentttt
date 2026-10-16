from behave import then

# api.yml HouseListItem 允許回傳的欄位；匿名投票：不得多出票數或他人投票相關欄位
_ALLOWED_FIELDS = {
    "id",
    "url",
    "totalRent",
    "note",
    "landlordStatus",
    "viewingStatus",
    "createdAt",
    "rentSplits",
    "voteResult",
    "myVote",
}


def _assert_only_allowed_fields(context, what: str) -> None:
    data = context.last_response.json()["data"]
    assert len(data) > 0, "查詢結果沒有任何房屋"
    for item in data:
        extra = set(item.keys()) - _ALLOWED_FIELDS
        assert not extra, f"房屋 {item.get('url')} 不應包含{what}，但回傳了 {sorted(extra)}"
        assert isinstance(item["myVote"], (str, type(None))), "myVote 只能是自己的單一選擇"


@then("查詢結果不應包含票數")
def step_no_vote_counts(context):
    _assert_only_allowed_fields(context, "票數")


@then("查詢結果不應包含其他成員的投票")
def step_no_other_members_votes(context):
    _assert_only_allowed_fields(context, "其他成員的投票")
