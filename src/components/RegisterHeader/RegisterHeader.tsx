import { Link } from 'react-router-dom'
import SODLogo from 'src/assets/images/SOD_Logo.png'

export default function RegisterHeader() {
  return (
    <header className='py-5 '>
      <div className='max-w-7xl mx-auto px-4'>
        <nav className='flex items-center'>
          <Link to='/'>
            <img src={SODLogo} alt='SOD Logo' className='w-15 h-15 lg:w-20 lg:h-20 object-cover' />
          </Link>
          <div className='ml-6 text-xl lg:text-2xl font-bold'>Đăng Ký</div>
        </nav>
      </div>
    </header>
  )
}
