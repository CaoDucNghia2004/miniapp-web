import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import SODLogo from 'src/assets/images/SOD_Logo.png'

export default function RegisterHeader() {
  const location = useLocation()
  const pathname = location.pathname
  let title = ''
  let helmetTitle = 'MiniApp Web'
  let helmetDesc = ''

  if (pathname.includes('login')) {
    title = 'Đăng nhập'
    helmetTitle = 'MiniApp - Đăng nhập'
    helmetDesc = 'Đăng nhập để sử dụng các tính năng của trang web'
  } else if (pathname.includes('register')) {
    title = 'Đăng ký'
    helmetTitle = 'MiniApp Web | Đăng ký liên hệ'
    helmetDesc = 'Đăng ký để lại thông tin của bạn'
  }

  return (
    <>
      <Helmet>
        <title>{helmetTitle}</title>
        <meta name='description' content={helmetDesc} />
      </Helmet>

      <header className='py-5 '>
        <div className='max-w-7xl mx-auto px-4'>
          <nav className='flex items-center'>
            <Link to='/'>
              <img src={SODLogo} alt='SOD Logo' className='w-auto h-15 lg:w-20 lg:h-20 object-cover rounded-sm' />
            </Link>
            <div className='ml-6 text-xl lg:text-2xl font-bold'>{title}</div>
          </nav>
        </div>
      </header>
    </>
  )
}
