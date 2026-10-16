# 工程計畫：edit-house-note

> **狀態**: IN_PROGRESS
> **建立日期**: 2026-10-16
> **最後更新**: 2026-10-16
> **技術棧**: python (e2e)
> **需求摘要**: 備註改為可編輯、非必填：編輯房屋彈窗以一個 API 同時修改總租金（必填）與備註（可留空，留空即清空）；新增房屋時備註也改為非必填。

---

## Dependency Graph

| Phase | Name | Depends On | 狀態 |
|-------|------|------------|------|
| 01 | Requirement Analysis（需求分析 + 影響評估 + 行為設計） | — | done |
| 02 | Entity Modeling（外部品質 — 資料） | 01 | done |
| 03 | BDD Analysis（外部品質 — 可執行規格） | 02 | done |
| 04 | API Contract（內部品質） | 03 | done |
| 05 | Backend TDD Track | 04 | todo |
| 06 | Frontend Build Track | 04 | todo |
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
| Execution Plan | `C:/Users/retailingdata/Desktop/ruby/Rentttt/plans/edit-house-note/plan.md` | Phase 02-07（scope 依據） |
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

見 `C:/Users/retailingdata/Desktop/ruby/Rentttt/plans/edit-house-note/execution-plan.md`（Phase 01 Discovery 產出，CHANGE 模式）。

### Phase 02 Change Summary（erm.dbml）
| 操作 | 目標 | 說明 |
|------|------|------|
| modify | houses.note | 註解改為「可編輯、可留空，未填存空字串」；型別與 not null 不變 |
| modify | houses.total_rent | 註解「唯一可編輯欄位」→「可編輯」 |

IMPL_IMPACT：無（僅註解變更，無 schema / migration 變動）。

### Phase 03 Change Summary（BDD Analysis）
| 操作 | 目標 | 說明 |
|------|------|------|
| modify | 系統抽象.md | 操作「編輯房屋總租金」→「編輯房屋」（總租金必填、備註選填）；新增房屋備註選填 |
| modify | house/句型.md | W4 句型改為 `成員 "{姓名}" 編輯房屋 "{網址}"：`（總租金 / 備註）；測試分析與覆蓋矩陣更新 |
| modify | house/編輯房屋.feature | 9 個既有 Example 改用新句型；+2 Example（備註更新、備註留空清空）；移除 @ignore |
| modify | house/新增房屋.feature | 移除「缺少備註」Example 列；+1 Example（未填備註以空白新增）；移除 @ignore |

## IMPL_IMPACT（Phase 03 回填）
| Phase | 影響目標 | Impact Type | 說明 |
|-------|---------|-------------|------|
| 05 | steps/house/commands/update_total_rent.py | SENTENCE_PATTERN | When 句型改為「編輯房屋 "{網址}"：」，request body 加 note |
| 05 | HouseService.create_house | NEW behavior | 備註可不提供（存空字串） |

### Phase 04 Change Summary（api.yml）
| 操作 | 目標 | 說明 |
|------|------|------|
| modify（route） | `PUT /houses/{houseId}/total-rent` → `PUT /houses/{houseId}` | operationId `updateHouse`，摘要「編輯房屋」 |
| modify（schema） | `UpdateTotalRentRequest` → `UpdateHouseRequest` | `{ totalRent (required), note (optional) }` |
| modify（schema） | `CreateHouseRequest` | required 移除 note |

## IMPL_IMPACT（Phase 04 回填）
| Phase | 影響目標 | Impact Type | 說明 |
|-------|---------|-------------|------|
| 05 | api/houses.py route + HouseService.update_house | ENDPOINT_ROUTE + ENDPOINT_SCHEMA | 取代 total-rent，加入 note |
| 05 | HouseService.create_house | ENDPOINT_SCHEMA | note 選填，未提供存 '' |
| 05 | steps/house/commands/update_total_rent.py | ENDPOINT_ROUTE + SENTENCE_PATTERN | 新句型 + 新路徑 + note |
| 06 | lib/api/house.ts、mocks/handlers/house.ts、EditRentDialog、houses page | ENDPOINT_ROUTE + ENDPOINT_SCHEMA | updateHouse()，備註可編輯 |
| 06 | lib/types/house.schema.ts、AddHouseForm、MSW POST handler | ENDPOINT_SCHEMA | 備註選填 |
| 07 | 編輯 / 新增流程 | — | Phase 05 + 06 有 Targeted Fix → 整合重驗 |
