'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ApiClientError } from '@/lib/api'
import type { ToastState } from '@/components/Toast'

/** 統一處理 API 錯誤：未登入（401）導回登入頁；其餘以 violation_type 顯示 snackbar。 */
export function useApiFeedback() {
  const router = useRouter()
  const [toast, setToast] = useState<ToastState | null>(null)

  const notify = useCallback((message: string) => setToast({ message, tone: 'info' }), [])

  const handleError = useCallback(
    (error: unknown) => {
      if (error instanceof ApiClientError && error.status === 401) {
        router.replace('/login')
        return
      }
      const message = error instanceof ApiClientError ? error.message : '發生錯誤，請稍後再試'
      setToast({ message, tone: 'error' })
    },
    [router]
  )

  const closeToast = useCallback(() => setToast(null), [])

  return { toast, notify, handleError, closeToast }
}
