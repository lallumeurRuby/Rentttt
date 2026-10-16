import type { RequestHandler } from 'msw'
// Worker adds per-resource handler imports here:
import { houseHandlers } from './house'
import { memberHandlers } from './member'

export const handlers: RequestHandler[] = [
  // Worker adds handler spreads here:
  ...memberHandlers,
  ...houseHandlers,
]
