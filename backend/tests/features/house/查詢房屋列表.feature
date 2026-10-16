@query
Feature: 查詢房屋列表

  成員查看所有房屋，含分租租金試算、投票結果與進度狀態。

  Background:
    Given 系統中有以下成員：
      | 姓名  | 個人最高預算 | 分租權重 |
      | ruby  | 12000        | 12       |
      | joyce | 10000        | 10       |
      | cya   | 11000        | 11       |

  Rule: 前置（狀態）- 操作者必須為已登入成員（否則錯誤為「請先登入」）

    Example: 未登入時查詢房屋列表失敗
      When 成員 "ruby" 查詢房屋列表
      Then 操作失敗，violation_type 為 "請先登入"

  Rule: 後置（回應）- 每筆房屋應包含網址、總租金、備註、房東狀態、看房狀態

    Example: 沒有任何房屋時回傳空列表
      Given 成員 "ruby" 已登入
      When 成員 "ruby" 查詢房屋列表
      Then 操作成功
      And 查詢結果應沒有任何房屋

    Example: 房屋包含網址、總租金、備註、房東狀態、看房狀態
      Given 系統中有以下房屋：
        | 網址                   | 總租金 | 備註   | 房東狀態 | 看房狀態 |
        | https://rent.example/a | 33000  | 近捷運 | 聯絡中   | 待開始   |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 查詢房屋列表
      Then 操作成功
      And 查詢結果的房屋應依序為：
        | 網址                   | 總租金 | 備註   | 房東狀態 | 看房狀態 |
        | https://rent.example/a | 33000  | 近捷運 | 聯絡中   | 待開始   |

  Rule: 後置（回應）- 每位成員的分租租金應為 總租金 × 該成員分租權重 ÷ 33，四捨五入至整數元

    Scenario Outline: 總租金 <總租金> 時依權重分攤
      Given 系統中有以下房屋：
        | 網址                   | 總租金   | 備註   |
        | https://rent.example/a | <總租金> | 近捷運 |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 查詢房屋列表
      Then 操作成功
      And 查詢結果中房屋 "https://rent.example/a" 的分租試算應為：
        | 姓名  | 分租租金 |
        | ruby  | <ruby>   |
        | joyce | <joyce>  |
        | cya   | <cya>    |

      Examples:
        | 總租金 | ruby  | joyce | cya   |
        | 33000  | 12000 | 10000 | 11000 |
        | 36000  | 13091 | 10909 | 12000 |

  Rule: 後置（回應）- 三位成員分租租金加總與總租金的差額應由分租權重最高的成員（ruby）吸收

    Scenario Outline: 總租金 <總租金> 四捨五入後差額 <差額> 元由 ruby 吸收
      Given 系統中有以下房屋：
        | 網址                   | 總租金   | 備註   |
        | https://rent.example/a | <總租金> | 近捷運 |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 查詢房屋列表
      Then 操作成功
      And 查詢結果中房屋 "https://rent.example/a" 的分租試算應為：
        | 姓名  | 分租租金 |
        | ruby  | <ruby>   |
        | joyce | <joyce>  |
        | cya   | <cya>    |

      Examples:
        | 總租金 | 差額 | ruby  | joyce | cya   |
        | 33001  | +1   | 12001 | 10000 | 11000 |
        | 30002  | -1   | 10909 | 9092  | 10001 |

  Rule: 後置（回應）- 成員的分租租金大於其個人最高預算時應標註為超出預算（等於不算超出）

    Scenario Outline: 總租金 <總租金> 時<情境>
      Given 系統中有以下房屋：
        | 網址                   | 總租金   | 備註   |
        | https://rent.example/a | <總租金> | 近捷運 |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 查詢房屋列表
      Then 操作成功
      And 查詢結果中房屋 "https://rent.example/a" 的分租試算應為：
        | 姓名  | 分租租金 | 超出預算    |
        | ruby  | <ruby>   | <ruby超出>  |
        | joyce | <joyce>  | <joyce超出> |
        | cya   | <cya>    | <cya超出>   |

      Examples:
        | 總租金 | 情境                       | ruby  | ruby超出 | joyce | joyce超出 | cya   | cya超出 |
        | 33000  | 三人剛好等於預算皆不算超出 | 12000 | 否       | 10000 | 否        | 11000 | 否      |
        | 33001  | ruby 多吸收 1 元而超出預算 | 12001 | 是       | 10000 | 否        | 11000 | 否      |
        | 36000  | 三人皆超出預算             | 13091 | 是       | 10909 | 是        | 12000 | 是      |

  Rule: 後置（回應）- 至少 2 位成員投「是」時投票結果應為「列入考慮」

    Example: 2 是、2 是 1 否、3 是的房屋皆為列入考慮
      Given 系統中有以下房屋：
        | 網址                   | 總租金 | 備註 |
        | https://rent.example/p | 30000  | 房P  |
        | https://rent.example/q | 31000  | 房Q  |
        | https://rent.example/r | 32000  | 房R  |
      And 系統中有以下投票：
        | 網址                   | 姓名  | 選擇 |
        | https://rent.example/p | ruby  | 是   |
        | https://rent.example/p | joyce | 是   |
        | https://rent.example/q | ruby  | 是   |
        | https://rent.example/q | joyce | 否   |
        | https://rent.example/q | cya   | 是   |
        | https://rent.example/r | ruby  | 是   |
        | https://rent.example/r | joyce | 是   |
        | https://rent.example/r | cya   | 是   |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 查詢房屋列表
      Then 操作成功
      And 查詢結果中各房屋的投票應為：
        | 網址                   | 投票結果 |
        | https://rent.example/p | 列入考慮 |
        | https://rent.example/q | 列入考慮 |
        | https://rent.example/r | 列入考慮 |

  Rule: 後置（回應）- 至少 2 位成員投「否」時投票結果應為「不考慮」

    Example: 2 否（第三人未投）、1 是 2 否的房屋皆為不考慮
      Given 系統中有以下房屋：
        | 網址                   | 總租金 | 備註 |
        | https://rent.example/s | 30000  | 房S  |
        | https://rent.example/t | 31000  | 房T  |
      And 系統中有以下投票：
        | 網址                   | 姓名  | 選擇 |
        | https://rent.example/s | joyce | 否   |
        | https://rent.example/s | cya   | 否   |
        | https://rent.example/t | ruby  | 是   |
        | https://rent.example/t | joyce | 否   |
        | https://rent.example/t | cya   | 否   |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 查詢房屋列表
      Then 操作成功
      And 查詢結果中各房屋的投票應為：
        | 網址                   | 投票結果 |
        | https://rent.example/s | 不考慮   |
        | https://rent.example/t | 不考慮   |

  Rule: 後置（回應）- 未符合以上兩種情況時投票結果應為「投票中」，且不顯示票數

    Example: 無票、1 是、1 是 1 否的房屋皆為投票中且不顯示票數
      Given 系統中有以下房屋：
        | 網址                   | 總租金 | 備註 |
        | https://rent.example/u | 30000  | 房U  |
        | https://rent.example/v | 31000  | 房V  |
        | https://rent.example/w | 32000  | 房W  |
      And 系統中有以下投票：
        | 網址                   | 姓名  | 選擇 |
        | https://rent.example/v | joyce | 是   |
        | https://rent.example/w | joyce | 是   |
        | https://rent.example/w | cya   | 否   |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 查詢房屋列表
      Then 操作成功
      And 查詢結果中各房屋的投票應為：
        | 網址                   | 投票結果 |
        | https://rent.example/u | 投票中   |
        | https://rent.example/v | 投票中   |
        | https://rent.example/w | 投票中   |
      And 查詢結果不應包含票數

  Rule: 後置（回應）- 應回傳登入成員自己對該房屋的投票選擇

    Example: ruby 看到自己投是、投否與未投票
      Given 系統中有以下房屋：
        | 網址                   | 總租金 | 備註   |
        | https://rent.example/a | 30000  | 近捷運 |
        | https://rent.example/b | 31000  | 有陽台 |
        | https://rent.example/c | 32000  | 近公園 |
      And 系統中有以下投票：
        | 網址                   | 姓名  | 選擇 |
        | https://rent.example/a | ruby  | 是   |
        | https://rent.example/b | ruby  | 否   |
        | https://rent.example/b | joyce | 是   |
        | https://rent.example/c | joyce | 是   |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 查詢房屋列表
      Then 操作成功
      And 查詢結果中各房屋的投票應為：
        | 網址                   | 我的投票 |
        | https://rent.example/a | 是       |
        | https://rent.example/b | 否       |
        | https://rent.example/c | 未投票   |

  Rule: 後置（回應）- 不應回傳其他成員對該房屋的投票選擇

    Example: 三人都投票時查詢結果不含其他成員的票
      Given 系統中有以下房屋：
        | 網址                   | 總租金 | 備註   |
        | https://rent.example/a | 33000  | 近捷運 |
      And 系統中有以下投票：
        | 網址                   | 姓名  | 選擇 |
        | https://rent.example/a | ruby  | 是   |
        | https://rent.example/a | joyce | 否   |
        | https://rent.example/a | cya   | 是   |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 查詢房屋列表
      Then 操作成功
      And 查詢結果不應包含其他成員的投票

  Rule: 後置（回應）- 房屋列表應依總租金由低到高排序

    Example: 三間房屋依總租金由低到高排列
      Given 系統中有以下房屋：
        | 網址                   | 總租金 | 備註   |
        | https://rent.example/a | 30000  | 近捷運 |
        | https://rent.example/b | 25000  | 有陽台 |
        | https://rent.example/c | 36000  | 近公園 |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 查詢房屋列表
      Then 操作成功
      And 查詢結果的房屋應依序為：
        | 網址                   | 總租金 |
        | https://rent.example/b | 25000  |
        | https://rent.example/a | 30000  |
        | https://rent.example/c | 36000  |

  Rule: 後置（回應）- 總租金相同時應依新增時間由新到舊排序

    Example: 總租金相同時較晚新增的房屋排在前面
      Given 系統中有以下房屋：
        | 網址                   | 總租金 | 備註   | 新增時間         |
        | https://rent.example/a | 25000  | 近捷運 | 2026-10-01 10:00 |
        | https://rent.example/b | 25000  | 有陽台 | 2026-10-02 10:00 |
      And 成員 "ruby" 已登入
      When 成員 "ruby" 查詢房屋列表
      Then 操作成功
      And 查詢結果的房屋應依序為：
        | 網址                   |
        | https://rent.example/b |
        | https://rent.example/a |
