import { Link, NavLink } from 'react-router-dom'
import SODLogo from 'src/assets/images/SOD_Logo.png'
import ProcedurePdf from 'src/assets/docs/QuyTrinh.pdf'

export default function Header() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors ${isActive ? 'text-orange-500' : 'text-gray-800 hover:text-orange-500'}`
  const externalNavClass = 'transition-colors text-gray-800 hover:text-orange-500 font-bold'

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

        <Link
          to='/login'
          className='ml-6 bg-orange-500 text-white px-4 py-2 rounded-md text-base font-semibold hover:bg-orange-600 transition-colors'
        >
          Đăng nhập
        </Link>
      </div>
    </header>
  )
}
