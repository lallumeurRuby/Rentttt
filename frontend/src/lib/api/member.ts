import { apiClient } from './client'
import {
  LoginResultSchema,
  MemberNameSchema,
  type LoginResult,
  type MemberName,
} from '@/lib/types'

/** GET /members — 登入頁用，不需登入，只回傳姓名 */
export async function listMembers(): Promise<MemberName[]> {
  const data = await apiClient<unknown>('/members')
  return MemberNameSchema.array().parse(data)
}

/** POST /auth/login — 以姓名登入（精確比對），回傳 JWT 與成員資料 */
export async function login(name: string): Promise<LoginResult> {
  const data = await apiClient<unknown>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  return LoginResultSchema.parse(data)
}
