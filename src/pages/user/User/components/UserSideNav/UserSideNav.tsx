import { NavLink, Link } from 'react-router-dom'
import path from 'src/constants/path'
import { User, Lock, Pencil } from 'lucide-react'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'

import { getAvatarUrl } from 'src/utils/utils'

export default function UserSideNav() {
  const { profile } = useContext(AppContext)

  return (
    <div className='rounded-md bg-white p-3 shadow'>
      <div className='flex items-center border-b border-gray-200 pb-4'>
        <Link to={path.profile} className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-gray-300'>
          <img src={getAvatarUrl(profile?.avatar)} alt='avatar' className='h-full w-full object-cover' />
        </Link>
        <div className='flex-grow pl-4'>
          <div className='mb-1 truncate font-semibold text-gray-800'>{profile?.name || 'Người dùng'}</div>
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
