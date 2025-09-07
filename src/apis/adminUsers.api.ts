import type { User } from 'src/types/user.type'
import type { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const adminUsersApi = {
  getAllUsers: () => http.get<SuccessResponse<User[]>>('/api/v1/user/getAll'),
  createUser: (body: { email: string; password: string; name?: string; phone?: string; companyName?: string }) =>
    http.post<SuccessResponse<User>>('/api/v1/user', body)
}

export default adminUsersApi
