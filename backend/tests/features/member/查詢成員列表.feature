@ignore @query
Feature: 查詢成員列表

  登入頁列出所有成員的姓名供點選登入。此查詢不需登入。

  Background:
    Given 系統中有以下成員：
      | 姓名  | 個人最高預算 | 分租權重 |
      | ruby  | 12000        | 12       |
      | joyce | 10000        | 10       |
      | cya   | 11000        | 11       |

  Rule: 前置（狀態）- 不需登入即可查詢

  Rule: 後置（回應）- 應回傳所有成員的姓名

  Rule: 後置（回應）- 不應回傳成員的個人最高預算與分租權重

  # ⚠ Example 區段：使用者未提供具體案例，暫不生成。待 Phase 03 BDD Analysis 補充。
