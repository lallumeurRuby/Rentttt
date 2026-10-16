@command
Feature: 刪除房屋

  成員從房屋列表刪除一筆房屋。三位成員權限相同，任何成員皆可刪除任何房屋。

  Background:
    Given 系統中有以下成員：
      | 姓名  | 個人最高預算 | 分租權重 |
      | ruby  | 12000        | 12       |
      | joyce | 10000        | 10       |
      | cya   | 11000        | 11       |
    And 系統中有以下房屋：
      | 網址                   | 總租金 | 備註   |
      | https://rent.example/a | 33000  | 近捷運 |
      | https://rent.example/b | 30000  | 有陽台 |

  Rule: 前置（狀態）- 操作者必須為已登入成員（否則錯誤為「請先登入」）

    Example: 未登入時刪除房屋失敗且房屋保留
      When 成員 "ruby" 刪除房屋 "https://rent.example/a"
      Then 操作失敗，violation_type 為 "請先登入"
      And 系統中的房屋應為：
        | 網址                   |
        | https://rent.example/a |
        | https://rent.example/b |

  Rule: 前置（狀態）- 房屋必須存在（否則錯誤為「房屋不存在」）

    Example: 刪除不存在的房屋時操作失敗
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 刪除房屋 "https://rent.example/z"
      Then 操作失敗，violation_type 為 "房屋不存在"

  Rule: 後置（狀態）- 房屋應從房屋列表移除

    Example: 刪除房屋 a 後只剩房屋 b
      Given 成員 "joyce" 已登入
      When 成員 "joyce" 刪除房屋 "https://rent.example/a"
      Then 操作成功
      And 系統中的房屋應為：
        | 網址                   |
        | https://rent.example/b |

  Rule: 後置（狀態）- 已列入考慮的房屋被刪除後應從考慮列表移除

    Example: 刪除已有 2 票是的房屋後不在考慮清單中
      Given 系統中有以下投票：
        | 網址                   | 姓名  | 選擇 |
        | https://rent.example/a | ruby  | 是   |
        | https://rent.example/a | joyce | 是   |
      And 成員 "cya" 已登入
      When 成員 "cya" 刪除房屋 "https://rent.example/a"
      Then 操作成功
      And 房屋 "https://rent.example/a" 不應在考慮清單中

  Rule: 後置（狀態）- 該房屋的所有投票應一併刪除

    Example: 刪除房屋 a 後其投票刪除且房屋 b 的投票保留
      Given 系統中有以下投票：
        | 網址                   | 姓名  | 選擇 |
        | https://rent.example/a | ruby  | 是   |
        | https://rent.example/a | joyce | 否   |
        | https://rent.example/b | cya   | 是   |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 刪除房屋 "https://rent.example/a"
      Then 操作成功
      And 系統中房屋 "https://rent.example/a" 應沒有任何投票
      And 系統中房屋 "https://rent.example/b" 的投票應為：
        | 姓名 | 選擇 |
        | cya  | 是   |

  Rule: 後置（狀態）- 刪除應為永久刪除，無法復原

    Example: 刪除後資料庫不保留該房屋
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 刪除房屋 "https://rent.example/a"
      Then 操作成功
      And 系統中的房屋應為：
        | 網址                   |
        | https://rent.example/b |
