export default function AdminDashboard() {
  // ====== DUMMY DATA (thay bằng API thật sau) ======
  const kpis = [
    { label: 'Yêu cầu báo giá', value: 24, delta: '+6 tuần này', icon: '📝' },
    { label: 'Khách hàng mới', value: 8, delta: '+2 hôm nay', icon: '👤' },
    { label: 'Hợp đồng đang xử lý', value: 12, delta: '3 chờ ký', icon: '📑' },
    { label: 'Doanh thu tháng', value: '245,5tr', delta: '+14%', icon: '💰' }
  ]

  const recentQuotes = [
    {
      name: 'Nguyễn Văn A',
      phone: '0901 xxx xxx',
      email: 'a@example.com',
      field: 'Thương mại',
      budget: '50tr',
      status: 'Đang báo giá'
    },
    {
      name: 'Trần Thị B',
      phone: '0902 xxx xxx',
      email: 'b@example.com',
      field: 'Du lịch',
      budget: '80tr',
      status: 'Chờ khách duyệt'
    },
    { name: 'Lê C', phone: '0903 xxx xxx', email: 'c@example.com', field: 'F&B', budget: '120tr', status: 'Đã chốt' }
  ]

  const contracts = [
    { code: 'HD-2025-0031', customer: 'Công ty Alpha', amount: '95tr', stage: 70 },
    { code: 'HD-2025-0030', customer: 'Công ty Beta', amount: '120tr', stage: 35 },
    { code: 'HD-2025-0029', customer: 'Cửa hàng Gama', amount: '60tr', stage: 100 }
  ]

  const payments = [
    { code: 'PM-00125', contract: 'HD-2025-0031', customer: 'Alpha', amount: '45tr', status: 'Đã nhận', date: '22/08' },
    { code: 'PM-00124', contract: 'HD-2025-0030', customer: 'Beta', amount: '30tr', status: 'Chờ duyệt', date: '21/08' }
  ]

  const projects = [
    { name: 'MiniApp Promo Alpha', progress: 80, owner: 'Team A' },
    { name: 'MiniApp Loyalty Beta', progress: 45, owner: 'Team B' },
    { name: 'MiniApp Booking Gama', progress: 20, owner: 'Team C' }
  ]

  const activities = [
    { time: 'Hôm nay • 10:15', text: 'Tạo hợp đồng HD-2025-0031 cho Alpha' },
    { time: 'Hôm nay • 09:00', text: 'Nhận yêu cầu báo giá từ Lê C' },
    { time: 'Hôm qua • 16:20', text: 'Ghi nhận thanh toán PM-00124 (chờ duyệt)' }
  ]

  // ====== UI ======
  return (
    <div className='space-y-6'>
      {/* Header row: Title + Quick actions */}
      <div className='flex flex-col justify-between gap-3 md:flex-row md:items-center'>
        <div>
          <h2 className='text-xl font-semibold text-gray-900 md:text-2xl'>Tổng quan quản trị</h2>
          <p className='text-sm text-gray-500'>Theo dõi báo giá, khách hàng, hợp đồng, thanh toán và tiến độ dự án.</p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <button className='rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50'>
            + Yêu cầu báo giá
          </button>
          <button className='rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50'>+ Khách hàng</button>
          <button className='rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600'>
            + Hợp đồng
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {kpis.map((k) => (
          <div key={k.label} className='rounded-2xl border bg-white p-4 shadow-sm'>
            <div className='flex items-start justify-between'>
              <span className='text-2xl'>{k.icon}</span>
              <span className='rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-600'>
                {k.delta}
              </span>
            </div>
            <div className='mt-4 text-2xl font-bold text-gray-900'>{k.value}</div>
            <div className='mt-1 text-sm text-gray-500'>{k.label}</div>
            {/* sparkline giả lập bằng thanh */}
            <div className='mt-4 flex items-end gap-1'>
              {[6, 12, 8, 14, 10, 18, 12].map((h, i) => (
                <div key={i} className='w-2 rounded-t bg-orange-200' style={{ height: `${h * 3}px` }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Main grids */}
      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Left column */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Recent quotes */}
          <div className='rounded-2xl border bg-white p-4 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>Yêu cầu báo giá gần đây</h3>
              <button className='text-sm font-medium text-orange-600 hover:underline'>Xem tất cả</button>
            </div>
            <div className='overflow-x-auto'>
              <table className='min-w-full text-left text-sm'>
                <thead>
                  <tr className='text-gray-500'>
                    <th className='whitespace-nowrap px-3 py-2 font-semibold'>Họ tên</th>
                    <th className='whitespace-nowrap px-3 py-2 font-semibold'>SĐT</th>
                    <th className='whitespace-nowrap px-3 py-2 font-semibold'>Email</th>
                    <th className='whitespace-nowrap px-3 py-2 font-semibold'>Lĩnh vực</th>
                    <th className='whitespace-nowrap px-3 py-2 font-semibold'>Kinh phí</th>
                    <th className='whitespace-nowrap px-3 py-2 font-semibold'>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {recentQuotes.map((q, idx) => (
                    <tr key={idx} className='border-t'>
                      <td className='px-3 py-2'>{q.name}</td>
                      <td className='px-3 py-2'>{q.phone}</td>
                      <td className='px-3 py-2'>{q.email}</td>
                      <td className='px-3 py-2'>{q.field}</td>
                      <td className='px-3 py-2'>{q.budget}</td>
                      <td className='px-3 py-2'>
                        <span className='rounded-full bg-gray-100 px-2 py-1 text-xs'>{q.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contracts pipeline */}
          <div className='rounded-2xl border bg-white p-4 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>Tiến độ hợp đồng</h3>
              <button className='text-sm font-medium text-orange-600 hover:underline'>Quản lý hợp đồng</button>
            </div>
            <ul className='space-y-4'>
              {contracts.map((c) => (
                <li key={c.code} className='rounded-xl border p-4'>
                  <div className='flex flex-wrap items-center justify-between gap-2'>
                    <div>
                      <div className='font-semibold'>{c.code}</div>
                      <div className='text-sm text-gray-500'>{c.customer}</div>
                    </div>
                    <div className='text-right'>
                      <div className='font-semibold text-gray-900'>{c.amount}</div>
                      <div className='text-xs text-gray-500'>Giá trị</div>
                    </div>
                  </div>
                  <div className='mt-3 h-2 w-full rounded-full bg-gray-100'>
                    <div
                      className='h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-500'
                      style={{ width: `${c.stage}%` }}
                    />
                  </div>
                  <div className='mt-1 text-right text-xs text-gray-500'>{c.stage}%</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right column */}
        <div className='space-y-6'>
          {/* Payments */}
          <div className='rounded-2xl border bg-white p-4 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>Thanh toán gần đây</h3>
              <button className='text-sm font-medium text-orange-600 hover:underline'>Xem tất cả</button>
            </div>
            <ul className='space-y-3'>
              {payments.map((p) => (
                <li key={p.code} className='flex items-center justify-between rounded-xl border p-3'>
                  <div>
                    <div className='font-medium'>
                      {p.code} • {p.customer}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {p.contract} • {p.date}
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='font-semibold text-gray-900'>{p.amount}</div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${p.status === 'Đã nhận' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                    >
                      {p.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects progress */}
          <div className='rounded-2xl border bg-white p-4 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>Tiến độ dự án</h3>
              <button className='text-sm font-medium text-orange-600 hover:underline'>Quản lý dự án</button>
            </div>
            <ul className='space-y-4'>
              {projects.map((p) => (
                <li key={p.name}>
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='font-medium'>{p.name}</div>
                      <div className='text-xs text-gray-500'>{p.owner}</div>
                    </div>
                    <div className='text-sm text-gray-700'>{p.progress}%</div>
                  </div>
                  <div className='mt-2 h-2 w-full rounded-full bg-gray-100'>
                    <div className='h-2 rounded-full bg-orange-400' style={{ width: `${p.progress}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Activity timeline */}
          <div className='rounded-2xl border bg-white p-4 shadow-sm'>
            <h3 className='mb-4 text-lg font-semibold'>Hoạt động gần đây</h3>
            <ol className='relative ml-3 space-y-5 border-l pl-6'>
              {activities.map((a, idx) => (
                <li key={idx}>
                  <span className='absolute -left-[9px] mt-1 block h-4 w-4 rounded-full border-2 border-white bg-orange-500 shadow' />
                  <div className='text-sm text-gray-500'>{a.time}</div>
                  <div className='text-sm font-medium text-gray-800'>{a.text}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
