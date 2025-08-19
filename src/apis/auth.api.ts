import type { AuthResponse } from 'src/types/auth.type'
import type { User } from 'src/types/user.type'
import type { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

type requestForgotPasswordResType = {
  status: number
  message: string
  data: string
}

const authApi = {
  loginAccount: (body: { email: string; password: string }) => http.post<AuthResponse>('/api/v1/auth/login', body),
  resendCode: (body: { email: string }) => http.post<SuccessResponse<null>>('/api/v1/auth/resend-code', body),
  checkCode: (body: { email: string; code: string }) => http.post<AuthResponse>('/api/v1/auth/check-code', body),
  requestForgotPassword: (body: { email: string }) =>
    http.post<requestForgotPasswordResType>('/api/v1/auth/resend-code', body),
  forgotPassword: (body: { email: string; code: string; password: string }) =>
    http.post<SuccessResponse<User>>('/api/v1/auth/forgot-password', body)
}

export default authApi
