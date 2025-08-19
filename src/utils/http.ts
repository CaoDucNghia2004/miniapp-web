import axios, { AxiosError, type AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { getAccessTokenFromLS, setAccessTokenToLS, setProfileToLS } from './auth'
import type { AuthResponse } from 'src/types/auth.type'
import config from 'src/constants/config'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === '/api/v1/auth/login' || url === '/api/v1/auth/check-code') {
          const data = response.data as AuthResponse
          this.accessToken = data.data.accessToken
          setAccessTokenToLS(this.accessToken)
          setProfileToLS(data.data.user)
        }
        //  else if (url === '/api/v1/auth/logout') {
        //   //xem lại cách xử lý logout của BE
        //   this.accessToken = ''
        //   clearAccessTokenFromLS()
        // }
        return response
      },
      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data.message || error.message
          toast.error(message)
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
