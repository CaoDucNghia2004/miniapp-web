import type { uploadAvatarResType, User } from 'src/types/user.type'
import type { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'
import type { Schema } from 'src/utils/rules'

type BodyUpdateProfile = Pick<Schema, 'name' | 'phone' | 'companyName' | 'avatar'>
type BodyUpdateProfileResType = {
  id: number
  email: string
  name: string
  phone: string
  companyName: string
  avatar: string
}

const userApi = {
  getUser: () => http.get<SuccessResponse<User>>('/api/v1/auth/profile'),
  updateProfile(body: BodyUpdateProfile) {
    return http.put<SuccessResponse<BodyUpdateProfileResType>>('/api/v1/user', body)
  },
  // uploadAvatar(body: FormData) {
  //   return http.post<SuccessResponse<uploadAvatarResType>>('/api/v1/files', body, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   })
  // }
  uploadAvatar({ body, folder }: { body: FormData; folder: string }) {
    return http.post<SuccessResponse<uploadAvatarResType>>(`/api/v1/files?folder=${folder}`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  changePassword(body: { oldPassword: string; newPassword: string }) {
    return http.post<SuccessResponse<User>>('/api/v1/user/change-password', body)
  }
}

export default userApi
