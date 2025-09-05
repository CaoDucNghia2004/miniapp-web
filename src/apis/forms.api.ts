import type { CreateFormBody, CreateFormResponse, Field, Form } from 'src/types/form.type'
import type { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const formsApi = {
  registerUser: (body: CreateFormBody) => http.post<CreateFormResponse>('/api/v1/forms', body),
  getAllFields: () => http.get<SuccessResponse<Field[]>>('/api/v1/fields/getAll'),
  getAllForms: () => http.get<SuccessResponse<Form[]>>('/api/v1/forms/getAll'),
  updateForm: (id: number, body: Partial<Form>) =>
    http.put<SuccessResponse<Form>>('/api/v1/forms', {
      id,
      ...body
    })
}
export default formsApi
