import type { User } from './user.type'
import type { SuccessResponse } from './utils.type'

export type AuthResponse = SuccessResponse<{
  accessToken: string
  user: User
}>
