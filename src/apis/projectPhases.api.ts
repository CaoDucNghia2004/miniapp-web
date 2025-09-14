import type { CreateProjectPhaseBody, ProjectPhase, UpdateProjectPhaseBody } from 'src/types/projectPhase.type'
import type { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const projectPhasesApi = {
  getAllPhases: () => http.get<SuccessResponse<ProjectPhase[]>>('/api/v1/project-phases'),
  // Lấy tất cả phases theo projectId
  getProjectPhasesByProjectId: (projectId: number) =>
    http.get<SuccessResponse<ProjectPhase[]>>(`/api/v1/project-phases/project/${projectId}`),
  createProjectPhase: (body: CreateProjectPhaseBody) =>
    http.post<SuccessResponse<ProjectPhase>>('/api/v1/project-phases', body),
  updateProjectPhase: (body: UpdateProjectPhaseBody) =>
    http.put<SuccessResponse<ProjectPhase>>('/api/v1/project-phases', body),
  deleteProjectPhase: (id: number) => http.delete<SuccessResponse<null>>(`/api/v1/project-phases/${id}`)
}

export default projectPhasesApi
