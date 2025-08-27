import { useMemo, useState } from 'react'

type ContractStatus = 'Nháp' | 'Đã gửi' | 'Đã ký' | 'Đang triển khai' | 'Tạm dừng' | 'Hoàn tất' | 'Huỷ'

type Contract = {
  id: string // HD-2025-0001
  title: string // tên ngắn gọn
  customer: string
  value: number // tổng giá trị (VND)
  unpaid: number // còn phải thu (VND)
  manager?: string
  startDate: string // YYYY-MM-DD
  endDate?: string
  progress: number // %
  status: ContractStatus
  notes?: string
}

const STATUS: ContractStatus[] = ['Nháp', 'Đã gửi', 'Đã ký', 'Đang triển khai', 'Tạm dừng', 'Hoàn tất', 'Huỷ']

const BADGE: Record<ContractStatus, string> = {
  Nháp: 'bg-gray-100 text-gray-700',
  'Đã gửi': 'bg-blue-100 text-blue-700',
  'Đã ký': 'bg-emerald-100 text-emerald-700',
  'Đang triển khai': 'bg-amber-100 text-amber-700',
  'Tạm dừng': 'bg-violet-100 text-violet-700',
  'Hoàn tất': 'bg-teal-100 text-teal-700',
  Huỷ: 'bg-rose-100 text-rose-700'
}

// ===== Dummy data (thay bằng API) =====
const seed: Contract[] = [
  {
    id: 'HD-2025-0031',
    title: 'MiniApp Loyalty Alpha',
    customer: 'Công ty Alpha',
    value: 95000000,
    unpaid: 45000000,
    manager: 'Lan',
    startDate: '2025-08-10',
    endDate: '',
    progress: 70,
    status: 'Đang triển khai',
    notes: 'Module loyalty hoàn thành, chờ tích hợp thanh toán.'
  },
  {
    id: 'HD-2025-0030',
    title: 'MiniApp Booking Beta',
    customer: 'Công ty Beta',
    value: 120000000,
    unpaid: 90000000,
    manager: 'Minh',
    startDate: '2025-08-05',
    endDate: '',
    progress: 35,
    status: 'Đã ký'
  },
  {
    id: 'HD-2025-0029',
    title: 'MiniApp Promo Gama',
    customer: 'Cửa hàng Gama',
    value: 60000000,
    unpaid: 0,
    manager: 'Huy',
    startDate: '2025-07-10',
    endDate: '2025-08-15',
    progress: 100,
    status: 'Hoàn tất'
  }
]

// Helpers
const fmt = (n: number) => n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })

export default function ContractManagement() {
  // dữ liệu
  const [data, setData] = useState<Contract[]>(seed)

  // filter
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<ContractStatus | 'Tất cả'>('Tất cả')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(8)

  // modal
  const [active, setActive] = useState<Contract | null>(null)

  const filtered = useMemo(() => {
    return data.filter((c) => {
      const hay = `${c.id} ${c.title} ${c.customer} ${c.manager ?? ''}`.toLowerCase()
      const okText = hay.includes(q.trim().toLowerCase())
      const okStatus = status === 'Tất cả' ? true : c.status === status
      const okFrom = from ? c.startDate >= from : true
      const okTo = to ? (c.endDate ? c.endDate <= to : c.startDate <= to) : true
      return okText && okStatus && okFrom && okTo
    })
  }, [data, q, status, from, to])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  // hành động
  const updateStatus = (id: string, next: ContractStatus) => {
    setData((prev) => prev.map((x) => (x.id === id ? { ...x, status: next } : x)))
    setActive((prev) => (prev && prev.id === id ? { ...prev, status: next } : prev))
  }

  const updateProgress = (id: string, next: number) => {
    const v = Math.max(0, Math.min(100, Math.round(next)))
    setData((prev) => prev.map((x) => (x.id === id ? { ...x, progress: v } : x)))
    setActive((prev) => (prev && prev.id === id ? { ...prev, progress: v } : prev))
  }

  const exportCSV = () => {
    const headers = [
      'Mã HĐ',
      'Tiêu đề',
      'Khách hàng',
      'Giá trị',
      'Còn phải thu',
      'Quản lý',
      'Bắt đầu',
      'Kết thúc',
      'Tiến độ',
      'Trạng thái'
    ]
    const rows = filtered.map((c) => [
      c.id,
      c.title,
      c.customer,
      c.value,
      c.unpaid,
      c.manager ?? '',
      c.startDate,
      c.endDate ?? '',
      c.progress + '%',
      c.status
    ])
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contracts_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // tổng quan nhanh
  const totalValue = filtered.reduce((s, c) => s + c.value, 0)
  const totalUnpaid = filtered.reduce((s, c) => s + c.unpaid, 0)

  return (
    <div className='space-y-6'>
      {/* header */}
      <div className='flex flex-col justify-between gap-3 md:flex-row md:items-center'>
        <div>
          <h2 className='text-xl font-semibold text-gray-900 md:text-2xl'>Quản lý hợp đồng</h2>
          <p className='text-sm text-gray-500'>Theo dõi pipeline, giá trị HĐ và tiến độ triển khai.</p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <div className='rounded-lg border px-3 py-2 text-sm'>
            Giá trị: <span className='font-semibold'>{fmt(totalValue)}</span>
          </div>
          <div className='rounded-lg border px-3 py-2 text-sm'>
            Còn phải thu: <span className='font-semibold text-rose-600'>{fmt(totalUnpaid)}</span>
          </div>
          <button
            onClick={exportCSV}
            className='rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600'
          >
            ⬇️ Xuất CSV
          </button>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className='grid gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-5'>
        <div className='md:col-span-2 flex items-center gap-2 rounded-xl border px-3 py-2'>
          <span>🔎</span>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setPage(1)
            }}
            className='w-full bg-transparent text-sm outline-none placeholder:text-gray-400'
            placeholder='Tìm theo mã HĐ, tiêu đề, khách hàng, quản lý…'
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setStatus(e.target.value as any)
            setPage(1)
          }}
          className='rounded-xl border px-3 py-2 text-sm'
        >
          <option value='Tất cả'>Tất cả trạng thái</option>
          {STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          value={from}
          onChange={(e) => {
            setFrom(e.target.value)
            setPage(1)
          }}
          type='date'
          className='rounded-xl border px-3 py-2 text-sm'
        />
        <input
          value={to}
          onChange={(e) => {
            setTo(e.target.value)
            setPage(1)
          }}
          type='date'
          className='rounded-xl border px-3 py-2 text-sm'
        />
      </div>

      {/* Bảng */}
      <div className='rounded-2xl border bg-white p-0 shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-left text-sm'>
            <thead className='sticky top-0 bg-gray-50 text-gray-500'>
              <tr>
                <th className='px-4 py-3 font-semibold'>Mã / Tiêu đề</th>
                <th className='px-4 py-3 font-semibold'>Khách hàng</th>
                <th className='px-4 py-3 font-semibold'>Giá trị</th>
                <th className='px-4 py-3 font-semibold'>Còn phải thu</th>
                <th className='px-4 py-3 font-semibold'>QL phụ trách</th>
                <th className='px-4 py-3 font-semibold'>Bắt đầu</th>
                <th className='px-4 py-3 font-semibold'>Tiến độ</th>
                <th className='px-4 py-3 font-semibold'>Trạng thái</th>
                <th className='px-4 py-3 font-semibold text-right'>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((c) => (
                <tr key={c.id} className='border-t'>
                  <td className='px-4 py-3'>
                    <div className='font-semibold'>{c.id}</div>
                    <div className='text-xs text-gray-500'>{c.title}</div>
                  </td>
                  <td className='px-4 py-3'>{c.customer}</td>
                  <td className='px-4 py-3'>{fmt(c.value)}</td>
                  <td className='px-4 py-3'>
                    <span className={c.unpaid > 0 ? 'text-rose-600' : ''}>{fmt(c.unpaid)}</span>
                  </td>
                  <td className='px-4 py-3'>{c.manager ?? '-'}</td>
                  <td className='px-4 py-3'>{c.startDate}</td>
                  <td className='px-4 py-3 w-48'>
                    <div className='flex items-center gap-2'>
                      <div className='h-2 w-full rounded-full bg-gray-100'>
                        <div
                          className='h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-500'
                          style={{ width: `${c.progress}%` }}
                        />
                      </div>
                      <div className='w-10 text-right text-xs text-gray-600'>{c.progress}%</div>
                    </div>
                  </td>
                  <td className='px-4 py-3'>
                    <span className={`rounded-full px-2 py-1 text-xs ${BADGE[c.status]}`}>{c.status}</span>
                  </td>
                  <td className='px-4 py-3 text-right'>
                    <div className='flex justify-end gap-2'>
                      <button
                        onClick={() => setActive(c)}
                        className='rounded-lg border px-2 py-1 text-xs hover:bg-gray-50'
                      >
                        Chi tiết
                      </button>
                      {c.status !== 'Hoàn tất' && c.status !== 'Huỷ' && (
                        <button
                          onClick={() => updateStatus(c.id, 'Hoàn tất')}
                          className='rounded-lg bg-teal-500 px-2 py-1 text-xs font-semibold text-white hover:bg-teal-600'
                        >
                          Hoàn tất
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={9} className='px-4 py-8 text-center text-sm text-gray-500'>
                    Không có hợp đồng phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className='flex items-center justify-between gap-2 border-top px-4 py-3 border-t'>
          <div className='text-sm text-gray-500'>
            Tổng <span className='font-semibold text-gray-700'>{filtered.length}</span> hợp đồng
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className='rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50'
            >
              Trước
            </button>
            <div className='text-sm'>
              Trang <span className='font-semibold'>{page}</span> / {totalPages}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className='rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50'
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Modal chi tiết / cập nhật */}
      {active && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4'>
          <div className='w-full max-w-3xl rounded-2xl border bg-white p-5 shadow-lg'>
            <div className='mb-3 flex items-center justify-between'>
              <h4 className='text-lg font-semibold'>Chi tiết hợp đồng • {active.id}</h4>
              <button
                onClick={() => setActive(null)}
                className='rounded-full px-2 py-1 text-xl leading-none hover:bg-gray-100'
              >
                ×
              </button>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <Field label='Tiêu đề' value={active.title} />
              <Field label='Khách hàng' value={active.customer} />
              <Field label='Giá trị' value={fmt(active.value)} />
              <Field label='Còn phải thu' value={fmt(active.unpaid)} />
              <Field label='Quản lý phụ trách' value={active.manager ?? '-'} />
              <Field label='Bắt đầu' value={active.startDate} />
              <Field label='Kết thúc' value={active.endDate || '-'} />
              <div className='md:col-span-2'>
                <div className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Ghi chú</div>
                <div className='mt-1 rounded-xl border bg-gray-50 p-3 text-sm text-gray-800'>{active.notes || '-'}</div>
              </div>
              {/* Trạng thái */}
              <div className='md:col-span-2'>
                <div className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Trạng thái</div>
                <div className='mt-2 flex flex-wrap gap-2'>
                  {STATUS.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(active.id, s)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${active.status === s ? BADGE[s] : 'border'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {/* Tiến độ */}
              <div className='md:col-span-2'>
                <div className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Tiến độ (%)</div>
                <div className='mt-2 flex items-center gap-3'>
                  <input
                    type='range'
                    min={0}
                    max={100}
                    value={active.progress}
                    onChange={(e) => updateProgress(active.id, Number(e.target.value))}
                    className='w-full'
                  />
                  <div className='w-12 text-right text-sm text-gray-700'>{active.progress}%</div>
                </div>
                <div className='mt-2 h-2 w-full rounded-full bg-gray-100'>
                  <div className='h-2 rounded-full bg-orange-400' style={{ width: `${active.progress}%` }} />
                </div>
              </div>
            </div>

            <div className='mt-5 flex justify-end'>
              <button onClick={() => setActive(null)} className='rounded-lg border px-4 py-2 text-sm hover:bg-gray-50'>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className='text-xs font-semibold uppercase tracking-wide text-gray-500'>{label}</div>
      <div className='mt-1 text-sm text-gray-800'>{value || '-'}</div>
    </div>
  )
}
