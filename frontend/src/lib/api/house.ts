import { apiClient } from './client'
import {
  ConsideredHouseSchema,
  HouseListItemSchema,
  HouseSchema,
  type ConsideredHouse,
  type CreateHouseRequest,
  type House,
  type HouseListItem,
  type UpdateHouseRequest,
  type LandlordStatus,
  type ViewingStatus,
  type VoteChoice,
} from '@/lib/types'

/** GET /houses — 總租金由低到高，相同時新的在前 */
export async function listHouses(): Promise<HouseListItem[]> {
  const data = await apiClient<unknown>('/houses')
  return HouseListItemSchema.array().parse(data)
}

/** POST /houses */
export async function createHouse(request: CreateHouseRequest): Promise<House> {
  const data = await apiClient<unknown>('/houses', {
    method: 'POST',
    body: JSON.stringify(request),
  })
  return HouseSchema.parse(data)
}

/** GET /houses/considered — 只含投票結果為「列入考慮」的房屋 */
export async function listConsideredHouses(): Promise<ConsideredHouse[]> {
  const data = await apiClient<unknown>('/houses/considered')
  return ConsideredHouseSchema.array().parse(data)
}

/** DELETE /houses/{houseId} — 永久刪除，投票一併刪除 */
export async function deleteHouse(houseId: number): Promise<void> {
  await apiClient<unknown>(`/houses/${houseId}`, { method: 'DELETE' })
}

/** PUT /houses/{houseId} — 一次修改總租金與備註（備註空字串即清空） */
export async function updateHouse(houseId: number, request: UpdateHouseRequest): Promise<void> {
  await apiClient<unknown>(`/houses/${houseId}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  })
}

/** PUT /houses/{houseId}/my-vote — 以登入成員身份投票（可改票） */
export async function castMyVote(houseId: number, choice: VoteChoice): Promise<void> {
  await apiClient<unknown>(`/houses/${houseId}/my-vote`, {
    method: 'PUT',
    body: JSON.stringify({ choice }),
  })
}

/** PUT /houses/{houseId}/landlord-status */
export async function updateLandlordStatus(
  houseId: number,
  landlordStatus: LandlordStatus
): Promise<void> {
  await apiClient<unknown>(`/houses/${houseId}/landlord-status`, {
    method: 'PUT',
    body: JSON.stringify({ landlordStatus }),
  })
}

/** PUT /houses/{houseId}/viewing-status */
export async function updateViewingStatus(
  houseId: number,
  viewingStatus: ViewingStatus
): Promise<void> {
  await apiClient<unknown>(`/houses/${houseId}/viewing-status`, {
    method: 'PUT',
    body: JSON.stringify({ viewingStatus }),
  })
}
