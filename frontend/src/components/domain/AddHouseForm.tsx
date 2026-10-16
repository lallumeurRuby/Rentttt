'use client'

import { FormEvent, useState } from 'react'
import styles from './domain.module.css'

export interface AddHouseValues {
  url: string
  totalRent: number
  /** 選填；留空時不送出（後端存空白） */
  note?: string
}

interface AddHouseFormProps {
  onSubmit: (values: AddHouseValues) => Promise<boolean>
}

/** 新增房屋：網址、總租金、備註皆必填；總租金須為正整數。其餘規則（網址重複）由後端回應。 */
export function AddHouseForm({ onSubmit }: AddHouseFormProps) {
  const [url, setUrl] = useState('')
  const [totalRent, setTotalRent] = useState('')
  const [note, setNote] = useState('')
  const [rentError, setRentError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isComplete = url.trim() !== '' && totalRent.trim() !== ''

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const rent = Number(totalRent)
    if (!Number.isInteger(rent) || rent <= 0) {
      setRentError('總租金必須為正整數')
      return
    }
    setRentError(null)
    setSubmitting(true)
    const trimmedNote = note.trim()
    const created = await onSubmit({
      url: url.trim(),
      totalRent: rent,
      ...(trimmedNote ? { note: trimmedNote } : {}),
    })
    setSubmitting(false)
    if (created) {
      setUrl('')
      setTotalRent('')
      setNote('')
    }
  }

  return (
    <form
      className={`card ${styles.addForm}`}
      onSubmit={handleSubmit}
      noValidate
      data-testid="add-house-form"
    >
      <h2 className="title-medium">新增房屋</h2>
      <div className={styles.addFields}>
        <label className={`field ${styles.urlField}`}>
          <span className="field-label">網址 *</span>
          <input
            className="input"
            type="text"
            inputMode="url"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            data-testid="add-url"
          />
        </label>
        <label className={`field ${styles.rentField}`}>
          <span className="field-label">總租金（元）*</span>
          <input
            className="input"
            type="number"
            min={1}
            step={1}
            value={totalRent}
            onChange={(e) => setTotalRent(e.target.value)}
            aria-invalid={rentError !== null}
            aria-describedby={rentError ? 'add-rent-error' : undefined}
            data-testid="add-total-rent"
          />
          {rentError && (
            <span id="add-rent-error" className="field-error">
              {rentError}
            </span>
          )}
        </label>
        <label className={`field ${styles.noteField}`}>
          <span className="field-label">備註</span>
          <textarea
            className="input"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="可留空，可換行"
            data-testid="add-note"
          />
        </label>
        <button
          type="submit"
          className={`btn btn-filled ${styles.addButton}`}
          disabled={!isComplete || submitting}
          data-testid="add-submit"
        >
          {submitting ? '新增中…' : '＋ 新增'}
        </button>
      </div>
      <p className="body-medium">網址新增後不可修改；總租金與備註之後可在編輯中修改，備註可留空。</p>
    </form>
  )
}
