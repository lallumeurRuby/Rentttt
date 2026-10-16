# 工程計畫：house-hunting-tracker

> **狀態**: IN_PROGRESS
> **建立日期**: 2026-10-16
> **最後更新**: 2026-10-16
> **技術棧**: python (e2e)
> **需求摘要**: 三人共用的找租屋紀錄平台：成員以姓名登入（無密碼，預建 ruby/joyce/cya 三人，含個人最高預算與分租比例）；新增房屋物件（網址/總租金/備註），依比例試算分租並標示超出預算；匿名投票 2/3 列入考慮清單；追蹤房東狀態與看房狀態。

---

## Dependency Graph

| Phase | Name | Depends On | 狀態 |
|-------|------|------------|------|
| 01 | Requirement Analysis（需求分析 + 影響評估 + 行為設計） | — | done |
| 02 | Entity Modeling（外部品質 — 資料） | 01 | done |
| 03 | BDD Analysis（外部品質 — 可執行規格） | 02 | done |
| 04 | API Contract（內部品質） | 03 | done |
| 05 | Backend TDD Track | 04 | done |
| 06 | Frontend Build Track | 04 | done |
| 07 | Integration Validation | 05, 06 | todo |

```
01 → 02 → 03 → 04 ──┬──→ 05 ──┐
                     │         │
                     └──→ 06 ──→ 07
                                ↑
                         05 ────┘
```

## 線性執行順序（建議）

> 若無平行資源，依此順序逐一執行。

1. 01-requirement-analysis
2. 02-entity
3. 03-bdd-analysis
4. 04-api-contract
5. 05-backend-tdd
6. 06-frontend-build
7. 07-integration

## 品質框架

### Phase 01: Requirement Analysis（統一入口）

不區分 greenfield / 新功能 / 改變需求。每個需求都是 current state → desired state 的 delta。
Phase 01 產出 **Execution Plan**，決定 Phase 02-07 各自的工作範圍。

### External Quality（外部品質）— Phase 02~04

推理順序：**行為(01) → 資料(02) → 規格精煉(03) → 實作契約(04)**。

| Phase | 推理依據 |
|-------|---------|
| 01 → 02 | 有了行為（features）才能推導「作用在什麼實體上」 |
| 02 → 03 | 有了實體結構（erm.dbml）才能寫出精準的 Examples |
| 03 → 04 | 每個 command/query 天然對應一個 API endpoint |

### Implementation — Phase 05~07

Phase 01-04 的產出物是所有實作 Phase 的共同契約。

## 共同契約

Phase 01-04 的產出物是 Phase 05-07 的共同依據（Single Source of Truth）：

| 產物 | 路徑 | 消費者 |
|------|------|--------|
| Execution Plan | `C:/Users/retailingdata/Desktop/ruby/Rentttt/plans/house-hunting-tracker/plan.md` | Phase 02-07（scope 依據） |
| Activity Diagrams | `C:/Users/retailingdata/Desktop/ruby/Rentttt/specs/activities/` | Phase 06（Chrome Test Guard 測試計畫結構） |
| Feature Files（含 Examples） | `C:/Users/retailingdata/Desktop/ruby/Rentttt/backend/tests/features/` | Phase 05（TDD 循環） |
| erm.dbml | `C:/Users/retailingdata/Desktop/ruby/Rentttt/specs/erm.dbml` | Phase 05（Schema Analysis） |
| api.yml | `C:/Users/retailingdata/Desktop/ruby/Rentttt/specs/api.yml` | Phase 05（Red 欄位守衛）、Phase 06（MSW handlers）、Phase 07（驗證基準） |

## Context Management

- 三層持久化：檔案系統（卡片）+ TodoWrite + Context Window
- Compact Proof 層次化：specformula 16 任務 / 各 Phase 內部自管細節
- Lazy Loading：每個 Phase 只載入當前 skill，跨 skill 必定重新 LOAD
- 詳見 skill `references/context-management.md`

---

# Execution Plan

> 由 Phase 01 Discovery 產出（Greenfield → create all）。Feature 根目錄：`C:/Users/retailingdata/Desktop/ruby/Rentttt/backend/tests/features/`

## 概覽
| 類型 | 數量 |
|------|------|
| Create | 12 個規格檔 + 3 個實體 + 10 個 endpoint |
| Modify | 0 |
| Delete | 0 |

## Phase 01: Behavior Design（本 Phase）
| 操作 | 目標 | 說明 |
|------|------|------|
| create | `specs/activities/找租屋追蹤.mmd` | 主流程：成員列表 → 登入 → 房屋列表 → 各項操作 |
| create | `specs/actors/成員.md` | 唯一 Actor |
| create | `member/查詢成員列表.feature` | @query（登入頁用，不需登入） |
| create | `member/登入.feature` | @command |
| create | `house/新增房屋.feature` | @command |
| create | `house/編輯房屋總租金.feature` | @command |
| create | `house/刪除房屋.feature` | @command（連帶移除投票） |
| create | `house/投票是否列入考慮.feature` | @command |
| create | `house/變更房東狀態.feature` | @command |
| create | `house/變更看房狀態.feature` | @command |
| create | `house/查詢房屋列表.feature` | @query |
| create | `house/查詢考慮列表.feature` | @query |

## Phase 02: Entity Modeling
| 操作 | 目標 | 說明 |
|------|------|------|
| create | Member | 預建三位成員（姓名、個人最高預算、分租比例） |
| create | House | 網址、總租金、備註、房東狀態、看房狀態 |
| create | Vote | 成員對房屋的「是否列入考慮」投票（每人每屋一票，可改票） |

## Phase 03: BDD Analysis
| 操作 | 目標 | 說明 |
|------|------|------|
| create | member/ domain | 全新 domain |
| create | house/ domain | 全新 domain |

## Phase 04: API Contract
| 操作 | 目標 | 說明 |
|------|------|------|
| create | 10 endpoints | 每個 .feature 對應 1 個 endpoint（成員列表、登入、新增、編輯總租金、刪除、投票、房東狀態、看房狀態、房屋列表、考慮列表） |

## Phase 05-07: Implementation
| 操作 | 目標 | 說明 |
|------|------|------|
| red-green-refactor | member/*.feature, house/*.feature | 全部新 feature 的 TDD |
| one-shot build | frontend | 登入頁、房屋列表、考慮列表、編輯彈窗 |
| integration | 全部 | 前後端串接驗證 |

## IMPL_IMPACT（由 Phase 02-04 Reconciler 回填）
| Phase | 影響目標 | Impact Type | 來源 | 說明 |
|-------|---------|-------------|------|------|
| 05-07 | 全部 | NEW_OPERATION | Phase 01 | Greenfield |

### Phase 02 Change Summary（erm.dbml）
| 操作 | 目標 | 說明 |
|------|------|------|
| create | Enum landlord_status / viewing_status / vote_choice | 中文值，與 feature 用語一致 |
| create | members table | id, name(unique), max_budget, rent_weight；3 筆 seed |
| create | houses table | id, url(unique), total_rent(>0), note, landlord_status, viewing_status, created_at |
| create | votes table | id, house_id(cascade), member_id, choice；unique(house_id, member_id) |

IMPL_IMPACT：Greenfield，無（全部 NEW_OPERATION）。

### Phase 03 Change Summary（BDD Analysis）
| 操作 | 目標 | 說明 |
|------|------|------|
| create | backend/tests/features/系統抽象.md | 實體、操作分類、Violation 模式、共用句型 S-G1 / S-T1 / S-T2 |
| create | member/句型.md、house/句型.md | 句型清單 + QA 五維分析 + 覆蓋矩陣 |
| create | 10 個 .feature 的 Examples | 86 個 scenario（含 Outline 展開），移除 @ignore |
| modify | 5 個 house feature 的前置（參數）Rule | Q19：移除「房屋必須指定」 |

IMPL_IMPACT：Greenfield，無（全部 NEW_OPERATION）。

### Phase 04 Change Summary（api.yml）
| 操作 | 目標 | 說明 |
|------|------|------|
| create | 10 endpoints | GET /members、POST /auth/login、GET·POST /houses、GET /houses/considered、DELETE /houses/{id}、PUT /houses/{id}/total-rent·my-vote·landlord-status·viewing-status |
| create | shared schemas | Success/Error envelope、Error.violation_type enum（8 種中文訊息）、bearerAuth JWT |

IMPL_IMPACT：Greenfield，無（全部 NEW_OPERATION）。
