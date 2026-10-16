from datetime import datetime


def parse_cell(value: str):
    """Data Table 儲存格轉 JSON 值：空字串 → None（視為未提供）；整數 / 小數 → 數字；其餘維持字串。"""
    if value == "":
        return None
    for cast in (int, float):
        try:
            return cast(value)
        except ValueError:
            continue
    return value


def request_body(row, field_map: dict[str, str]) -> dict:
    """依 {中文欄位: api 欄位} 組 request body，未提供（空白）的欄位不放入。"""
    body = {}
    for column, field in field_map.items():
        value = parse_cell(row[column])
        if value is not None:
            body[field] = value
    return body


def parse_datetime(value: str) -> datetime:
    return datetime.strptime(value, "%Y-%m-%d %H:%M")
