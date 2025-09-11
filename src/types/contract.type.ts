export type Contract = {
  id: number
  contractNumber: string
  signedDate?: string | null
  totalAmount: number
  contractFile: string
  projectId: number
  createdAt: string
  updatedAt?: string | null
}

export type CreateContractPayload = {
  contractNumber: string
  signedDate?: string | null
  totalAmount: number
  contractFile: string
  projectId: number
}

export type UpdateContractPayload = {
  id: number
  contractNumber: string
  signedDate?: string | null
  totalAmount: number
  contractFile: string
  projectId: number
}

export type UploadContractFileResponse = {
  fileName: string
  fileUrl: string
  uploadedAt: string
}
