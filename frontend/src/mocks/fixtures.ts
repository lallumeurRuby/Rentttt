import type { House, Member, VoteChoice } from '@/lib/types'

/**
 * 資料來源：backend/tests/features/**\/*.feature 的 Given 步驟。
 * - 成員：所有 feature Background「系統中有以下成員」
 * - 房屋 a / b / c / d 與投票：查詢考慮列表.feature「只回傳 2 是與 2 是 1 否的房屋」
 * - a 的房東／看房狀態：查詢房屋列表.feature「房屋包含網址、總租金、備註、房東狀態、看房狀態」
 * - 新增時間：查詢房屋列表.feature「總租金相同時較晚新增的房屋排在前面」（a = 10-01、b = 10-02）
 */

export const mockMembers: Member[] = [
  { name: 'ruby', maxBudget: 12000, rentWeight: 12 },
  { name: 'joyce', maxBudget: 10000, rentWeight: 10 },
  { name: 'cya', maxBudget: 11000, rentWeight: 11 },
]

export const mockHouses: House[] = [
  {
    id: 1,
    url: 'https://rent.example/a',
    totalRent: 33000,
    note: '近捷運',
    landlordStatus: '聯絡中',
    viewingStatus: '待開始',
    createdAt: '2026-10-01T10:00:00',
  },
  {
    id: 2,
    url: 'https://rent.example/b',
    totalRent: 31000,
    note: '有陽台',
    landlordStatus: '待聯絡',
    viewingStatus: '未開始',
    createdAt: '2026-10-02T10:00:00',
  },
  {
    id: 3,
    url: 'https://rent.example/c',
    totalRent: 32000,
    note: '近公園',
    landlordStatus: '待聯絡',
    viewingStatus: '未開始',
    createdAt: '2026-10-02T10:00:00',
  },
  {
    id: 4,
    url: 'https://rent.example/d',
    totalRent: 30000,
    note: '有車位',
    landlordStatus: '待聯絡',
    viewingStatus: '未開始',
    createdAt: '2026-10-02T10:00:00',
  },
]

export interface MockVote {
  houseId: number
  memberName: string
  choice: VoteChoice
}

/** a：2 是（列入考慮）；b：2 否（不考慮）；c：1 是（投票中）；d：2 是 1 否（列入考慮） */
export const mockVotes: MockVote[] = [
  { houseId: 1, memberName: 'ruby', choice: '是' },
  { houseId: 1, memberName: 'joyce', choice: '是' },
  { houseId: 2, memberName: 'ruby', choice: '否' },
  { houseId: 2, memberName: 'cya', choice: '否' },
  { houseId: 3, memberName: 'joyce', choice: '是' },
  { houseId: 4, memberName: 'ruby', choice: '是' },
  { houseId: 4, memberName: 'joyce', choice: '否' },
  { houseId: 4, memberName: 'cya', choice: '是' },
]
