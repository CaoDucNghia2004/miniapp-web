import type { Project } from 'src/types/projects.type'
import type { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const projectsApi = {
  getAllProjects: () => http.get<SuccessResponse<Project[]>>('/api/v1/projects/getAll'),
  createProject: (body: {
    name: string
    description: string
    startDate: string
    endDate: string
    fieldId: number
    userId: number
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  }) => http.post<SuccessResponse<Project>>('/api/v1/projects', body),
  updateProject: (body: {
    id: number
    name: string
    description: string
    startDate: string
    endDate: string
    fieldId: number
    userId: number
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  }) => http.put<SuccessResponse<Project>>('/api/v1/projects', body),
  getProjectsByEmail: () => http.get<SuccessResponse<Project[]>>('/api/v1/projects')
}
export default projectsApi
