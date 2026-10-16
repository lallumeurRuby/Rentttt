@command
Feature: 投票是否列入考慮

  成員對房屋匿名投票是否列入考慮。三位成員中至少 2 位投「是」即加入考慮清單。成員可隨時變更自己的選擇。

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

    Example: 未登入時投票失敗
      When 成員 "ruby" 對房屋 "https://rent.example/a" 投票：
        | 選擇 |
        | 是   |
      Then 操作失敗，violation_type 為 "請先登入"
      And 系統中房屋 "https://rent.example/a" 應沒有任何投票

  Rule: 前置（狀態）- 房屋必須存在（否則錯誤為「房屋不存在」）

    Example: 對不存在的房屋投票時操作失敗
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 對房屋 "https://rent.example/z" 投票：
        | 選擇 |
        | 是   |
      Then 操作失敗，violation_type 為 "房屋不存在"

  Rule: 前置（參數）- 投票選項必須提供（否則錯誤為「必要參數未提供」）

    Example: 未提供投票選項時投票失敗
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 對房屋 "https://rent.example/a" 投票：
        | 選擇 |
        |      |
      Then 操作失敗，violation_type 為 "必要參數未提供"

  Rule: 前置（參數）- 投票選項必須為「是」或「否」（否則錯誤為「投票選項不合法」）

    Example: 投票選項不是是或否時投票失敗
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 對房屋 "https://rent.example/a" 投票：
        | 選擇 |
        | 可能 |
      Then 操作失敗，violation_type 為 "投票選項不合法"

  Rule: 後置（狀態）- 每位成員對同一房屋應只保留一張票

    Example: 第一次投票後系統記錄該成員的一張票
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 對房屋 "https://rent.example/a" 投票：
        | 選擇 |
        | 是   |
      Then 操作成功
      And 系統中房屋 "https://rent.example/a" 的投票應為：
        | 姓名 | 選擇 |
        | ruby | 是   |

  Rule: 後置（狀態）- 成員再次投票時應以新選擇取代原本的選擇

    Example: ruby 由否改為是後仍只有一張票
      Given 系統中有以下投票：
        | 網址                   | 姓名 | 選擇 |
        | https://rent.example/a | ruby | 否   |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 對房屋 "https://rent.example/a" 投票：
        | 選擇 |
        | 是   |
      Then 操作成功
      And 系統中房屋 "https://rent.example/a" 的投票應為：
        | 姓名 | 選擇 |
        | ruby | 是   |

  Rule: 後置（狀態）- 至少 2 位成員投「是」時房屋應列入考慮清單（不需等第三位成員投票）

    Example: 只有 1 位投是時尚未列入考慮清單
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 對房屋 "https://rent.example/a" 投票：
        | 選擇 |
        | 是   |
      Then 操作成功
      And 房屋 "https://rent.example/a" 不應在考慮清單中

    Example: 第 2 位投是時立即列入考慮清單（cya 尚未投票）
      Given 系統中有以下投票：
        | 網址                   | 姓名 | 選擇 |
        | https://rent.example/a | ruby | 是   |
      And 成員 "joyce" 已登入
      When 成員 "joyce" 對房屋 "https://rent.example/a" 投票：
        | 選擇 |
        | 是   |
      Then 操作成功
      And 房屋 "https://rent.example/a" 應在考慮清單中

  Rule: 後置（狀態）- 改票後投「是」少於 2 位時房屋應移出考慮清單

    Example: ruby 由是改為否後房屋移出考慮清單
      Given 系統中有以下投票：
        | 網址                   | 姓名  | 選擇 |
        | https://rent.example/a | ruby  | 是   |
        | https://rent.example/a | joyce | 是   |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 對房屋 "https://rent.example/a" 投票：
        | 選擇 |
        | 否   |
      Then 操作成功
      And 房屋 "https://rent.example/a" 不應在考慮清單中
