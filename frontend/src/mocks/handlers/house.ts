import { http } from 'msw'
import { LandlordStatusSchema, ViewingStatusSchema, VoteChoiceSchema } from '@/lib/types'
import { consideredHouses, db, houseListItems } from '../db'
import { fail, isMissing, ok, viewerOf } from './respond'

type Body = Record<string, unknown>

async function readBody(request: Request): Promise<Body> {
  return (await request.json().catch(() => ({}))) as Body
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
}

function findHouse(houseId: string | readonly string[] | undefined) {
  return db.houses.find((h) => h.id === Number(houseId))
}

export const houseHandlers = [
  // GET /houses — 401
  http.get('/api/houses', ({ request }) => {
    const viewer = viewerOf(request)
    if (!viewer) return fail('請先登入', 401)
    return ok(houseListItems(viewer))
  }),

  // GET /houses/considered — 401
  http.get('/api/houses/considered', ({ request }) => {
    const viewer = viewerOf(request)
    if (!viewer) return fail('請先登入', 401)
    return ok(consideredHouses(viewer))
  }),

  // POST /houses — 401 / 400 必要參數未提供・總租金必須為正整數 / 422 網址已存在
  http.post('/api/houses', async ({ request }) => {
    if (!viewerOf(request)) return fail('請先登入', 401)
    const { url, totalRent, note } = await readBody(request)
    if ([url, totalRent, note].some(isMissing)) return fail('必要參數未提供', 400)
    if (!isPositiveInteger(totalRent)) return fail('總租金必須為正整數', 400)
    if (db.houses.some((h) => h.url === url)) return fail('網址已存在', 422)
    const house = {
      id: db.nextHouseId++,
      url: String(url),
      totalRent,
      note: String(note),
      landlordStatus: '待聯絡' as const,
      viewingStatus: '未開始' as const,
      createdAt: new Date().toISOString(),
    }
    db.houses.push(house)
    return ok(house, 201)
  }),

  // DELETE /houses/{houseId} — 401 / 404
  http.delete('/api/houses/:houseId', ({ request, params }) => {
    if (!viewerOf(request)) return fail('請先登入', 401)
    const house = findHouse(params.houseId)
    if (!house) return fail('房屋不存在', 404)
    db.houses = db.houses.filter((h) => h.id !== house.id)
    db.votes = db.votes.filter((v) => v.houseId !== house.id)
    return ok()
  }),

  // PUT /houses/{houseId}/total-rent — 401 / 404 / 400
  http.put('/api/houses/:houseId/total-rent', async ({ request, params }) => {
    if (!viewerOf(request)) return fail('請先登入', 401)
    const house = findHouse(params.houseId)
    if (!house) return fail('房屋不存在', 404)
    const { totalRent } = await readBody(request)
    if (isMissing(totalRent)) return fail('必要參數未提供', 400)
    if (!isPositiveInteger(totalRent)) return fail('總租金必須為正整數', 400)
    house.totalRent = totalRent
    return ok()
  }),

  // PUT /houses/{houseId}/my-vote — 401 / 404 / 400 必要參數未提供・投票選項不合法
  http.put('/api/houses/:houseId/my-vote', async ({ request, params }) => {
    const viewer = viewerOf(request)
    if (!viewer) return fail('請先登入', 401)
    const house = findHouse(params.houseId)
    if (!house) return fail('房屋不存在', 404)
    const { choice } = await readBody(request)
    if (isMissing(choice)) return fail('必要參數未提供', 400)
    const parsed = VoteChoiceSchema.safeParse(choice)
    if (!parsed.success) return fail('投票選項不合法', 400)
    db.votes = db.votes.filter((v) => !(v.houseId === house.id && v.memberName === viewer))
    db.votes.push({ houseId: house.id, memberName: viewer, choice: parsed.data })
    return ok()
  }),

  // PUT /houses/{houseId}/landlord-status — 401 / 404 / 400 必要參數未提供・狀態不合法
  http.put('/api/houses/:houseId/landlord-status', async ({ request, params }) => {
    if (!viewerOf(request)) return fail('請先登入', 401)
    const house = findHouse(params.houseId)
    if (!house) return fail('房屋不存在', 404)
    const { landlordStatus } = await readBody(request)
    if (isMissing(landlordStatus)) return fail('必要參數未提供', 400)
    const parsed = LandlordStatusSchema.safeParse(landlordStatus)
    if (!parsed.success) return fail('狀態不合法', 400)
    house.landlordStatus = parsed.data
    return ok()
  }),

  // PUT /houses/{houseId}/viewing-status — 401 / 404 / 400 必要參數未提供・狀態不合法
  http.put('/api/houses/:houseId/viewing-status', async ({ request, params }) => {
    if (!viewerOf(request)) return fail('請先登入', 401)
    const house = findHouse(params.houseId)
    if (!house) return fail('房屋不存在', 404)
    const { viewingStatus } = await readBody(request)
    if (isMissing(viewingStatus)) return fail('必要參數未提供', 400)
    const parsed = ViewingStatusSchema.safeParse(viewingStatus)
    if (!parsed.success) return fail('狀態不合法', 400)
    house.viewingStatus = parsed.data
    return ok()
  }),
]
