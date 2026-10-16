@command
Feature: 變更看房狀態

  成員在房屋列表或考慮列表變更房屋的看房狀態。

  Background:
    Given 系統中有以下成員：
      | 姓名  | 個人最高預算 | 分租權重 |
      | ruby  | 12000        | 12       |
      | joyce | 10000        | 10       |
      | cya   | 11000        | 11       |
    And 系統中有以下房屋：
      | 網址                   | 總租金 | 備註   | 看房狀態 |
      | https://rent.example/a | 33000  | 近捷運 | 未開始   |

  Rule: 前置（狀態）- 操作者必須為已登入成員（否則錯誤為「請先登入」）

    Example: 未登入時變更看房狀態失敗
      When 成員 "ruby" 變更房屋 "https://rent.example/a" 的看房狀態：
        | 看房狀態 |
        | 待開始   |
      Then 操作失敗，violation_type 為 "請先登入"
      And 系統中的房屋應為：
        | 網址                   | 看房狀態 |
        | https://rent.example/a | 未開始   |

  Rule: 前置（狀態）- 房屋必須存在（否則錯誤為「房屋不存在」）

    Example: 變更不存在房屋的看房狀態時操作失敗
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 變更房屋 "https://rent.example/z" 的看房狀態：
        | 看房狀態 |
        | 待開始   |
      Then 操作失敗，violation_type 為 "房屋不存在"

  Rule: 前置（參數）- 看房狀態必須提供（否則錯誤為「必要參數未提供」）

    Example: 未提供看房狀態時操作失敗
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 變更房屋 "https://rent.example/a" 的看房狀態：
        | 看房狀態 |
        |          |
      Then 操作失敗，violation_type 為 "必要參數未提供"

  Rule: 前置（參數）- 看房狀態必須為「未開始」、「待開始」、「進行中」或「已結束」（否則錯誤為「狀態不合法」）

    Example: 看房狀態不在清單中時操作失敗
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 變更房屋 "https://rent.example/a" 的看房狀態：
        | 看房狀態 |
        | 取消     |
      Then 操作失敗，violation_type 為 "狀態不合法"

  Rule: 前置（狀態）- 看房狀態可任意切換至清單中任一狀態（含往回改）

    Example: 已結束可改回未開始
      Given 系統中有以下房屋：
        | 網址                   | 總租金 | 備註   | 看房狀態 |
        | https://rent.example/b | 30000  | 有陽台 | 已結束   |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 變更房屋 "https://rent.example/b" 的看房狀態：
        | 看房狀態 |
        | 未開始   |
      Then 操作成功
      And 系統中的房屋應為：
        | 網址                   | 看房狀態 |
        | https://rent.example/a | 未開始   |
        | https://rent.example/b | 未開始   |

  Rule: 後置（狀態）- 房屋的看房狀態應更新為新的狀態

    Scenario Outline: 看房狀態由<原狀態>改為<新狀態>
      Given 系統中有以下房屋：
        | 網址                   | 總租金 | 備註   | 看房狀態 |
        | https://rent.example/b | 30000  | 有陽台 | <原狀態> |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 變更房屋 "https://rent.example/b" 的看房狀態：
        | 看房狀態 |
        | <新狀態> |
      Then 操作成功
      And 系統中的房屋應為：
        | 網址                   | 看房狀態 |
        | https://rent.example/a | 未開始   |
        | https://rent.example/b | <新狀態> |

      Examples:
        | 原狀態 | 新狀態 |
        | 未開始 | 待開始 |
        | 進行中 | 已結束 |
