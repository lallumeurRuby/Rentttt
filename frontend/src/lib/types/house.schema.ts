import { z } from 'zod'
import {
  LandlordStatusSchema,
  ViewingStatusSchema,
  VoteChoiceSchema,
  VoteResultSchema,
} from './common.schema'

export const HouseSchema = z.object({
  id: z.number().int(),
  url: z.string(),
  totalRent: z.number().int(),
  note: z.string(),
  landlordStatus: LandlordStatusSchema,
  viewingStatus: ViewingStatusSchema,
  createdAt: z.string(),
})
export type House = z.infer<typeof HouseSchema>

export const RentSplitSchema = z.object({
  memberName: z.string(),
  /** round(totalRent × rentWeight ÷ 33)，差額由權重最高者吸收 */
  amount: z.number().int(),
  /** amount > maxBudget（等於不算超出） */
  overBudget: z.boolean(),
})
export type RentSplit = z.infer<typeof RentSplitSchema>

export const ConsideredHouseSchema = HouseSchema.extend({
  rentSplits: z.array(RentSplitSchema),
})
export type ConsideredHouse = z.infer<typeof ConsideredHouseSchema>

export const HouseListItemSchema = ConsideredHouseSchema.extend({
  voteResult: VoteResultSchema,
  /** 登入成員自己的投票；未投票為 null。不含他人投票與票數 */
  myVote: VoteChoiceSchema.nullable(),
})
export type HouseListItem = z.infer<typeof HouseListItemSchema>

export const CreateHouseRequestSchema = z.object({
  url: z.string(),
  totalRent: z.number().int().min(1),
  /** 選填；未提供時存為空字串 */
  note: z.string().optional(),
})
export type CreateHouseRequest = z.infer<typeof CreateHouseRequestSchema>

export const UpdateHouseRequestSchema = z.object({
  totalRent: z.number().int().min(1),
  /** 選填；未提供或空字串即清空備註 */
  note: z.string().optional(),
})
export type UpdateHouseRequest = z.infer<typeof UpdateHouseRequestSchema>

export const CastVoteRequestSchema = z.object({ choice: VoteChoiceSchema })
export type CastVoteRequest = z.infer<typeof CastVoteRequestSchema>

export const UpdateLandlordStatusRequestSchema = z.object({ landlordStatus: LandlordStatusSchema })
export type UpdateLandlordStatusRequest = z.infer<typeof UpdateLandlordStatusRequestSchema>

export const UpdateViewingStatusRequestSchema = z.object({ viewingStatus: ViewingStatusSchema })
export type UpdateViewingStatusRequest = z.infer<typeof UpdateViewingStatusRequestSchema>
