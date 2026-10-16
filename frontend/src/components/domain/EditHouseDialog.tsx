'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import type { HouseListItem, UpdateHouseRequest } from '@/lib/types'
import styles from './domain.module.css'

interface EditHouseDialogProps {
  house: HouseListItem
  onSave: (request: UpdateHouseRequest) => Promise<boolean>
  onClose: () => void
}

/** 編輯房屋彈窗：網址（不可編輯）、總租金（必填）、備註（可留空，留空即清空），一次儲存 */
export function EditHouseDialog({ house, onSave, onClose }: EditHouseDialogProps) {
  const [totalRent, setTotalRent] = useState(String(house.totalRent))
  const [note, setNote] = useState(house.note)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const rent = Number(totalRent)
    if (totalRent.trim() === '' || !Number.isInteger(rent) || rent <= 0) {
      setError('總租金必須為正整數')
      return
    }
    setSaving(true)
    const saved = await onSave({ totalRent: rent, note: note.trim() })
    setSaving(false)
    if (saved) onClose()
  }

  return (
    <div className="dialog-scrim" onClick={onClose}>
      <form
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-house-title"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        noValidate
        data-testid="edit-house-dialog"
      >
        <h2 id="edit-house-title" className="headline-small">
          編輯房屋
        </h2>
        <label className="field">
          <span className="field-label">網址（不可編輯）</span>
          <input className="input" value={house.url} readOnly disabled data-testid="edit-url" />
        </label>
        <label className="field">
          <span className="field-label">總租金（元）*</span>
          <input
            ref={inputRef}
            className="input"
            type="number"
            min={1}
            step={1}
            value={totalRent}
            onChange={(e) => setTotalRent(e.target.value)}
            aria-invalid={error !== null}
            data-testid="edit-total-rent"
          />
          {error && <span className="field-error">{error}</span>}
        </label>
        <label className="field">
          <span className="field-label">備註</span>
          <textarea
            className="input"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="可留空，可換行"
            data-testid="edit-note"
          />
        </label>
        <div className="dialog-actions">
          <button type="button" className="btn btn-text" onClick={onClose}>
            取消
          </button>
          <button
            type="submit"
            className="btn btn-filled"
            disabled={saving}
            data-testid="edit-save"
          >
            {saving ? '儲存中…' : '儲存'}
          </button>
        </div>
        <span className={styles.hint}>網址不可修改；備註留空會清除原本的備註。</span>
      </form>
    </div>
  )
}
