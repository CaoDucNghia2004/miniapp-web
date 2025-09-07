import type { Field } from 'src/types/field.type'
import type { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const fieldsApi = {
  getAllFields: () => http.get<SuccessResponse<Field[]>>('/api/v1/fields/getAll'),
  createField: (body: { fieldName: string; description: string }) =>
    http.post<SuccessResponse<Field>>('/api/v1/fields', body),
  updateField: (id: number, body: Partial<Field>) =>
    http.put<SuccessResponse<Field>>('/api/v1/fields', { id, ...body }),
  deleteField: (id: number) => http.delete<SuccessResponse<null>>(`/api/v1/fields/${id}`)
}

export default fieldsApi
