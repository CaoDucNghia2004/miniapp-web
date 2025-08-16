import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import type { User } from 'src/types/user.type'
import type { SuccessResponse } from 'src/types/utils.type'
import { schema, type Schema } from 'src/utils/rules'

type FormData = Pick<Schema, 'email' | 'name' | 'phone' | 'companyName' | 'avatar'>
const profileSchema = schema.pick(['email', 'name', 'phone', 'companyName', 'avatar'])

export default function Profile() {
  const [file, setFile] = useState<File | null>(null)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const { data: profileData } = useQuery<SuccessResponse<User>>({
    queryKey: ['profile'],
    queryFn: () => userApi.getUser().then((res) => res.data)
  })

  const profile = profileData?.data

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      name: '',
      phone: '',
      companyName: '',
      avatar: ''
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(profileSchema) as any
  })

  useEffect(() => {
    if (profile) {
      reset({
        email: profile.email || '',
        name: profile.name || '',
        phone: profile.phone || '',
        companyName: profile.companyName || '',
        avatar: profile.avatar || ''
      })
    }
  }, [profile, reset])

  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return watch('avatar') || ''
  }, [file, watch])

  const onSubmit = handleSubmit((data: FormData) => {
    console.log(data)
  })

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ Sơ Của Tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <div className='mt-8 flex flex-col-reverse md:flex-row md:items-start'>
        <form className='mt-6 flex-grow md:mt-0 md:pr-12' noValidate onSubmit={onSubmit}>
          <div className='flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='pt-3 text-gray-700'>{profile?.email}</div>
            </div>
          </div>
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Tên</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                register={register}
                name='name'
                placeholder='Tên'
                errorMessage={errors.name?.message}
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Số điện thoại</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                register={register}
                name='phone'
                placeholder='Số điện thoại'
                errorMessage={errors.phone?.message}
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Tên Công Ty</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                register={register}
                name='companyName'
                placeholder='Tên công ty'
                errorMessage={errors.companyName?.message}
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
              />
            </div>
          </div>

          <Button
            className='flex h-9 items-center bg-orange-500 px-5 text-center text-sm text-white hover:bg-orange-500/80 lg:ml-37'
            type='submit'
          >
            Lưu
          </Button>
        </form>
        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='my-5 h-26 w-26 overflow-hidden rounded-full'>
              <img
                src={previewAvatarFromFile || 'https://cf.shopee.vn/file/d04ea22afab6e6d250a370d7ccc2e675_tn'}
                alt='avatar'
                className='w-full rounded-full object-cover'
              />
            </div>
            <input
              className='hidden'
              type='file'
              accept='.jpg,.jpeg,.png'
              ref={avatarInputRef}
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  setFile(file)
                  // field.onChange('http://localhost:3000/' + file.name)
                }
              }}
            />
            <button
              className='flex h-10 items-center justify-end rounded-sm border bg-white px-5 text-sm text-gray-600 shadow-sm hover:border-amber-500 hover:text-amber-500'
              type='button'
              onClick={() => avatarInputRef.current?.click()}
            >
              Chọn ảnh
            </button>
            <div className='mt-3 text-gray-400'>
              <div>Dụng lượng file tối đa 1 MB</div>
              <div>Định dạng:.JPEG, .PNG</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
