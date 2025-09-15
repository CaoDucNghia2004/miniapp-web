import { Link, useLocation } from 'react-router-dom'
import SODLogo from 'src/assets/images/SOD_Logo.png'

export default function RegisterHeader() {
  const location = useLocation()
  const pathname = location.pathname
  let title = ''
  if (pathname.includes('login')) {
    title = 'Đăng nhập'
  } else if (pathname.includes('register')) {
    title = 'Đăng ký'
  }
  return (
    <header className='py-5 '>
      <div className='max-w-7xl mx-auto px-4'>
        <nav className='flex items-center'>
          <Link to='/'>
            <img src={SODLogo} alt='SOD Logo' className='w-15 h-15 lg:w-20 lg:h-20 object-cover' />
          </Link>
          <div className='ml-6 text-xl lg:text-2xl font-bold'>{title}</div>
        </nav>
      </div>
    </header>
  )
}
