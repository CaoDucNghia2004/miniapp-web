import { Link, NavLink, useNavigate } from 'react-router-dom'
import SODLogo from 'src/assets/images/SOD_Logo.png'
import ProcedurePdf from 'src/assets/docs/QuyTrinh.pdf'
import Popover from '../Popover'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import { useQuery } from '@tanstack/react-query'
import type { SuccessResponse } from 'src/types/utils.type'
import type { User } from 'src/types/user.type'
import userApi from 'src/apis/user.api'
import path from 'src/constants/path'

export default function Header() {
  const navigate = useNavigate()
  const { isAuthenticated, setIsAuthenticated } = useContext(AppContext)
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors ${isActive ? 'text-orange-500' : 'text-gray-800 hover:text-orange-500'}`
  const externalNavClass = 'transition-colors text-gray-800 hover:text-orange-500 font-bold'

  const { data: userData } = useQuery<SuccessResponse<User>>({
    queryKey: ['profile'],
    queryFn: () => userApi.getUser().then((res) => res.data),
    enabled: isAuthenticated
  })

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    setIsAuthenticated(false)
    navigate('/login')
  }

  return (
    <header className='bg-white shadow-sm sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-6 py-6 flex items-center justify-between '>
        <Link to='/' className='flex items-center gap-2'>
          <img src={SODLogo} alt='SOD Logo' className='h-12 w-auto object-contain' />
          <span className='text-orange-500 font-bold text-xl'>MiniApp</span>
        </Link>

        <nav className='hidden md:flex items-center gap-8 text-base font-bold text-gray-800'>
          <NavLink to='/' className={navLinkClass}>
            Trang chủ
          </NavLink>
          <NavLink to='/services' className={navLinkClass}>
            Dịch vụ
          </NavLink>
          <NavLink to='/partners' className={navLinkClass}>
            Đối tác
          </NavLink>
          <a href={ProcedurePdf} target='_blank' rel='noopener noreferrer' className={externalNavClass}>
            Quy trình
          </a>
          <NavLink to='/your-project' className={navLinkClass}>
            Dự án của bạn
          </NavLink>
        </nav>

        {!isAuthenticated && (
          <Link
            to='/login'
            className='ml-6 bg-orange-500 text-white px-4 py-2 rounded-md text-base font-semibold hover:bg-orange-600 transition-colors'
          >
            Đăng nhập
          </Link>
        )}
        {isAuthenticated && (
          <Popover
            className='flex items-center py-1 hover:text-gray-300 cursor-pointer ml-6'
            renderPopover={
              <div className='bg-white relative shadow-md rounded-sm border border-gray-200'>
                <Link
                  to={path.profile}
                  className='block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left '
                >
                  Tài khoản của tôi
                </Link>
                <Link
                  to={path.projectDashboard}
                  className='block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left'
                >
                  Dự án của bạn
                </Link>
                <button
                  className='block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left'
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </div>
            }
          >
            <div className='w-5 h-5 mr-2 shrink-0'>
              <img src={userData?.data.avatar} alt='avatar' className='w-full h-full object-cover rounded-full' />
            </div>
            <div>{userData?.data.name || userData?.data.email}</div>
          </Popover>
        )}
      </div>
    </header>
  )
}
