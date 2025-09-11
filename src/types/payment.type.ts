export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED'

export interface Payment {
  id: number
  projectPhaseId: number
  amount: number
  paymentDate: string
  paymentStatus: PaymentStatus
  transactionId: string
  createdAt: string
  updatedAt: string | null
  createdBy: string | null
  updatedBy: string | null
}

export interface CreatePaymentDto {
  projectPhaseId: number
  amount: number
  paymentDate: string
  paymentStatus: PaymentStatus
  transactionId: string
}

export interface UpdatePaymentDto {
  id: number
  projectPhaseId?: number
  amount?: number
  paymentDate?: string
  paymentStatus?: PaymentStatus
  transactionId?: string
}
