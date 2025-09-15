import { Link, NavLink, useNavigate } from 'react-router-dom'
import SODLogo from 'src/assets/images/SOD_Logo.png'
import ProcedurePdf from 'src/assets/docs/QuyTrinh.pdf'
import Popover from '../Popover'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import path from 'src/constants/path'

import { getAvatarUrl } from 'src/utils/utils'
import { clearAccessTokenFromLS, clearProfileFromLS } from 'src/utils/auth'

export default function Header() {
  const navigate = useNavigate()
  const { isAuthenticated, setIsAuthenticated, setProfile, profile } = useContext(AppContext)
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors ${isActive ? 'text-orange-500' : 'text-gray-800 hover:text-orange-500'}`
  const externalNavClass = 'transition-colors text-gray-800 hover:text-orange-500 font-bold'

  const handleLogout = () => {
    clearAccessTokenFromLS()
    clearProfileFromLS()
    setIsAuthenticated(false)
    setProfile(null)
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
          <NavLink to={path.projectDashboard} className={navLinkClass}>
            Dự án của tôi
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

                {profile?.email === 'admin@gmail.com' ? (
                  <Link
                    to={path.adminDashboard}
                    className='block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left'
                  >
                    Quản lý admin
                  </Link>
                ) : (
                  <Link
                    to={path.projectDashboard}
                    className='block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left'
                  >
                    Dự án của tôi
                  </Link>
                )}
                <button
                  className='block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left'
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </div>
            }
          >
            <div className='flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer hover:bg-gray-50'>
              <div className='w-10 h-10 rounded-full overflow-hidden shadow-md transition-transform duration-300 hover:scale-105'>
                <img src={getAvatarUrl(profile?.avatar)} alt='avatar' className='w-full h-full object-cover' />
              </div>

              <div className='flex flex-col'>
                <span className='text-sm font-semibold text-gray-900'>{profile?.name || 'Người dùng'}</span>
                <span className='text-xs text-gray-500 truncate max-w-[150px]'>{profile?.email}</span>
              </div>
            </div>
          </Popover>
        )}
      </div>
    </header>
  )
}
