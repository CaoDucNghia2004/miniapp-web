export type ProjectPhaseStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

export interface ProjectPhase {
  id: number
  projectId: number
  phaseName: string
  description: string
  startDate: string
  endDate: string
  status: ProjectPhaseStatus
  amountDue: number
}

export interface CreateProjectPhaseBody {
  projectId: number
  phaseName: string
  description: string
  startDate: string
  endDate: string
  status: ProjectPhaseStatus
  amountDue: number
}

export interface UpdateProjectPhaseBody extends CreateProjectPhaseBody {
  id: number
}
