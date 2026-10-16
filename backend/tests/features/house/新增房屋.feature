@command
Feature: 新增房屋

  成員新增一筆房屋來源，加入房屋列表。網址與總租金必填，備註可留空。

  Background:
    Given 系統中有以下成員：
      | 姓名  | 個人最高預算 | 分租權重 |
      | ruby  | 12000        | 12       |
      | joyce | 10000        | 10       |
      | cya   | 11000        | 11       |

  Rule: 前置（狀態）- 操作者必須為已登入成員（否則錯誤為「請先登入」）

    Example: 未登入時新增房屋失敗
      When 成員 "ruby" 新增房屋：
        | 網址                   | 總租金 | 備註   |
        | https://rent.example/a | 33000  | 近捷運 |
      Then 操作失敗，violation_type 為 "請先登入"

  Rule: 前置（參數）- 網址、總租金必須提供（否則錯誤為「必要參數未提供」）

    Scenario Outline: 缺少<缺少欄位>時新增房屋失敗
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 新增房屋：
        | 網址   | 總租金   | 備註   |
        | <網址> | <總租金> | <備註> |
      Then 操作失敗，violation_type 為 "必要參數未提供"

      Examples:
        | 缺少欄位 | 網址                   | 總租金 | 備註   |
        | 網址     |                        | 33000  | 近捷運 |
        | 總租金   | https://rent.example/a |        | 近捷運 |

  Rule: 前置（參數）- 總租金必須為正整數（否則錯誤為「總租金必須為正整數」）

    Scenario Outline: 總租金為<情境>時新增房屋失敗
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 新增房屋：
        | 網址                   | 總租金   | 備註   |
        | https://rent.example/a | <總租金> | 近捷運 |
      Then 操作失敗，violation_type 為 "總租金必須為正整數"

      Examples:
        | 情境   | 總租金 |
        | 零     | 0      |
        | 負數   | -1     |
        | 小數   | 1.5    |
        | 非數字 | abc    |

  Rule: 前置（狀態）- 網址不得與目前存在的房屋完全相同（已刪除的房屋不列入比對）（否則錯誤為「網址已存在」）

    Example: 網址與現存房屋相同時新增失敗
      Given 系統中有以下房屋：
        | 網址                   | 總租金 | 備註   |
        | https://rent.example/a | 30000  | 有陽台 |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 新增房屋：
        | 網址                   | 總租金 | 備註   |
        | https://rent.example/a | 33000  | 近捷運 |
      Then 操作失敗，violation_type 為 "網址已存在"
      And 系統中的房屋應為：
        | 網址                   | 總租金 | 備註   |
        | https://rent.example/a | 30000  | 有陽台 |

    Example: 網址僅結尾斜線不同時視為不同房屋
      Given 系統中有以下房屋：
        | 網址                   | 總租金 | 備註   |
        | https://rent.example/a | 30000  | 有陽台 |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 新增房屋：
        | 網址                    | 總租金 | 備註   |
        | https://rent.example/a/ | 33000  | 近捷運 |
      Then 操作成功
      And 系統中的房屋應為：
        | 網址                    | 總租金 | 備註   |
        | https://rent.example/a  | 30000  | 有陽台 |
        | https://rent.example/a/ | 33000  | 近捷運 |

  Rule: 後置（狀態）- 房屋列表應新增一筆含網址、總租金、備註的房屋

    Scenario Outline: 新增總租金為 <總租金> 的房屋後系統中有該房屋
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 新增房屋：
        | 網址   | 總租金   | 備註   |
        | <網址> | <總租金> | <備註> |
      Then 操作成功
      And 系統中的房屋應為：
        | 網址   | 總租金   | 備註   |
        | <網址> | <總租金> | <備註> |

      Examples:
        | 網址                   | 總租金 | 備註         |
        | https://rent.example/a | 33000  | 近捷運       |
        | https://rent.example/b | 1      | 最低租金測試 |

  Rule: 後置（狀態）- 未填備註時房屋應以空白備註新增

    Example: 未填備註時新增成功且備註為空白
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 新增房屋：
        | 網址                   | 總租金 | 備註 |
        | https://rent.example/a | 33000  |      |
      Then 操作成功
      And 系統中的房屋應為：
        | 網址                   | 總租金 | 備註 |
        | https://rent.example/a | 33000  |      |

  Rule: 後置（狀態）- 新房屋的房東狀態應為「待聯絡」

    Example: 新增房屋後房東狀態為待聯絡
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 新增房屋：
        | 網址                   | 總租金 | 備註   |
        | https://rent.example/a | 33000  | 近捷運 |
      Then 操作成功
      And 系統中的房屋應為：
        | 網址                   | 房東狀態 |
        | https://rent.example/a | 待聯絡   |

  Rule: 後置（狀態）- 新房屋的看房狀態應為「未開始」

    Example: 新增房屋後看房狀態為未開始
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 新增房屋：
        | 網址                   | 總租金 | 備註   |
        | https://rent.example/a | 33000  | 近捷運 |
      Then 操作成功
      And 系統中的房屋應為：
        | 網址                   | 看房狀態 |
        | https://rent.example/a | 未開始   |

  Rule: 後置（狀態）- 新房屋應尚無任何投票

    Example: 新增房屋後尚無任何投票
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 新增房屋：
        | 網址                   | 總租金 | 備註   |
        | https://rent.example/a | 33000  | 近捷運 |
      Then 操作成功
      And 系統中房屋 "https://rent.example/a" 應沒有任何投票
