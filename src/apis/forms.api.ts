import type { CreateFormBody, CreateFormResponse } from 'src/types/form.type'
import http from 'src/utils/http'

const formsApi = {
  registerUser: (body: CreateFormBody) => http.post<CreateFormResponse>('/api/v1/formss', body)
}
export default formsApi
