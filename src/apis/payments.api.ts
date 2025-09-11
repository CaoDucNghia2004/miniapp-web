import type { CreatePaymentDto, Payment, UpdatePaymentDto } from 'src/types/payment.type'
import type { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const paymentsApi = {
  getPaymentsByProjectId(projectId: number) {
    return http.get<SuccessResponse<Payment[]>>(`/api/v1/payments/project/${projectId}`)
  },
  createPayment(payload: CreatePaymentDto) {
    return http.post<SuccessResponse<Payment>>('/api/v1/payments', payload)
  },

  updatePayment(payload: UpdatePaymentDto) {
    return http.put<SuccessResponse<Payment>>('/api/v1/payments', payload)
  },

  deletePayment(paymentId: number) {
    return http.delete<SuccessResponse<null>>(`/api/v1/payments/${paymentId}`)
  }
}

export default paymentsApi
