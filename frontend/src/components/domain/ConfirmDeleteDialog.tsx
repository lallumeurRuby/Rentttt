'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './domain.module.css'

interface ConfirmDeleteDialogProps {
  url: string
  onConfirm: () => Promise<void>
  onClose: () => void
}

/** 刪除為永久刪除，投票一併刪除，無法復原 */
export function ConfirmDeleteDialog({ url, onConfirm, onClose }: ConfirmDeleteDialogProps) {
  const [deleting, setDeleting] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    cancelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleConfirm() {
    setDeleting(true)
    await onConfirm()
    setDeleting(false)
  }

  return (
    <div className="dialog-scrim" onClick={onClose}>
      <div
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-desc"
        onClick={(e) => e.stopPropagation()}
        data-testid="confirm-delete-dialog"
      >
        <h2 id="delete-title" className="headline-small">
          刪除這間房屋？
        </h2>
        <p id="delete-desc" className="body-medium">
          <span className={styles.breakAll}>{url}</span>
          <br />
          刪除後無法復原，這間房屋的所有投票也會一併刪除。
        </p>
        <div className="dialog-actions">
          <button ref={cancelRef} type="button" className="btn btn-text" onClick={onClose}>
            取消
          </button>
          <button
            type="button"
            className="btn btn-error"
            onClick={handleConfirm}
            disabled={deleting}
            data-testid="confirm-delete"
          >
            {deleting ? '刪除中…' : '刪除'}
          </button>
        </div>
      </div>
    </div>
  )
}
