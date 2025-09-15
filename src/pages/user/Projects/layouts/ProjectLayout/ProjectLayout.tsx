import { Outlet } from 'react-router-dom'
import ProjectSideNav from '../../components/ProjectSideNav'
import { Helmet } from 'react-helmet-async'

export default function ProjectLayout() {
  return (
    <div className='bg-neutral-100 py-12 text-sm text-gray-600'>
      <Helmet>
        <title>MiniApp Web | Dự án của tôi</title>
        <meta
          name='description'
          content='Quản lý dự án MiniApp của bạn một cách dễ dàng và hiệu quả với giao diện thân thiện và các công cụ mạnh mẽ của chúng tôi.'
        />
      </Helmet>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-12'>
          <div className='md:col-span-3'>
            <ProjectSideNav />
          </div>
          <div className='md:col-span-9'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
