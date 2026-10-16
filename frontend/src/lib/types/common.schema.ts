import { z } from 'zod'

// api.yml components/schemas — enum 值與 erm.dbml / 後端一致（中文）

export const LandlordStatusSchema = z.enum(['待聯絡', '聯絡中', '已回覆'])
export type LandlordStatus = z.infer<typeof LandlordStatusSchema>

export const ViewingStatusSchema = z.enum(['未開始', '待開始', '進行中', '已結束'])
export type ViewingStatus = z.infer<typeof ViewingStatusSchema>

export const VoteChoiceSchema = z.enum(['是', '否'])
export type VoteChoice = z.infer<typeof VoteChoiceSchema>

/** ≥2 票是 → 列入考慮；≥2 票否 → 不考慮；其餘 → 投票中 */
export const VoteResultSchema = z.enum(['列入考慮', '不考慮', '投票中'])
export type VoteResult = z.infer<typeof VoteResultSchema>

export const ViolationTypeSchema = z.enum([
  '請先登入',
  '查無此成員',
  '房屋不存在',
  '必要參數未提供',
  '總租金必須為正整數',
  '網址已存在',
  '狀態不合法',
  '投票選項不合法',
])
export type ViolationType = z.infer<typeof ViolationTypeSchema>

export const ErrorSchema = z.object({ violation_type: ViolationTypeSchema })
export type ApiErrorBody = z.infer<typeof ErrorSchema>
