import { FileText, CheckCircle2, CreditCard, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'

const stats = [
  { label: 'Số dự án', value: 3, icon: FileText, color: 'text-blue-500' },
  { label: 'Tiến độ TB', value: '65%', icon: CheckCircle2, color: 'text-green-500' },
  { label: 'Hợp đồng', value: 5, icon: CreditCard, color: 'text-orange-500' },
  { label: 'Đánh giá', value: 12, icon: MessageSquare, color: 'text-purple-500' }
]

const projects = [
  {
    id: 1,
    name: 'Dự án Website A',
    status: 'Đang thực hiện',
    progress: 70,
    startDate: '01/08/2025',
    endDate: '30/09/2025'
  },
  {
    id: 2,
    name: 'Dự án Mobile App B',
    status: 'Hoàn thành',
    progress: 100,
    startDate: '01/06/2025',
    endDate: '15/07/2025'
  },
  {
    id: 3,
    name: 'Dự án ERP C',
    status: 'Tạm dừng',
    progress: 40,
    startDate: '10/07/2025',
    endDate: '—'
  }
]

export default function DashboardUser() {
  return (
    <div className='space-y-8'>
      {/* Stats section */}
      <div>
        <h1 className='text-2xl font-bold mb-2'>Dự án của bạn</h1>
        <p className='text-gray-600'>Tổng quan trạng thái và tiến độ dự án</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className='bg-white rounded-lg shadow p-4 flex items-center gap-4'>
              <div className={`p-3 rounded-full bg-gray-100 ${color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className='text-sm text-gray-500'>{label}</p>
                <p className='text-lg font-semibold'>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project List */}
      <div className='bg-white p-6 rounded-lg shadow'>
        <h2 className='text-lg font-semibold mb-4'>Danh sách dự án</h2>
        <div className='space-y-4'>
          {projects.map((project) => (
            <div
              key={project.id}
              className='border rounded-md p-4 flex items-center justify-between hover:shadow-md transition'
            >
              <div>
                <h3 className='font-semibold text-gray-800'>{project.name}</h3>
                <p className='text-sm text-gray-500'>{project.status}</p>
                <div className='w-48 bg-gray-200 rounded-full h-2 mt-2'>
                  <div
                    className={`h-2 rounded-full ${
                      project.progress === 100
                        ? 'bg-green-500'
                        : project.status === 'Tạm dừng'
                          ? 'bg-red-400'
                          : 'bg-orange-500'
                    }`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className='text-xs text-gray-400 mt-1'>{project.progress}% hoàn thành</p>
              </div>
              <Link
                to={`/project/project-details?id=${project.id}`}
                className='text-orange-600 font-medium hover:underline'
              >
                Xem chi tiết →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
