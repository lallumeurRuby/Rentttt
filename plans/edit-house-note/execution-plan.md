# Execution Plan — 備註改為可編輯、非必填

> 來源：Phase 01 Discovery（CHANGE 模式），2026-10-16
> 需求原文：「我現在在編輯物件的時候，備註想要改為可編輯」「備註非必填，順便要幫我修改一下新增的時候備註也是非必填」
> 決策：一個 API 同時處理總租金與備註；總租金必填、備註可留空（新增與編輯皆是），編輯時留空即清空備註

## 概覽
| 類型 | 數量 |
|------|------|
| Create | 0 |
| Modify | 8 |
| Delete | 0 |

## Phase 01: Behavior Design
| 操作 | 目標 | 說明 |
|------|------|------|
| modify（rename） | `house/編輯房屋總租金.feature` → `house/編輯房屋.feature` | Feature 改名「編輯房屋」；「備註應維持不變」改為「備註應更新」；新增備註參數 Rule |
| modify | `specs/activities/找租屋追蹤.mmd` | BRANCH:3a「編輯總租金」→「編輯房屋」，綁定新檔名 |
| modify | `house/新增房屋.feature` | 必要參數改為「網址、總租金」；新增 Rule「未填備註時以空白備註新增」；移除「缺少備註」Example 列 |

## Phase 02: Entity Modeling
| 操作 | 目標 | 說明 |
|------|------|------|
| modify | `houses.note` | 註解改為「可編輯、可留空」；未填備註存空字串（維持 not null，無 migration）— 待 Phase 02 確認 |

## Phase 03: BDD Analysis
| 操作 | 目標 | 說明 |
|------|------|------|
| modify | `house/句型.md` W4 | When 句型由「將房屋 X 的總租金改為：」改為可同時帶總租金與備註的句型 |
| modify | `house/編輯房屋.feature` | 補新 Rule 的 Examples，移除 @ignore |

## Phase 04: API Contract
| 操作 | 目標 | 說明 |
|------|------|------|
| modify | `PUT /houses/{houseId}/total-rent` | 改為同時接收 totalRent（必填）與 note（選填）的編輯 endpoint（路徑待 Phase 04 決定） |
| modify | `POST /houses` CreateHouseRequest | note 由 required 改為選填 |

## Phase 05-07: Implementation
| 操作 | 目標 | 說明 |
|------|------|------|
| targeted fix | 後端 route / HouseService / step def | 依 IMPL_IMPACT 修改 |
| targeted fix | 前端 EditRentDialog / API client / MSW handler | 備註改為可編輯、可留空 |
| targeted fix | 前端 AddHouseForm / MSW handler / 後端 HouseService.create_house | 備註改為非必填 |
| integration | 編輯房屋流程 | real backend 重驗 |

## IMPL_IMPACT（由 Phase 02-04 Reconciler 回填）
| Phase | 影響目標 | Impact Type | 來源 | 說明 |
|-------|---------|-------------|------|------|
| 05 | step_defs/update_total_rent | SENTENCE_PATTERN | Phase 01（預估） | When 句型將改變 |
| 05/06 | PUT total-rent | ENDPOINT_ROUTE / ENDPOINT_SCHEMA | Phase 01（預估） | 待 Phase 04 確認 |
| 05/06 | POST /houses | ENDPOINT_SCHEMA | Phase 01（預估） | note 改選填 |
