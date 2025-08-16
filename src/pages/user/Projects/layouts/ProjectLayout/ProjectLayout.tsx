import { Outlet } from 'react-router-dom'
import ProjectSideNav from '../../components/ProjectSideNav'

export default function ProjectLayout() {
  return (
    <div className='bg-neutral-100 py-12 text-sm text-gray-600'>
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
