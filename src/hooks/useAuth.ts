import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import authApi from 'src/apis/auth.api'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'

export function useAuth() {
  const navigate = useNavigate()
  const { setIsAuthenticated, setProfile } = useContext(AppContext)

  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')

  // Step 1: login
  const loginMutation = useMutation({
    mutationFn: authApi.loginAccount,
    onSuccess: (_, variables) => {
      setEmail(variables.email)
      toast.info('Mã xác thực đã được gửi tới email')
      setStep(2)
    },
    onError: () => toast.error('Sai email hoặc mật khẩu')
  })

  // Step 2: check code
  const checkCodeMutation = useMutation({
    mutationFn: authApi.checkCode,
    onSuccess: (res) => {
      const { accessToken, user } = res.data.data
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('profile', JSON.stringify(user))

      setIsAuthenticated(true)
      setProfile(user)

      toast.success('Đăng nhập thành công 🎉')
      navigate('/')
    },
    onError: () => toast.error('Mã xác thực không hợp lệ hoặc đã hết hạn')
  })

  // resend code
  const resendCodeMutation = useMutation({
    mutationFn: () => authApi.resendCode({ email }),
    onSuccess: () => toast.success('Đã gửi lại mã xác thực'),
    onError: () => toast.error('Không thể gửi lại mã')
  })

  return {
    step,
    setStep,
    email,
    setEmail,
    loginMutation,
    checkCodeMutation,
    resendCodeMutation
  }
}
