import type { SuccessResponse } from './utils.type'

export interface Form {
  id: number
  name: string
  phone: string
  email: string
  companyName: string
  fieldName: string
  isAdvised?: boolean
}

export type CreateFormBody = {
  name: string
  email: string
  phone: string
  companyName: string
  fieldId: number
  isAdvised?: boolean
}

export interface Field {
  id: number
  fieldName: string
  description: string
}

export type CreateFormResponse = SuccessResponse<Form>
