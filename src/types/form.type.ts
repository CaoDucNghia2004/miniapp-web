import type { SuccessResponse } from './utils.type'

export interface Form {
  id: number
  name: string
  phone: string
  email: string
  companyName: string
  companyAddress: string
}

export type CreateFormBody = {
  name: string
  email: string
  phone: string
  companyName: string
  companyAddress: string
}

export type CreateFormResponse = SuccessResponse<Form>
