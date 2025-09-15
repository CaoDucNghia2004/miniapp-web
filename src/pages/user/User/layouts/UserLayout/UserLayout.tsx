import { Outlet } from 'react-router-dom'
import UserSideNav from '../../components/UserSideNav'
import { Helmet } from 'react-helmet-async'

export default function UserLayout() {
  return (
    <div className='bg-neutral-100 py-12 text-sm text-gray-600'>
      <Helmet>
        <title>MiniApp Web | Tài khoản của tôi</title>
        <meta
          name='description'
          content='Quản lý tài khoản MiniApp của bạn một cách dễ dàng và hiệu quả với giao diện thân thiện và các công cụ mạnh mẽ của chúng tôi.'
        />
      </Helmet>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-12'>
          <div className='md:col-span-3 lg:col-span-3'>
            <UserSideNav />
          </div>
          <div className='md:col-span-9 lg:col-span-9'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
