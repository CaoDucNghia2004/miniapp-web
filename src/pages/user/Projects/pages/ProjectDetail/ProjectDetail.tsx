import { Calendar, FileText, CreditCard, MessageSquare, CheckCircle2 } from 'lucide-react'

const project = {
  id: 1,
  name: 'Dự án Website A',
  status: 'Đang thực hiện',
  progress: 70,
  startDate: '01/08/2025',
  endDate: '30/09/2025',
  contract: {
    value: '200,000,000 VNĐ',
    signedDate: '02/08/2025',
    paid: '100,000,000 VNĐ'
  },
  notes: [
    { id: 1, author: 'Admin', content: 'Khách hàng đã xác nhận yêu cầu.', date: '05/08/2025' },
    { id: 2, author: 'User', content: 'Đề nghị chỉnh sửa giao diện dashboard.', date: '10/08/2025' }
  ]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className='flex items-center gap-3 p-3 rounded-md bg-gray-50'>
      <Icon size={18} className='text-orange-500' />
      <div>
        <p className='text-xs text-gray-500'>{label}</p>
        <p className='text-sm font-medium text-gray-800'>{value}</p>
      </div>
    </div>
  )
}

export default function ProjectDetail() {
  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold mb-2'>{project.name}</h1>
        <p className='text-gray-600'>Chi tiết dự án và thông tin liên quan</p>
      </div>

      {/* Project Info */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <InfoItem icon={FileText} label='Trạng thái' value={project.status} />
        <InfoItem icon={Calendar} label='Ngày bắt đầu' value={project.startDate} />
        <InfoItem icon={Calendar} label='Ngày kết thúc' value={project.endDate} />
        <InfoItem icon={CheckCircle2} label='Tiến độ' value={`${project.progress}%`} />
      </div>

      {/* Progress */}
      <div className='bg-white p-6 rounded-lg shadow'>
        <h2 className='text-lg font-semibold mb-4'>Tiến độ dự án</h2>
        <div className='w-full bg-gray-200 rounded-full h-3'>
          <div
            className={`h-3 rounded-full ${
              project.progress === 100 ? 'bg-green-500' : project.status === 'Tạm dừng' ? 'bg-red-400' : 'bg-orange-500'
            }`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
        <p className='text-sm text-gray-600 mt-2'>{project.progress}% hoàn thành</p>
      </div>

      {/* Contract Info */}
      <div className='bg-white p-6 rounded-lg shadow space-y-3'>
        <h2 className='text-lg font-semibold mb-4 flex items-center gap-2'>
          <CreditCard size={20} className='text-orange-500' /> Thông tin hợp đồng
        </h2>
        <InfoItem icon={CreditCard} label='Giá trị hợp đồng' value={project.contract.value} />
        <InfoItem icon={CreditCard} label='Thanh toán' value={project.contract.paid} />
        <InfoItem icon={Calendar} label='Ngày ký' value={project.contract.signedDate} />
      </div>

      {/* Notes & Feedback */}
      <div className='bg-white p-6 rounded-lg shadow'>
        <h2 className='text-lg font-semibold mb-4 flex items-center gap-2'>
          <MessageSquare size={20} className='text-purple-500' /> Ghi chú & đánh giá
        </h2>
        <div className='space-y-3'>
          {project.notes.map((note) => (
            <div key={note.id} className='border rounded-md p-3'>
              <p className='text-sm text-gray-700'>{note.content}</p>
              <p className='text-xs text-gray-500 mt-1'>
                {note.author} • {note.date}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
