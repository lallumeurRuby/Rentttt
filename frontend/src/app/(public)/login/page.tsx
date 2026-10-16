'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ApiClientError, listMembers, login } from '@/lib/api'
import type { MemberName } from '@/lib/types'
import { saveSession } from '@/lib/session'
import styles from './page.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [members, setMembers] = useState<MemberName[] | null>(null)
  const [pendingName, setPendingName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listMembers()
      .then(setMembers)
      .catch(() => setError('無法取得成員列表，請稍後再試'))
  }, [])

  async function handleLogin(name: string) {
    setPendingName(name)
    setError(null)
    try {
      const { token, member } = await login(name)
      saveSession(token, member)
      router.push('/houses')
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : '登入失敗，請稍後再試')
      setPendingName(null)
    }
  }

  return (
    <main className={styles.page}>
      <section className={`card ${styles.panel}`} aria-labelledby="login-title">
        <div className={styles.hero} aria-hidden>
          🏡
        </div>
        <h1 id="login-title" className="headline-small">
          一起找房子
        </h1>
        <p className="body-medium">選擇你是誰，開始追蹤每間房屋的進度。</p>

        {members === null && !error && <p className="body-medium">載入成員中…</p>}

        {members && (
          <ul className={styles.members} data-testid="member-list">
            {members.map(({ name }) => (
              <li key={name}>
                <button
                  type="button"
                  className={`btn btn-tonal ${styles.memberButton}`}
                  onClick={() => handleLogin(name)}
                  disabled={pendingName !== null}
                  data-testid={`login-${name}`}
                >
                  <span className={styles.avatar} aria-hidden>
                    {name.slice(0, 1).toUpperCase()}
                  </span>
                  {pendingName === name ? '登入中…' : name}
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && (
          <p className="field-error" role="alert" data-testid="login-error">
            {error}
          </p>
        )}
      </section>
    </main>
  )
}
