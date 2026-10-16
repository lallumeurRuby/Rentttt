import type { ConsideredHouse, House, HouseListItem, Member, RentSplit, VoteResult } from '@/lib/types'
import { mockHouses, mockMembers, mockVotes, type MockVote } from './fixtures'

/**
 * MSW 的記憶體資料庫：以 fixtures 為初始值，讓 mock 模式可完整操作（新增 / 投票 / 刪除…）。
 * 衍生值（分租試算、投票結果）依 feature 規則計算，與後端一致。
 */
export const db = {
  members: mockMembers,
  houses: mockHouses.map((house) => ({ ...house })),
  votes: mockVotes.map((vote) => ({ ...vote })),
  nextHouseId: Math.max(...mockHouses.map((house) => house.id)) + 1,
}

const CONSIDER_THRESHOLD = 2

export function splitRent(totalRent: number, members: Member[]): RentSplit[] {
  const totalWeight = members.reduce((sum, m) => sum + m.rentWeight, 0)
  const amounts = new Map(
    members.map((m) => [m.name, Math.floor((2 * totalRent * m.rentWeight + totalWeight) / (2 * totalWeight))])
  )
  const heaviest = members.reduce((a, b) => (b.rentWeight > a.rentWeight ? b : a))
  const diff = totalRent - Array.from(amounts.values()).reduce((sum, v) => sum + v, 0)
  amounts.set(heaviest.name, amounts.get(heaviest.name)! + diff)
  return members.map((m) => {
    const amount = amounts.get(m.name)!
    return { memberName: m.name, amount, overBudget: amount > m.maxBudget }
  })
}

export function voteResultOf(votes: MockVote[]): VoteResult {
  if (votes.filter((v) => v.choice === '是').length >= CONSIDER_THRESHOLD) return '列入考慮'
  if (votes.filter((v) => v.choice === '否').length >= CONSIDER_THRESHOLD) return '不考慮'
  return '投票中'
}

/** 總租金由低到高，相同時新增時間新的在前 */
function sortedHouses(): House[] {
  return [...db.houses].sort(
    (a, b) => a.totalRent - b.totalRent || b.createdAt.localeCompare(a.createdAt) || b.id - a.id
  )
}

export function houseListItems(viewer: string): HouseListItem[] {
  return sortedHouses().map((house) => {
    const votes = db.votes.filter((v) => v.houseId === house.id)
    return {
      ...house,
      rentSplits: splitRent(house.totalRent, db.members),
      voteResult: voteResultOf(votes),
      myVote: votes.find((v) => v.memberName === viewer)?.choice ?? null,
    }
  })
}

export function consideredHouses(viewer: string): ConsideredHouse[] {
  return houseListItems(viewer)
    .filter((item) => item.voteResult === '列入考慮')
    .map(({ voteResult: _voteResult, myVote: _myVote, ...house }) => house)
}
