import { Link } from 'react-router-dom'
import SODLogo from 'src/assets/images/SOD_Logo.png'
import { FaFacebook, FaYoutube } from 'react-icons/fa'
import { SiZalo } from 'react-icons/si'
import path from 'src/constants/path'

export default function Footer() {
  return (
    <footer className='bg-gradient-to-r from-white via-[#f9f9f9] to-[#edf3f8] py-10 border-t border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-sm text-gray-700 '>
        <div>
          <Link to='/'>
            <img src={SODLogo} alt='SOD Logo' className='h-15 w-auto lg:w-20 lg:h-20 object-cover mb-4 rounded-sm' />
          </Link>
          <p className='font-semibold mt-4 mb-2 text-xl lg:text-2xl'>Công ty Thương mại Dịch vụ SOD Solution</p>
          <ul className='space-y-1'>
            <li className='text-base'>📞 024 5678 5999</li>
            <li className='text-base'>📧 infoSODSolution@gmail.com</li>
            <li className='text-base'>📍 49 Nguyễn Đỗ Cung, phường Tây Thạnh, quận Tân Phú, TP.HCM</li>
          </ul>
        </div>
        <div>
          <h3 className='font-bold text-gray-900 mb-2 text-xl'>Chuyên mục</h3>
          <ul className='space-y-1 list-disc list-inside mt-4'>
            <li>
              <Link to={path.services} className='hover:text-blue-500 text-base'>
                Dịch vụ
              </Link>
            </li>
            <li>
              <Link to={path.aboutUs} className='hover:text-blue-500 text-base'>
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link to={path.privacyPolicy} className='hover:text-blue-500 text-base'>
                Chính sách bảo mật
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className='font-bold text-gray-900 mb-2 text-xl'>Liên hệ</h3>
          <div className='flex space-x-6 mt-4'>
            <Link to='#' className='transform transition duration-300 hover:-translate-y-1 hover:scale-110 '>
              <FaFacebook className='text-blue-600 w-10 h-10' />
            </Link>
            <Link to='#' className='transform transition duration-300 hover:-translate-y-1 hover:scale-110 '>
              <SiZalo className='text-blue-500 w-10 h-10' />
            </Link>
            <Link to='#' className='transform transition duration-300 hover:-translate-y-1 hover:scale-110 '>
              <FaYoutube className='text-red-600 w-10 h-10' />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
