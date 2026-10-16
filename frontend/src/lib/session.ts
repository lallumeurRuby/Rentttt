import type { Member } from '@/lib/types'

const TOKEN_COOKIE = 'rentttt-auth-token'
const MEMBER_KEY = 'rentttt-member'

/** 登入後保存憑證（client.ts 從 cookie 讀取 rentttt-auth-token）與成員資料。Q11：不提供登出，切換成員可重新登入。 */
export function saveSession(token: string, member: Member): void {
  document.cookie = `${TOKEN_COOKIE}=${token}; path=/; SameSite=Lax`
  try {
    localStorage.setItem(MEMBER_KEY, JSON.stringify(member))
  } catch {
    // 無法使用 localStorage 時仍可運作，只是 TopBar 不顯示成員名稱
  }
}

export function hasSession(): boolean {
  return new RegExp(`(?:^|;\\s*)${TOKEN_COOKIE}=[^;]+`).test(document.cookie)
}

export function sessionMember(): Member | null {
  try {
    const raw = localStorage.getItem(MEMBER_KEY)
    return raw ? (JSON.parse(raw) as Member) : null
  } catch {
    return null
  }
}
