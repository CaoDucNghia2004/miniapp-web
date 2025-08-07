import { Link } from 'react-router-dom'
import SODLogo from 'src/assets/images/SOD_Logo.png'

export default function Header() {
  return (
    <header className='bg-white shadow-sm sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-6 py-6 flex items-center justify-between'>
        <Link to='/' className='flex items-center gap-2'>
          <img src={SODLogo} alt='SOD Logo' className='h-12 w-auto object-contain' />
          <span className='text-orange-500 font-bold text-xl'>MiniApp</span>
        </Link>

        <nav className='hidden md:flex items-center gap-8 text-base font-bold text-gray-800'>
          <Link to='/' className='hover:text-orange-500 transition-colors'>
            Trang chủ
          </Link>
          <Link to='/services' className='hover:text-orange-500 transition-colors'>
            Dịch vụ
          </Link>
          <Link to='/benefits' className='hover:text-orange-500 transition-colors'>
            Lợi ích
          </Link>
          <Link to='/partners' className='hover:text-orange-500 transition-colors'>
            Đối tác
          </Link>
          <Link to='/your-project' className='hover:text-orange-500 transition-colors'>
            Dự án của bạn
          </Link>
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
