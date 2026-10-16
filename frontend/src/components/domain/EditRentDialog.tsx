'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import type { HouseListItem } from '@/lib/types'
import styles from './domain.module.css'

interface EditRentDialogProps {
  house: HouseListItem
  onSave: (totalRent: number) => Promise<boolean>
  onClose: () => void
}

/** 編輯房屋彈窗：網址（不可編輯）、總租金（可編輯）、備註（不可編輯） */
export function EditRentDialog({ house, onSave, onClose }: EditRentDialogProps) {
  const [totalRent, setTotalRent] = useState(String(house.totalRent))
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
    const saved = await onSave(rent)
    setSaving(false)
    if (saved) onClose()
  }

  return (
    <div className="dialog-scrim" onClick={onClose}>
      <form
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-rent-title"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        noValidate
        data-testid="edit-rent-dialog"
      >
        <h2 id="edit-rent-title" className="headline-small">
          編輯房屋
        </h2>
        <label className="field">
          <span className="field-label">網址（不可編輯）</span>
          <input className="input" value={house.url} readOnly disabled data-testid="edit-url" />
        </label>
        <label className="field">
          <span className="field-label">總租金（元）</span>
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
          <span className="field-label">備註（不可編輯）</span>
          <input className="input" value={house.note} readOnly disabled data-testid="edit-note" />
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
        <span className={styles.hint}>只有總租金可以修改。</span>
      </form>
    </div>
  )
}
