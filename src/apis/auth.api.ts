import type { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'

const authApi = {
  loginAccount: (body: { username: string; password: string }) => http.post<AuthResponse>('/api/v1/auth/login', body)
}
export default authApi
