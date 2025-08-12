import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import formsApi from 'src/apis/forms.api'
import ImageSlider from 'src/components/ImageSlider'
import Input from 'src/components/Input'
import type { CreateFormBody } from 'src/types/form.type'
import type { ErrorResponse } from 'src/types/utils.type'
import { schema, type Schema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Pick<Schema, 'name' | 'email' | 'phone' | 'companyName' | 'companyAddress'>
const registerUserSchema = schema.pick(['name', 'email', 'phone', 'companyName', 'companyAddress'])

export default function Register() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerUserSchema)
  })

  const registerUserFormMutation = useMutation({
    mutationFn: (body: CreateFormBody) => formsApi.registerUser(body)
  })

  const onSubmit = handleSubmit((data) => {
    registerUserFormMutation.mutate(data, {
      onSuccess: (data) => {
        console.log('Register success', data)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<null>>(error)) {
          const msg = error.response?.data?.message || error.message || 'Dữ liệu không hợp lệ'
          setError('email', { type: 'server', message: msg })
          return
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
            <form className='p-10 rounded bg-white shadow-sm' noValidate onSubmit={onSubmit}>
              <div className='text-2xl text-center'>Đăng ký để lại thông tin của bạn</div>
              <Input
                name='name'
                type='text'
                className='mt-8'
                placeholder='Họ tên'
                register={register}
                errorMessage={errors.name?.message}
              />
              <Input
                name='email'
                type='email'
                className='mt-2'
                placeholder='Email'
                register={register}
                errorMessage={errors.email?.message}
              />
              <Input
                name='phone'
                type='text'
                className='mt-2'
                placeholder='Số điện thoại'
                register={register}
                errorMessage={errors.phone?.message}
              />
              <Input
                name='companyName'
                type='text'
                className='mt-2'
                placeholder='Tên công ty'
                register={register}
                errorMessage={errors.companyName?.message}
              />
              <Input
                name='companyAddress'
                type='text'
                className='mt-2'
                placeholder='Địa chỉ công ty'
                register={register}
                errorMessage={errors.companyAddress?.message}
              />
              {/* <Input
                name='password'
                register={register}
                type='password'
                className='mt-2'
                classNameEye='absolute right-[5px] h-5 w-5 cursor-pointer top-[12px]'
                errorMessage={errors.password?.message}
                placeholder='Password'
                autoComplete='on'
              />
              <Input
                name='confirm_password'
                register={register}
                type='password'
                className='mt-2'
                classNameEye='absolute right-[5px] h-5 w-5 cursor-pointer top-[12px]'
                errorMessage={errors.confirm_password?.message}
                placeholder='Confirm Password'
                autoComplete='on'
              /> */}

              <div className='mt-3'>
                <button className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600'>
                  Đăng ký
                </button>
              </div>
              <div className='flex items-center justify-center mt-8'>
                <span className='text-gray-400'>Bạn đã có tài khoản?</span>
                <Link className='text-red-400 ml-1' to='/login'>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
