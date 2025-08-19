import type { AuthResponse } from 'src/types/auth.type'
import type { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const authApi = {
  loginAccount: (body: { email: string; password: string }) => http.post<AuthResponse>('/api/v1/auth/login', body),
  resendCode: (body: { email: string }) => http.post<SuccessResponse<null>>('/api/v1/auth/resend-code', body),
  checkCode: (body: { email: string; code: string }) => http.post<AuthResponse>('/api/v1/auth/check-code', body)
}

export default authApi
