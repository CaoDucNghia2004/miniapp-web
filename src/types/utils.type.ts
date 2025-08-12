export interface SuccessResponse<Data> {
  status: number
  message: string
  data: Data
}

export interface ErrorResponse<Data> {
  status: number
  message: string
  error: string
  data?: Data
}
