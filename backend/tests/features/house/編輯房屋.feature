@command
Feature: 編輯房屋

  成員從房屋列表開啟編輯彈窗，修改房屋的總租金與備註，一次儲存。總租金必填、備註可留空（留空即清空）。網址不可編輯。

  Background:
    Given 系統中有以下成員：
      | 姓名  | 個人最高預算 | 分租權重 |
      | ruby  | 12000        | 12       |
      | joyce | 10000        | 10       |
      | cya   | 11000        | 11       |
    And 系統中有以下房屋：
      | 網址                   | 總租金 | 備註   |
      | https://rent.example/a | 33000  | 近捷運 |

  Rule: 前置（狀態）- 操作者必須為已登入成員（否則錯誤為「請先登入」）

    Example: 未登入時編輯房屋失敗
      When 成員 "ruby" 編輯房屋 "https://rent.example/a"：
        | 總租金 | 備註   |
        | 30000  | 近捷運 |
      Then 操作失敗，violation_type 為 "請先登入"
      And 系統中的房屋應為：
        | 網址                   | 總租金 |
        | https://rent.example/a | 33000  |

  Rule: 前置（狀態）- 房屋必須存在（否則錯誤為「房屋不存在」）

    Example: 編輯不存在的房屋時操作失敗
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 編輯房屋 "https://rent.example/z"：
        | 總租金 | 備註   |
        | 30000  | 近捷運 |
      Then 操作失敗，violation_type 為 "房屋不存在"

  Rule: 前置（參數）- 總租金必須提供（否則錯誤為「必要參數未提供」）

    Example: 未提供總租金時編輯失敗
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 編輯房屋 "https://rent.example/a"：
        | 總租金 | 備註   |
        |        | 近捷運 |
      Then 操作失敗，violation_type 為 "必要參數未提供"

  Rule: 前置（參數）- 總租金必須為正整數（否則錯誤為「總租金必須為正整數」）

    Scenario Outline: 總租金改為<情境>時編輯失敗
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 編輯房屋 "https://rent.example/a"：
        | 總租金   | 備註   |
        | <總租金> | 近捷運 |
      Then 操作失敗，violation_type 為 "總租金必須為正整數"
      And 系統中的房屋應為：
        | 網址                   | 總租金 |
        | https://rent.example/a | 33000  |

      Examples:
        | 情境 | 總租金 |
        | 零   | 0      |
        | 負數 | -5     |
        | 小數 | 1.5    |

  Rule: 後置（狀態）- 房屋總租金應更新為新的金額

    Example: 總租金改為 30000 後系統中為 30000
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 編輯房屋 "https://rent.example/a"：
        | 總租金 | 備註   |
        | 30000  | 近捷運 |
      Then 操作成功
      And 系統中的房屋應為：
        | 網址                   | 總租金 |
        | https://rent.example/a | 30000  |

  Rule: 後置（狀態）- 房屋網址應維持不變

    Example: 編輯房屋後網址不變
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 編輯房屋 "https://rent.example/a"：
        | 總租金 | 備註   |
        | 30000  | 近捷運 |
      Then 操作成功
      And 系統中的房屋應為：
        | 網址                   |
        | https://rent.example/a |

  Rule: 後置（狀態）- 房屋備註應更新為新的內容

    Example: 備註改為新內容後系統中為新備註
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 編輯房屋 "https://rent.example/a"：
        | 總租金 | 備註           |
        | 33000  | 近捷運、有陽台 |
      Then 操作成功
      And 系統中的房屋應為：
        | 網址                   | 總租金 | 備註           |
        | https://rent.example/a | 33000  | 近捷運、有陽台 |

  Rule: 後置（狀態）- 備註留空時房屋備註應清空

    Example: 備註留空後系統中的備註為空白
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 編輯房屋 "https://rent.example/a"：
        | 總租金 | 備註 |
        | 33000  |      |
      Then 操作成功
      And 系統中的房屋應為：
        | 網址                   | 總租金 | 備註 |
        | https://rent.example/a | 33000  |      |
