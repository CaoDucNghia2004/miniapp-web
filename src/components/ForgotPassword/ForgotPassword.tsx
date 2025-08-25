import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import authApi from 'src/apis/auth.api'
import type { ErrorResponse } from 'src/types/utils.type'
import { schema, type Schema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import Input from '../Input'
import { Mail, LockKeyhole, KeyRound } from 'lucide-react'
import path from 'src/constants/path'

type EmailForm = Pick<Schema, 'email'>
const emailSchema = schema.pick(['email'])

type ResetForm = Pick<Schema, 'code' | 'password'>
const resetSchema = schema.pick(['code', 'password'])

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'request' | 'reset'>('request')
  const [email, setEmail] = useState<string>('')

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<EmailForm>({
    resolver: yupResolver(emailSchema)
  })

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    setError: setErrorReset,
    formState: { errors: errorsReset }
  } = useForm<ResetForm>({
    resolver: yupResolver(resetSchema)
  })

  const requestCodeMutation = useMutation({
    mutationFn: (body: EmailForm) => authApi.requestForgotPassword(body),
    onSuccess: (_, variables) => {
      setEmail(variables.email)
      setStep('reset')
      toast.success(`Mã xác thực đã được gửi đến ${variables.email}`)
    },
    onError: (error) => {
      if (isAxiosUnprocessableEntityError<ErrorResponse<null>>(error)) {
        const msg = error.response?.data?.message || error.message
        setError('email', { type: 'server', message: msg })
      }
    }
  })

  const resetPasswordMutation = useMutation({
    mutationFn: (body: ResetForm & { email: string }) => authApi.forgotPassword(body),
    onSuccess: () => {
      toast.success('Đổi mật khẩu thành công, vui lòng đăng nhập lại 🎉')
      navigate('/login')
    },
    onError: (error) => {
      if (isAxiosUnprocessableEntityError<ErrorResponse<null>>(error)) {
        const msg = error.response?.data?.message || error.message
        setErrorReset('code', { type: 'server', message: msg })
      }
    }
  })

  const onSubmitEmail = handleSubmit((data) => {
    toast.info('Đang gửi mã xác thực...')
    requestCodeMutation.mutate(data)
  })

  const onSubmitReset = handleSubmitReset((data) => {
    resetPasswordMutation.mutate({ ...data, email })
  })

  return (
    <div className='bg-gradient-to-br from-indigo-100 via-white to-blue-50  flex items-center justify-center px-4 py-30'>
      <div className='max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8'>
        <h1 className='text-3xl font-bold text-center text-indigo-600 mb-2'>
          {step === 'request' ? 'Quên mật khẩu' : 'Đặt lại mật khẩu'}
        </h1>
        <p className='text-center text-gray-500 mb-6 text-sm'>
          {step === 'request' ? (
            'Nhập email để nhận mã xác thực đặt lại mật khẩu.'
          ) : (
            <>
              Mã xác thực đã được gửi tới <b>{email}</b>.
            </>
          )}
        </p>

        {step === 'request' && (
          <form onSubmit={onSubmitEmail} noValidate className='space-y-5'>
            <div className='relative'>
              <Mail className='absolute left-3 top-3 w-5 h-5 text-gray-400' />
              <Input
                name='email'
                register={register}
                type='email'
                placeholder='Email của bạn'
                errorMessage={errors.email?.message}
                className='pl-10'
              />
            </div>

            <button
              type='submit'
              disabled={requestCodeMutation.isPending}
              className={`w-full py-3 rounded-lg text-white font-medium transition ${
                requestCodeMutation.isPending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow'
              }`}
            >
              {requestCodeMutation.isPending ? 'Đang gửi...' : 'Gửi mã xác thực'}
            </button>

            <div className='text-center'>
              <Link to={path.login} className='text-sm text-indigo-600 hover:underline'>
                ← Quay lại đăng nhập
              </Link>
            </div>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={onSubmitReset} noValidate className='space-y-4'>
            <div className='relative'>
              <KeyRound className='absolute left-3 top-3 w-5 h-5 text-gray-400' />
              <Input
                name='code'
                register={registerReset}
                type='text'
                placeholder='Mã xác thực'
                errorMessage={errorsReset.code?.message}
                className='pl-10'
              />
            </div>
            <div className='relative'>
              <LockKeyhole className='absolute left-3 top-3 w-5 h-5 text-gray-400' />
              <Input
                name='password'
                register={registerReset}
                type='password'
                placeholder='Mật khẩu mới'
                errorMessage={errorsReset.password?.message}
                className='pl-10'
              />
            </div>

            <button
              type='submit'
              disabled={resetPasswordMutation.isPending}
              className={`w-full py-3 rounded-lg text-white font-medium transition ${
                resetPasswordMutation.isPending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 shadow'
              }`}
            >
              {resetPasswordMutation.isPending ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
