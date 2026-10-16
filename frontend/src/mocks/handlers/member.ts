import { http } from 'msw'
import { db } from '../db'
import { MOCK_TOKEN_PREFIX, fail, isMissing, ok } from './respond'

export const memberHandlers = [
  // GET /members — 不需登入，只回傳姓名
  http.get('/api/members', () => ok(db.members.map(({ name }) => ({ name })))),

  // POST /auth/login — 400 必要參數未提供 / 404 查無此成員
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { name?: string }
    if (isMissing(body.name)) return fail('必要參數未提供', 400)
    const member = db.members.find((m) => m.name === body.name)
    if (!member) return fail('查無此成員', 404)
    return ok({ token: `${MOCK_TOKEN_PREFIX}${member.name}`, member })
  }),
]
