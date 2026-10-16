@query
Feature: 查詢考慮列表

  成員查看已列入考慮的房屋，含分租租金試算與進度狀態。

  Background:
    Given 系統中有以下成員：
      | 姓名  | 個人最高預算 | 分租權重 |
      | ruby  | 12000        | 12       |
      | joyce | 10000        | 10       |
      | cya   | 11000        | 11       |

  Rule: 前置（狀態）- 操作者必須為已登入成員（否則錯誤為「請先登入」）

    Example: 未登入時查詢考慮列表失敗
      When 成員 "ruby" 查詢考慮列表
      Then 操作失敗，violation_type 為 "請先登入"

  Rule: 後置（回應）- 應只包含已列入考慮的房屋

    Example: 只回傳 2 是與 2 是 1 否的房屋，不含不考慮與投票中
      Given 系統中有以下房屋：
        | 網址                   | 總租金 | 備註   |
        | https://rent.example/a | 33000  | 近捷運 |
        | https://rent.example/b | 31000  | 有陽台 |
        | https://rent.example/c | 32000  | 近公園 |
        | https://rent.example/d | 30000  | 有車位 |
      And 系統中有以下投票：
        | 網址                   | 姓名  | 選擇 |
        | https://rent.example/a | ruby  | 是   |
        | https://rent.example/a | joyce | 是   |
        | https://rent.example/b | ruby  | 否   |
        | https://rent.example/b | cya   | 否   |
        | https://rent.example/c | joyce | 是   |
        | https://rent.example/d | ruby  | 是   |
        | https://rent.example/d | joyce | 否   |
        | https://rent.example/d | cya   | 是   |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 查詢考慮列表
      Then 操作成功
      And 查詢結果的房屋應依序為：
        | 網址                   |
        | https://rent.example/d |
        | https://rent.example/a |

  Rule: 後置（回應）- 每筆房屋應包含網址、總租金、備註、房東狀態、看房狀態

    Example: 考慮列表的房屋包含五個欄位
      Given 系統中有以下房屋：
        | 網址                   | 總租金 | 備註   | 房東狀態 | 看房狀態 |
        | https://rent.example/a | 33000  | 近捷運 | 已回覆   | 進行中   |
      And 系統中有以下投票：
        | 網址                   | 姓名  | 選擇 |
        | https://rent.example/a | ruby  | 是   |
        | https://rent.example/a | joyce | 是   |
      And 成員 "joyce" 已登入
      When 成員 "joyce" 查詢考慮列表
      Then 操作成功
      And 查詢結果的房屋應依序為：
        | 網址                   | 總租金 | 備註   | 房東狀態 | 看房狀態 |
        | https://rent.example/a | 33000  | 近捷運 | 已回覆   | 進行中   |

  Rule: 後置（回應）- 每位成員的分租租金應為 總租金 × 該成員分租權重 ÷ 33，四捨五入至整數元

    Example: 總租金 36000 時依權重分攤
      Given 系統中有以下房屋：
        | 網址                   | 總租金 | 備註   |
        | https://rent.example/a | 36000  | 近捷運 |
      And 系統中有以下投票：
        | 網址                   | 姓名  | 選擇 |
        | https://rent.example/a | ruby  | 是   |
        | https://rent.example/a | joyce | 是   |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 查詢考慮列表
      Then 操作成功
      And 查詢結果中房屋 "https://rent.example/a" 的分租試算應為：
        | 姓名  | 分租租金 |
        | ruby  | 13091    |
        | joyce | 10909    |
        | cya   | 12000    |

  Rule: 後置（回應）- 三位成員分租租金加總與總租金的差額應由分租權重最高的成員（ruby）吸收

    Example: 總租金 30002 時 ruby 吸收 -1 元差額
      Given 系統中有以下房屋：
        | 網址                   | 總租金 | 備註   |
        | https://rent.example/a | 30002  | 近捷運 |
      And 系統中有以下投票：
        | 網址                   | 姓名  | 選擇 |
        | https://rent.example/a | ruby  | 是   |
        | https://rent.example/a | joyce | 是   |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 查詢考慮列表
      Then 操作成功
      And 查詢結果中房屋 "https://rent.example/a" 的分租試算應為：
        | 姓名  | 分租租金 |
        | ruby  | 10909    |
        | joyce | 9092     |
        | cya   | 10001    |

  Rule: 後置（回應）- 成員的分租租金大於其個人最高預算時應標註為超出預算（等於不算超出）

    Example: 總租金 33001 時只有 ruby 超出預算
      Given 系統中有以下房屋：
        | 網址                   | 總租金 | 備註   |
        | https://rent.example/a | 33001  | 近捷運 |
      And 系統中有以下投票：
        | 網址                   | 姓名  | 選擇 |
        | https://rent.example/a | ruby  | 是   |
        | https://rent.example/a | joyce | 是   |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 查詢考慮列表
      Then 操作成功
      And 查詢結果中房屋 "https://rent.example/a" 的分租試算應為：
        | 姓名  | 分租租金 | 超出預算 |
        | ruby  | 12001    | 是       |
        | joyce | 10000    | 否       |
        | cya   | 11000    | 否       |

  Rule: 後置（回應）- 考慮列表應依總租金由低到高排序

    Example: 兩間列入考慮的房屋依總租金由低到高排列
      Given 系統中有以下房屋：
        | 網址                   | 總租金 | 備註   |
        | https://rent.example/a | 33000  | 近捷運 |
        | https://rent.example/b | 25000  | 有陽台 |
      And 系統中有以下投票：
        | 網址                   | 姓名  | 選擇 |
        | https://rent.example/a | ruby  | 是   |
        | https://rent.example/a | joyce | 是   |
        | https://rent.example/b | joyce | 是   |
        | https://rent.example/b | cya   | 是   |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 查詢考慮列表
      Then 操作成功
      And 查詢結果的房屋應依序為：
        | 網址                   | 總租金 |
        | https://rent.example/b | 25000  |
        | https://rent.example/a | 33000  |

  Rule: 後置（回應）- 總租金相同時應依新增時間由新到舊排序

    Example: 總租金相同時較晚新增的房屋排在前面
      Given 系統中有以下房屋：
        | 網址                   | 總租金 | 備註   | 新增時間         |
        | https://rent.example/a | 25000  | 近捷運 | 2026-10-01 10:00 |
        | https://rent.example/b | 25000  | 有陽台 | 2026-10-02 10:00 |
      And 系統中有以下投票：
        | 網址                   | 姓名  | 選擇 |
        | https://rent.example/a | ruby  | 是   |
        | https://rent.example/a | joyce | 是   |
        | https://rent.example/b | ruby  | 是   |
        | https://rent.example/b | cya   | 是   |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 查詢考慮列表
      Then 操作成功
      And 查詢結果的房屋應依序為：
        | 網址                   |
        | https://rent.example/b |
        | https://rent.example/a |
