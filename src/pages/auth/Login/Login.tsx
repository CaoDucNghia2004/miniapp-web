import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import authApi from 'src/apis/auth.api'
import ImageSlider from 'src/components/ImageSlider'
import Input from 'src/components/Input'
import { AppContext } from 'src/contexts/app.context'

import type { ErrorResponse } from 'src/types/utils.type'
import { schema, type Schema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

type CodeForm = Pick<Schema, 'code'>
const codeSchema = schema.pick(['code'])

export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('')
  const [step, setStep] = useState<'login' | 'verify'>('login')

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const {
    register: registerCode,
    handleSubmit: handleSubmitCode,
    setError: setErrorCode,
    formState: { errors: errorsCode }
  } = useForm<CodeForm>({
    resolver: yupResolver(codeSchema)
  })

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => authApi.loginAccount(body)
  })

  const checkCodeMutation = useMutation({
    mutationFn: (body: CodeForm) => authApi.checkCode({ email, ...body })
  })

  const resendCodeMutation = useMutation({
    mutationFn: () => authApi.resendCode({ email }),
    onSuccess: () => {
      // Thông báo gửi thành công
      toast.success(`Mã xác thực đã được gửi lại tới ${email}`)
    },
    onError: (error) => {
      const msg = isAxiosUnprocessableEntityError<ErrorResponse<null>>(error)
        ? error.response?.data?.message
        : 'Gửi mã thất bại, vui lòng thử lại'
      toast.error(msg)
    }
  })

  const onSubmit = handleSubmit((data) => {
    setEmail(data.email)
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        toast.success(data.data.message || 'Đăng nhập thành công!')
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<null>>(error)) {
          const msg = error.response?.data?.message || error.message || 'Dữ liệu không hợp lệ'
          // nếu BE trả lỗi cần verify
          if (msg.toLowerCase().includes('verify') || msg.toLowerCase().includes('not active')) {
            setStep('verify')
            resendCodeMutation.mutate()
            return
          }
          setError('email', { type: 'server', message: msg })
          setError('password', { type: 'server', message: msg })
          return
        }
      }
    })
  })

  // submit verify code
  const onSubmitCode = handleSubmitCode((data) => {
    checkCodeMutation.mutate(data, {
      onSuccess: (res) => {
        setIsAuthenticated(true)
        setProfile(res.data.data.user)
        toast.success('Xác thực thành công, chào mừng bạn 🎉')
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<null>>(error)) {
          const msg = error.response?.data?.message || error.message || 'Mã code không hợp lệ'
          setErrorCode('code', { type: 'server', message: msg })
        }
      }
    })
  })

  return (
    <div className='bg-gradient-to-br from-stone-100 via-white to-orange-50'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-20 lg:pr-10'>
          <div className='lg:col-span-3 hidden lg:block'>
            <ImageSlider />
          </div>
          <div className='lg:col-span-2 lg:col-start-4'>
            {step === 'login' && (
              <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
                <div className='text-2xl'>Đăng nhập</div>
                <Input
                  name='email'
                  register={register}
                  type='email'
                  className='mt-8'
                  errorMessage={errors.email?.message}
                  placeholder='Email'
                  // rules={rules.email}
                />
                <Input
                  name='password'
                  register={register}
                  type='password'
                  className='mt-2'
                  classNameEye='absolute right-[5px] h-5 w-5 cursor-pointer top-[12px]'
                  errorMessage={errors.password?.message}
                  placeholder='Mật khẩu'
                  // rules={rules.password}
                  autoComplete='on'
                />

                <div className='mt-3'>
                  <button className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600'>
                    Đăng nhập
                  </button>
                </div>
                <div className='flex items-center justify-center mt-8'>
                  <span className='text-gray-400'>Bạn đã có tài khoản?</span>
                  <Link className='text-red-400 ml-1' to='/register'>
                    Đăng ký
                  </Link>
                </div>
              </form>
            )}

            {step === 'verify' && (
              <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmitCode} noValidate>
                <div className='text-2xl font-semibold text-gray-700'>Xác thực tài khoản</div>
                <p className='mt-2 text-gray-600 text-sm'>
                  Mã xác thực đã được gửi tới <b>{email}</b>. Vui lòng nhập mã để tiếp tục.
                </p>
                <Input
                  name='code'
                  register={registerCode}
                  type='text'
                  className='mt-6'
                  errorMessage={errorsCode.code?.message}
                  placeholder='Mã xác thực'
                />
                <div className='mt-4 flex gap-2'>
                  <button
                    type='submit'
                    className='flex-1 py-3 px-2 uppercase bg-green-500 text-white text-sm hover:bg-green-600 rounded'
                  >
                    Xác nhận
                  </button>
                  <button
                    type='button'
                    className='px-4 py-3 text-sm text-blue-500 hover:underline'
                    onClick={() => resendCodeMutation.mutate()}
                  >
                    Gửi lại mã
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
