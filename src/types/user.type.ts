export interface User {
  id: number
  email: string
  name: string
  phone?: string
  companyName?: string
  avatar?: string
}

export interface uploadAvatarResType {
  fileName: string
  fileUrl: string
  uploadedAt: string
}
