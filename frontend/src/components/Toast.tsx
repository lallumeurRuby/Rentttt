'use client'

import { useEffect } from 'react'
import styles from './Toast.module.css'

interface ToastProps {
  message: string
  onClose: () => void
  duration?: number
  tone?: 'info' | 'error'
}

/**
 * Snackbar（M3）。頁面以 useState 管理：
 *   const [toast, setToast] = useState<ToastState | null>(null)
 */
export function Toast({ message, onClose, duration = 4000, tone = 'info' }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div
      data-testid="toast"
      role={tone === 'error' ? 'alert' : 'status'}
      className={`${styles.snackbar} ${tone === 'error' ? styles.error : ''}`}
    >
      {message}
    </div>
  )
}

export interface ToastState {
  message: string
  tone: 'info' | 'error'
}
