import type {
  Contract,
  CreateContractPayload,
  UpdateContractPayload,
  UploadContractFileResponse
} from 'src/types/contract.type'
import type { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const contractsApi = {
  getContractsByProject: (projectId: number) =>
    http.get<SuccessResponse<Contract[]>>(`/api/v1/contracts/project/${projectId}`),

  getContractsByEmail: (email: string) =>
    http.get<SuccessResponse<Contract[]>>(`/api/v1/contracts/email`, { params: { email } }),

  createContract: (body: CreateContractPayload) => http.post<SuccessResponse<Contract>>('/api/v1/contracts', body),

  updateContract: (body: UpdateContractPayload) => http.put<SuccessResponse<Contract>>('/api/v1/contracts', body),

  deleteContract: (id: number) => http.delete<SuccessResponse<null>>(`/api/v1/contracts/${id}`),

  uploadFile: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return http.post<SuccessResponse<UploadContractFileResponse>>('/api/v1/files/contracts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }

  // uploadFile: (formData: FormData) => {
  //   return http.post<UploadContractFileResponse>('/api/v1/files/contracts', formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   })
  // }
}

export default contractsApi
