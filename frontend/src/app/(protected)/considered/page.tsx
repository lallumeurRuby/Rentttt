'use client'

import { useCallback, useEffect, useState } from 'react'
import { listConsideredHouses, updateLandlordStatus, updateViewingStatus } from '@/lib/api'
import {
  LandlordStatusSchema,
  ViewingStatusSchema,
  type ConsideredHouse,
  type LandlordStatus,
  type ViewingStatus,
} from '@/lib/types'
import { useApiFeedback } from '@/lib/useApiFeedback'
import { Toast } from '@/components/Toast'
import { RentSplitCell } from '@/components/domain/RentSplitCell'
import { StatusSelect } from '@/components/domain/StatusSelect'
import styles from '@/components/domain/houseTable.module.css'

export default function ConsideredPage() {
  const [houses, setHouses] = useState<ConsideredHouse[] | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)
  const { toast, notify, handleError, closeToast } = useApiFeedback()

  const reload = useCallback(async () => {
    try {
      setHouses(await listConsideredHouses())
    } catch (e) {
      handleError(e)
    }
  }, [handleError])

  useEffect(() => {
    reload()
  }, [reload])

  async function runAction(houseId: number, action: () => Promise<void>, message: string) {
    setBusyId(houseId)
    try {
      await action()
      await reload()
      notify(message)
    } catch (e) {
      handleError(e)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section className="card" aria-labelledby="considered-title">
      <div className={`${styles.header} ${styles.cardHeader}`}>
        <h1 id="considered-title" className="title-large">
          考慮列表
        </h1>
        <span className="body-medium">至少 2 位成員投「是」的房屋，依總租金由低到高排序</span>
      </div>

      {houses === null ? (
        <p className={styles.empty}>載入中…</p>
      ) : houses.length === 0 ? (
        <p className={styles.empty} data-testid="considered-empty">
          目前沒有列入考慮的房屋。到房屋列表投票，2 票「是」就會出現在這裡。
        </p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table} data-testid="considered-table">
            <thead>
              <tr>
                <th>網址</th>
                <th>總租金</th>
                <th>備註</th>
                <th>分租租金試算</th>
                <th>房東狀態</th>
                <th>看房狀態</th>
              </tr>
            </thead>
            <tbody>
              {houses.map((house) => {
                const busy = busyId === house.id
                return (
                  <tr key={house.id} data-testid={`considered-row-${house.id}`} data-url={house.url}>
                    <td>
                      <a className={styles.url} href={house.url} target="_blank" rel="noreferrer">
                        {house.url}
                      </a>
                    </td>
                    <td className={styles.rent}>{house.totalRent.toLocaleString()}</td>
                    <td className={styles.note}>{house.note}</td>
                    <td>
                      <RentSplitCell splits={house.rentSplits} />
                    </td>
                    <td>
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
                    </td>
                    <td>
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
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {toast && <Toast message={toast.message} tone={toast.tone} onClose={closeToast} />}
    </section>
  )
}
