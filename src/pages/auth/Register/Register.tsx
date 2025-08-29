import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import formsApi from 'src/apis/forms.api'
import ImageSlider from 'src/components/ImageSlider'
import Input from 'src/components/Input'
import SuccessDialog from 'src/components/SuccessDialog'
import type { CreateFormBody, Field } from 'src/types/form.type'
import type { ErrorResponse } from 'src/types/utils.type'
import { schema, type Schema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Pick<Schema, 'name' | 'email' | 'phone' | 'companyName' | 'fieldId'>
const registerUserSchema = schema.pick(['name', 'email', 'phone', 'companyName', 'fieldId'])

export default function Register() {
  const navigate = useNavigate()
  const [fields, setFields] = useState<Field[]>([])
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    formsApi.getAllFields().then((res) => {
      setFields(res.data.data)
    })
  }, [])

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
      onSuccess: () => {
        // console.log('Register success', data)
        // toast.success(data.data.message)
        // navigate('/')
        setOpenDialog(true)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<null>>(error)) {
          const msg = error.response?.data?.message || error.message || 'Dữ liệu không hợp lệ'
          if (msg.toLowerCase().includes('phone')) {
            setError('phone', { type: 'server', message: msg })
          } else if (msg.toLowerCase().includes('email')) {
            setError('email', { type: 'server', message: msg })
          } else {
            // fallback: gắn cho email
            setError('email', { type: 'server', message: msg })
          }
          return
        }
      }
    })
  })

  return (
    <>
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

                <div className='mt-2'>
                  <select {...register('fieldId')} className='w-full border px-3 py-2 rounded'>
                    <option value=''>-- Chọn lĩnh vực --</option>
                    {fields.map((field) => (
                      <option key={field.id} value={field.id}>
                        {field.fieldName}
                      </option>
                    ))}
                  </select>
                  {errors.fieldId && <p className='text-red-500 text-sm mt-1'>{errors.fieldId.message}</p>}
                </div>
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
      <SuccessDialog
        open={openDialog}
        message='Chúng tôi đã nhận thông tin của bạn. Bộ phận hỗ trợ sẽ liên hệ lại sớm nhất!'
        onAutoClose={() => {
          setOpenDialog(false)
          navigate('/')
        }}
      />
    </>
  )
}
