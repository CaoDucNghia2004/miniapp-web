export type Project = {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
  createdBy: string
  updatedBy?: string | null
  createdAt: string
  updatedAt?: string | null
  rating?: number
  review?: string | null
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  userId: number
  fieldId: number
  contractFile?: string | null
}
