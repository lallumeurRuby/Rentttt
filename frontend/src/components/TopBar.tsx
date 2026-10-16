'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Member } from '@/lib/types'
import { sessionMember } from '@/lib/session'
import styles from './TopBar.module.css'

/** 顯示目前登入成員與其預算；不提供登出（Q11），可回登入頁切換成員。 */
export function TopBar() {
  const [member, setMember] = useState<Member | null>(null)

  useEffect(() => setMember(sessionMember()), [])

  return (
    <header data-testid="topbar" className={styles.bar}>
      <span className="title-large">一起找房子</span>
      {member && (
        <div className={styles.user}>
          <span className={styles.avatar} aria-hidden>
            {member.name.slice(0, 1).toUpperCase()}
          </span>
          <span data-testid="current-member">
            <strong>{member.name}</strong>
            <span className={styles.budget}>預算 {member.maxBudget.toLocaleString()} 元</span>
          </span>
          <Link href="/login" className="btn btn-text" data-testid="switch-member">
            切換成員
          </Link>
        </div>
      )}
    </header>
  )
}
