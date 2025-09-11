import axios, { AxiosError } from 'axios'
import config from 'src/constants/config'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import userImage from 'src/assets/images/avatar/customer1.jpg'
import type { ProjectPhaseStatus } from 'src/types/projectPhase.type'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export const getAvatarUrl = (avatarName?: string) => (avatarName ? `${config.baseUrl}${avatarName}` : userImage)
export const getContractUrl = (filePath?: string) => (filePath ? `${config.baseUrl}${filePath}` : '')

export type ProjectStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export const getProjectStatusLabel = (status: ProjectStatus) => {
  switch (status) {
    case 'PENDING':
      return 'Đang chờ'
    case 'IN_PROGRESS':
      return 'Đang thực hiện'
    case 'COMPLETED':
      return 'Hoàn thành'
    case 'CANCELLED':
      return 'Đã hủy'
    default:
      return status
  }
}

export const getProjectPhaseStatusLabel = (status: ProjectPhaseStatus) => {
  switch (status) {
    case 'PENDING':
      return 'Chưa bắt đầu'
    case 'IN_PROGRESS':
      return 'Đang thực hiện'
    case 'COMPLETED':
      return 'Hoàn thành'
    default:
      return status
  }
}
