'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'
import { hasSession } from '@/lib/session'
import styles from './layout.module.css'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // 除查詢成員列表與登入外，所有操作皆需先登入（Q7）
    if (hasSession()) setAuthorized(true)
    else router.replace('/login')
  }, [router])

  if (!authorized) return null

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <TopBar />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  )
}
