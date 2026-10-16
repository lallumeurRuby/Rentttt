'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  castMyVote,
  createHouse,
  deleteHouse,
  listHouses,
  updateHouse,
  updateLandlordStatus,
  updateViewingStatus,
} from '@/lib/api'
import {
  LandlordStatusSchema,
  ViewingStatusSchema,
  type HouseListItem,
  type LandlordStatus,
  type ViewingStatus,
  type VoteChoice,
} from '@/lib/types'
import { useApiFeedback } from '@/lib/useApiFeedback'
import { Toast } from '@/components/Toast'
import { AddHouseForm, type AddHouseValues } from '@/components/domain/AddHouseForm'
import { ConfirmDeleteDialog } from '@/components/domain/ConfirmDeleteDialog'
import { EditHouseDialog } from '@/components/domain/EditHouseDialog'
import { RentSplitCell } from '@/components/domain/RentSplitCell'
import { StatusSelect } from '@/components/domain/StatusSelect'
import { VoteCell } from '@/components/domain/VoteCell'
import styles from '@/components/domain/houseTable.module.css'

export default function HousesPage() {
  const [houses, setHouses] = useState<HouseListItem[] | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [editing, setEditing] = useState<HouseListItem | null>(null)
  const [deleting, setDeleting] = useState<HouseListItem | null>(null)
  const { toast, notify, handleError, closeToast } = useApiFeedback()

  const reload = useCallback(async () => {
    try {
      setHouses(await listHouses())
    } catch (e) {
      handleError(e)
    }
  }, [handleError])

  useEffect(() => {
    reload()
  }, [reload])

  /** 執行一個房屋操作後重新載入列表（投票結果、分租試算皆由後端計算） */
  async function runAction(houseId: number, action: () => Promise<void>, message: string) {
    setBusyId(houseId)
    try {
      await action()
      await reload()
      notify(message)
      return true
    } catch (e) {
      handleError(e)
      return false
    } finally {
      setBusyId(null)
    }
  }

  async function handleCreate(values: AddHouseValues): Promise<boolean> {
    try {
      await createHouse(values)
      await reload()
      notify('已新增房屋')
      return true
    } catch (e) {
      handleError(e)
      return false
    }
  }

  return (
    <div className={styles.section}>
      <AddHouseForm onSubmit={handleCreate} />

      <section className="card" aria-labelledby="houses-title">
        <div className={`${styles.header} ${styles.cardHeader}`}>
          <h1 id="houses-title" className="title-large">
            房屋列表
          </h1>
          <span className="body-medium">依總租金由低到高排序</span>
        </div>

        {houses === null ? (
          <p className={styles.empty}>載入中…</p>
        ) : houses.length === 0 ? (
          <p className={styles.empty} data-testid="houses-empty">
            還沒有任何房屋，從上方新增第一間吧！
          </p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table} data-testid="houses-table">
              <thead>
                <tr>
                  <th>網址</th>
                  <th>總租金</th>
                  <th>備註</th>
                  <th>分租租金試算</th>
                  <th>是否列入考慮</th>
                  <th>房東 / 看房狀態</th>
                  <th>
                    <span className="visually-hidden">操作</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {houses.map((house) => {
                  const busy = busyId === house.id
                  return (
                    <tr key={house.id} data-testid={`house-row-${house.id}`} data-url={house.url}>
                      <td>
                        <a className={styles.url} href={house.url} target="_blank" rel="noreferrer">
                          {house.url}
                        </a>
                      </td>
                      <td className={styles.rent}>{house.totalRent.toLocaleString()}</td>
                      <td className={styles.note}>{house.note || <span className={styles.noteEmpty}>—</span>}</td>
                      <td>
                        <RentSplitCell splits={house.rentSplits} />
                      </td>
                      <td>
                        <VoteCell
                          result={house.voteResult}
                          myVote={house.myVote}
                          disabled={busy}
                          onVote={(choice: VoteChoice) =>
                            runAction(house.id, () => castMyVote(house.id, choice), `已投「${choice}」`)
                          }
                        />
                      </td>
                      <td>
                        <div className={styles.statusCell}>
                          <StatusSelect<LandlordStatus>
                            label="房東狀態"
                            value={house.landlordStatus}
                            options={LandlordStatusSchema.options}
                            disabled={busy}
                            testId="landlord-status"
                            onChange={(status) =>
                              runAction(
                                house.id,
                                () => updateLandlordStatus(house.id, status),
                                `房東狀態已改為「${status}」`
                              )
                            }
                          />
                          <StatusSelect<ViewingStatus>
                            label="看房狀態"
                            value={house.viewingStatus}
                            options={ViewingStatusSchema.options}
                            disabled={busy}
                            testId="viewing-status"
                            onChange={(status) =>
                              runAction(
                                house.id,
                                () => updateViewingStatus(house.id, status),
                                `看房狀態已改為「${status}」`
                              )
                            }
                          />
                        </div>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            type="button"
                            className="btn btn-text btn-icon-text"
                            onClick={() => setEditing(house)}
                            disabled={busy}
                            data-testid="edit-house"
                          >
                            ✎ 編輯
                          </button>
                          <button
                            type="button"
                            className="btn btn-text btn-icon-text"
                            onClick={() => setDeleting(house)}
                            disabled={busy}
                            data-testid="delete-house"
                          >
                            🗑 刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {editing && (
        <EditHouseDialog
          house={editing}
          onClose={() => setEditing(null)}
          onSave={(request) =>
            runAction(editing.id, () => updateHouse(editing.id, request), '已更新房屋')
          }
        />
      )}

      {deleting && (
        <ConfirmDeleteDialog
          url={deleting.url}
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            const deleted = await runAction(deleting.id, () => deleteHouse(deleting.id), '已刪除房屋')
            if (deleted) setDeleting(null)
          }}
        />
      )}

      {toast && <Toast message={toast.message} tone={toast.tone} onClose={closeToast} />}
    </div>
  )
}
