import { NavLink, Link } from 'react-router-dom'
import path from 'src/constants/path'
import { User, Lock, Pencil } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import type { SuccessResponse } from 'src/types/utils.type'
import type { User as UserType } from 'src/types/user.type'
import userApi from 'src/apis/user.api'

export default function UserSideNav() {
  const { data } = useQuery<SuccessResponse<UserType>>({
    queryKey: ['profile'],
    queryFn: () => userApi.getUser().then((res) => res.data)
  })

  const avatar = data?.data.avatar || 'https://cf.shopee.vn/file/d04ea22afab6e6d250a370d7ccc2e675_tn'
  const name = data?.data.name || 'Người dùng'

  return (
    <div className='rounded-md bg-white p-3 shadow'>
      <div className='flex items-center border-b border-gray-200 pb-4'>
        <Link to={path.profile} className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-gray-300'>
          <img src={avatar} alt='avatar' className='h-full w-full object-cover' />
        </Link>
        <div className='flex-grow pl-4'>
          <div className='mb-1 truncate font-semibold text-gray-800'>{name}</div>
          <Link to={path.profile} className='flex items-center text-sm text-gray-500 hover:text-orange-500 transition'>
            <Pencil size={14} className='mr-1' />
            Sửa hồ sơ
          </Link>
        </div>
      </div>

      <div className='mt-6 space-y-2'>
        <NavLink
          to={path.profile}
          className={({ isActive }) =>
            `flex items-center px-2 py-2 rounded-md text-sm transition ${
              isActive
                ? 'bg-orange-50 text-orange-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50 hover:text-orange-500'
            }`
          }
        >
          <User size={20} className='mr-3' />
          Tài khoản của tôi
        </NavLink>

        <NavLink
          to={path.changePassword}
          className={({ isActive }) =>
            `flex items-center px-2 py-2 rounded-md text-sm transition ${
              isActive
                ? 'bg-orange-50 text-orange-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50 hover:text-orange-500'
            }`
          }
        >
          <Lock size={20} className='mr-3' />
          Đổi mật khẩu
        </NavLink>
      </div>
    </div>
  )
}
