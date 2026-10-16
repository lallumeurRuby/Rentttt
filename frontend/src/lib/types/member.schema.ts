import { z } from 'zod'

export const MemberNameSchema = z.object({ name: z.string() })
export type MemberName = z.infer<typeof MemberNameSchema>

export const MemberSchema = z.object({
  name: z.string(),
  /** 個人最高預算（元） */
  maxBudget: z.number().int(),
  /** 分租權重（12 / 10 / 11，總和 33） */
  rentWeight: z.number().int(),
})
export type Member = z.infer<typeof MemberSchema>

export const LoginRequestSchema = z.object({ name: z.string() })
export type LoginRequest = z.infer<typeof LoginRequestSchema>

export const LoginResultSchema = z.object({
  token: z.string(),
  member: MemberSchema,
})
export type LoginResult = z.infer<typeof LoginResultSchema>
