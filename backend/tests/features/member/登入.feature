@command
Feature: 登入

  成員從登入頁列出的三位成員中點選自己的姓名登入，不需要密碼。後端仍驗證姓名。系統只有三位預先建立的成員，不提供註冊。

  Background:
    Given 系統中有以下成員：
      | 姓名  | 個人最高預算 | 分租權重 |
      | ruby  | 12000        | 12       |
      | joyce | 10000        | 10       |
      | cya   | 11000        | 11       |

  Rule: 前置（參數）- 姓名必須提供（否則錯誤為「必要參數未提供」）

    Example: 姓名為空時登入失敗
      When 以姓名 "" 登入
      Then 操作失敗，violation_type 為 "必要參數未提供"

  Rule: 前置（狀態）- 姓名必須為已存在的成員（否則錯誤為「查無此成員」）

    Scenario Outline: 姓名<情境>時登入失敗
      When 以姓名 "<姓名>" 登入
      Then 操作失敗，violation_type 為 "查無此成員"

      Examples:
        | 情境               | 姓名 |
        | 不在成員名單       | amy  |
        | 與成員僅大小寫不同 | Ruby |

  Rule: 後置（回應）- 應回傳登入憑證（token），後續操作以此憑證識別成員

    Example: joyce 登入後取得可識別 joyce 的憑證
      When 以姓名 "joyce" 登入
      Then 操作成功
      And 查詢結果應包含可識別成員 "joyce" 的登入憑證

  Rule: 後置（回應）- 應回傳登入成員的姓名、個人最高預算與分租權重

    Example: ruby 登入後回傳 ruby 的成員資料
      When 以姓名 "ruby" 登入
      Then 操作成功
      And 查詢結果的登入成員應為：
        | 姓名 | 個人最高預算 | 分租權重 |
        | ruby | 12000        | 12       |
