import { CreditCard, Calendar, FileText, CheckCircle2, XCircle } from 'lucide-react'

const contract = {
  id: 'HD2025-001',
  signedDate: '02/08/2025',
  value: 200_000_000,
  status: 'Đang hiệu lực',
  payments: [
    { id: 1, date: '05/08/2025', amount: 50_000_000, status: 'Đã thanh toán' },
    { id: 2, date: '15/08/2025', amount: 50_000_000, status: 'Đã thanh toán' },
    { id: 3, date: '01/09/2025', amount: 50_000_000, status: 'Chưa thanh toán' },
    { id: 4, date: '15/09/2025', amount: 50_000_000, status: 'Chưa thanh toán' }
  ]
}

function formatCurrency(amount: number) {
  return amount.toLocaleString('vi-VN') + ' VNĐ'
}

export default function ProjectContract() {
  const totalPaid = contract.payments.filter((p) => p.status === 'Đã thanh toán').reduce((sum, p) => sum + p.amount, 0)

  const remaining = contract.value - totalPaid

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold mb-2'>Hợp đồng & Thanh toán</h1>
        <p className='text-gray-600'>Thông tin hợp đồng và tiến trình thanh toán</p>
      </div>

      {/* Contract Info */}
      <div className='bg-white p-6 rounded-lg shadow space-y-3'>
        <h2 className='text-lg font-semibold mb-4 flex items-center gap-2'>
          <FileText size={20} className='text-orange-500' /> Thông tin hợp đồng
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div className='p-3 bg-gray-50 rounded-md'>
            <p className='text-xs text-gray-500'>Số hợp đồng</p>
            <p className='font-medium text-gray-800'>{contract.id}</p>
          </div>
          <div className='p-3 bg-gray-50 rounded-md flex items-center gap-2'>
            <Calendar size={16} className='text-orange-500' />
            <div>
              <p className='text-xs text-gray-500'>Ngày ký</p>
              <p className='font-medium text-gray-800'>{contract.signedDate}</p>
            </div>
          </div>
          <div className='p-3 bg-gray-50 rounded-md'>
            <p className='text-xs text-gray-500'>Giá trị hợp đồng</p>
            <p className='font-medium text-gray-800'>{formatCurrency(contract.value)}</p>
          </div>
          <div className='p-3 bg-gray-50 rounded-md flex items-center gap-2'>
            <CreditCard size={16} className='text-orange-500' />
            <div>
              <p className='text-xs text-gray-500'>Trạng thái</p>
              <p className='font-medium text-green-600'>{contract.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Table */}
      <div className='bg-white p-6 rounded-lg shadow'>
        <h2 className='text-lg font-semibold mb-4 flex items-center gap-2'>
          <CreditCard size={20} className='text-orange-500' /> Lịch sử thanh toán
        </h2>
        <div className='overflow-x-auto'>
          <table className='w-full border border-gray-200 rounded-md'>
            <thead className='bg-gray-100 text-sm text-gray-600'>
              <tr>
                <th className='px-4 py-2 text-left'>#</th>
                <th className='px-4 py-2 text-left'>Ngày</th>
                <th className='px-4 py-2 text-left'>Số tiền</th>
                <th className='px-4 py-2 text-left'>Trạng thái</th>
              </tr>
            </thead>
            <tbody className='text-sm'>
              {contract.payments.map((p) => (
                <tr key={p.id} className='border-t'>
                  <td className='px-4 py-2'>{p.id}</td>
                  <td className='px-4 py-2'>{p.date}</td>
                  <td className='px-4 py-2'>{formatCurrency(p.amount)}</td>
                  <td className='px-4 py-2 flex items-center gap-1'>
                    {p.status === 'Đã thanh toán' ? (
                      <CheckCircle2 size={16} className='text-green-500' />
                    ) : (
                      <XCircle size={16} className='text-red-500' />
                    )}
                    <span
                      className={
                        p.status === 'Đã thanh toán' ? 'text-green-600 font-medium' : 'text-red-500 font-medium'
                      }
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className='bg-white p-6 rounded-lg shadow grid grid-cols-1 sm:grid-cols-2 gap-6'>
        <div className='p-4 bg-green-50 border border-green-200 rounded-md'>
          <p className='text-sm text-gray-600'>Đã thanh toán</p>
          <p className='text-lg font-semibold text-green-600'>{formatCurrency(totalPaid)}</p>
        </div>
        <div className='p-4 bg-red-50 border border-red-200 rounded-md'>
          <p className='text-sm text-gray-600'>Còn lại</p>
          <p className='text-lg font-semibold text-red-600'>{formatCurrency(remaining)}</p>
        </div>
      </div>
    </div>
  )
}
