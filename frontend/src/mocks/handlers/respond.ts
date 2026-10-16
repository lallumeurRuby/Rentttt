import { HttpResponse } from 'msw'
import type { ViolationType } from '@/lib/types'

export const MOCK_TOKEN_PREFIX = 'mock-token-'

export function ok(data?: unknown, status = 200) {
  return HttpResponse.json(data === undefined ? { success: true } : { success: true, data }, { status })
}

export function fail(violationType: ViolationType, status: number) {
  return HttpResponse.json({ success: false, error: { violation_type: violationType } }, { status })
}

/** 從 Bearer token 取出登入成員姓名（mock token = mock-token-{name}）；未登入回傳 null */
export function viewerOf(request: Request): string | null {
  const auth = request.headers.get('Authorization') ?? ''
  const token = auth.replace(/^Bearer\s+/, '')
  return token.startsWith(MOCK_TOKEN_PREFIX) ? token.slice(MOCK_TOKEN_PREFIX.length) : null
}

export function isMissing(value: unknown): boolean {
  return value === undefined || value === null || value === ''
}
