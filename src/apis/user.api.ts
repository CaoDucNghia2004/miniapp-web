import type { User } from 'src/types/user.type'
import type { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const userApi = {
  getUser: () => http.get<SuccessResponse<User>>('/api/v1/auth/profile')
}

export default userApi
