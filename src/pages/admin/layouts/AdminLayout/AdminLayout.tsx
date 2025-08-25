import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import path from 'src/constants/path'
import { clearAccessTokenFromLS, clearProfileFromLS } from 'src/utils/auth'

export default function AdminLayout() {
  const [open, setOpen] = useState(true) // mở/đóng sidebar (mobile)
  const navigate = useNavigate()
  const { setIsAuthenticated, setProfile, profile } = useContext(AppContext)

  const handleLogout = () => {
    clearAccessTokenFromLS()
    clearProfileFromLS()
    setIsAuthenticated(false)
    setProfile(null)
    navigate('/login')
  }

  const item = 'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium'
  const itemActive = 'bg-orange-100 text-orange-600'
  const itemIdle = 'text-gray-700 hover:bg-gray-100'

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <aside
        className={`${
          open ? 'translate-x-0' : '-translate-x-full'
        } fixed z-40 flex h-full w-72 flex-col bg-white shadow-md transition-transform duration-200 md:static md:translate-x-0`}
      >
        {/* Logo */}
        <div className='flex items-center gap-3 border-b px-6 py-5'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white font-bold'>
            Lg
          </div>
          <div className='text-xl font-bold text-gray-900'>Administration</div>
        </div>

        {/* Nav */}
        <nav className='flex-1 space-y-2 overflow-y-auto px-3 py-4'>
          <NavLink to={path.adminDashboard} className={({ isActive }) => `${item} ${isActive ? itemActive : itemIdle}`}>
            <span>📊</span> Dashboard
          </NavLink>

          <NavLink to='/admin/quotes' className={({ isActive }) => `${item} ${isActive ? itemActive : itemIdle}`}>
            <span>📝</span> Quản lý yêu cầu báo giá
          </NavLink>

          <NavLink to='/admin/customers' className={({ isActive }) => `${item} ${isActive ? itemActive : itemIdle}`}>
            <span>👥</span> Quản lý khách hàng
          </NavLink>

          <NavLink to='/admin/contracts' className={({ isActive }) => `${item} ${isActive ? itemActive : itemIdle}`}>
            <span>📑</span> Quản lý hợp đồng
          </NavLink>

          <NavLink to='/admin/payments' className={({ isActive }) => `${item} ${isActive ? itemActive : itemIdle}`}>
            <span>💰</span> Quản lý thanh toán
          </NavLink>

          <NavLink to='/admin/projects' className={({ isActive }) => `${item} ${isActive ? itemActive : itemIdle}`}>
            <span>📂</span> Quản lý dự án / Tiến độ
          </NavLink>

          <NavLink to='/admin/implemented' className={({ isActive }) => `${item} ${isActive ? itemActive : itemIdle}`}>
            <span>🚀</span> Dự án đã triển khai
          </NavLink>
        </nav>

        {/* Footer sidebar */}
        <div className='border-t px-4 py-4'>
          <button onClick={handleLogout} className='w-full rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600'>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Overlay cho mobile */}
      {open && <div onClick={() => setOpen(false)} className='fixed inset-0 z-30 bg-black/20 md:hidden' />}

      {/* Main area */}
      <div className='flex min-w-0 flex-1 flex-col'>
        {/* Header */}
        <header className='sticky top-0 z-20 flex items-center justify-between bg-white px-4 py-3 shadow-sm md:px-6'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => setOpen((v) => !v)}
              className='rounded-md border px-3 py-2 md:hidden'
              aria-label='Toggle sidebar'
            >
              ☰
            </button>
            <h1 className='text-lg font-semibold md:text-2xl'>Administration Overview</h1>
          </div>

          <div className='flex items-center gap-3 md:gap-4'>
            <div className='hidden items-center gap-2 rounded-lg border px-3 py-2 md:flex'>
              <span>🔎</span>
              <input className='w-56 outline-none placeholder:text-sm' placeholder='Search' />
            </div>

            <button className='rounded-full p-2 hover:bg-gray-100' title='Notifications'>
              🔔
            </button>
            <button className='rounded-full p-2 hover:bg-gray-100' title='Messages'>
              💬
            </button>

            <div className='flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-gray-600'>
                {profile?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <span className='hidden text-sm font-medium text-gray-700 md:block'>
                {profile?.email || 'admin@gmail.com'}
              </span>
            </div>
          </div>
        </header>

        {/* Body */}
        <main className='min-h-0 flex-1 overflow-y-auto p-4 md:p-6'>
          {/* Nội dung page con sẽ render tại đây */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
