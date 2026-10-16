NONEXISTENT_HOUSE_ID = 0


def house_id_of(context, url: str) -> int:
    """以網址取得 Given 建立的房屋 id；未建立的網址（驗證「房屋不存在」）回傳不存在的 id。"""
    return context.ids.get(url, NONEXISTENT_HOUSE_ID)
