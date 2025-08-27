import { useMemo, useState } from 'react'

type QuoteStatus = 'Mới' | 'Đang báo giá' | 'Chờ khách duyệt' | 'Đã chốt' | 'Từ chối'

type Quote = {
  id: string
  name: string
  phone: string
  email: string
  field: string
  description: string
  budget: string
  createdAt: string // YYYY-MM-DD
  status: QuoteStatus
}

const STATUS_OPTIONS: QuoteStatus[] = ['Mới', 'Đang báo giá', 'Chờ khách duyệt', 'Đã chốt', 'Từ chối']

const statusStyles: Record<QuoteStatus, string> = {
  Mới: 'bg-blue-100 text-blue-700',
  'Đang báo giá': 'bg-amber-100 text-amber-700',
  'Chờ khách duyệt': 'bg-violet-100 text-violet-700',
  'Đã chốt': 'bg-emerald-100 text-emerald-700',
  'Từ chối': 'bg-rose-100 text-rose-700'
}

// ===== Dummy data (thay bằng API thật) =====
const seed: Quote[] = [
  {
    id: 'Q-001',
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    email: 'vana@gmail.com',
    field: 'Bán hàng',
    description: 'Xây dựng miniapp tư vấn dịch vụ và chăm sóc khách hàng, ưu tiên giao diện sáng.',
    budget: '10-20tr',
    createdAt: '2025-08-20',
    status: 'Đang báo giá'
  },
  {
    id: 'Q-002',
    name: 'Trần Thị B',
    phone: '0987xxxxxx',
    email: 'tranb@example.com',
    field: 'Tiện ích',
    description: 'Miniapp nhắc lịch + loyalty.',
    budget: '20-30tr',
    createdAt: '2025-08-19',
    status: 'Chờ khách duyệt'
  },
  {
    id: 'Q-003',
    name: 'Lê C',
    phone: '0909xxxxxx',
    email: 'lec@example.com',
    field: 'Giáo dục',
    description: 'Đăng ký khóa học, thanh toán online.',
    budget: '>50tr',
    createdAt: '2025-08-17',
    status: 'Mới'
  },
  {
    id: 'Q-004',
    name: 'Công ty Alpha',
    phone: '0912xxxxxx',
    email: 'contact@alpha.vn',
    field: 'Thương mại',
    description: 'Miniapp đặt hàng + theo dõi đơn.',
    budget: '30-40tr',
    createdAt: '2025-08-16',
    status: 'Đã chốt'
  },
  {
    id: 'Q-005',
    name: 'Cửa hàng Gama',
    phone: '0933xxxxxx',
    email: 'hello@gama.vn',
    field: 'F&B',
    description: 'Đặt bàn + review.',
    budget: '10-20tr',
    createdAt: '2025-08-15',
    status: 'Từ chối'
  }
]

export default function AdminQuotes() {
  // state lọc & tìm kiếm
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<QuoteStatus | 'Tất cả'>('Tất cả')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(8)

  // state modal
  const [active, setActive] = useState<Quote | null>(null)

  const [data, setData] = useState<Quote[]>(seed)

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const text = `${item.name} ${item.email} ${item.phone} ${item.field}`.toLowerCase()
      const okText = text.includes(q.trim().toLowerCase())
      const okStatus = status === 'Tất cả' ? true : item.status === status
      const okFrom = from ? item.createdAt >= from : true
      const okTo = to ? item.createdAt <= to : true
      return okText && okStatus && okFrom && okTo
    })
  }, [data, q, status, from, to])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  // hành động: cập nhật trạng thái
  const updateStatus = (id: string, next: QuoteStatus) => {
    setData((prev) => prev.map((x) => (x.id === id ? { ...x, status: next } : x)))
    setActive((prev) => (prev && prev.id === id ? { ...prev, status: next } : prev))
  }

  // export CSV
  const exportCSV = () => {
    const headers = ['ID', 'Họ tên', 'SĐT', 'Email', 'Lĩnh vực', 'Mô tả', 'Kinh phí', 'Ngày tạo', 'Trạng thái']
    const rows = filtered.map((r) => [
      r.id,
      r.name,
      r.phone,
      r.email,
      r.field,
      r.description.replace(/\n/g, ' '),
      r.budget,
      r.createdAt,
      r.status
    ])
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quotes_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className='space-y-6'>
      {/* header + actions */}
      <div className='flex flex-col justify-between gap-3 md:flex-row md:items-center'>
        <div>
          <h2 className='text-xl font-semibold text-gray-900 md:text-2xl'>Quản lý yêu cầu báo giá</h2>
          <p className='text-sm text-gray-500'>Theo dõi, lọc và xử lý các yêu cầu từ khách hàng.</p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <button className='rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50'>+ Tạo thủ công</button>
          <button
            onClick={exportCSV}
            className='rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600'
          >
            ⬇️ Xuất CSV
          </button>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className='grid gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-4'>
        <div className='md:col-span-2 flex items-center gap-2 rounded-xl border px-3 py-2'>
          <span>🔎</span>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setPage(1)
            }}
            className='w-full bg-transparent text-sm outline-none placeholder:text-gray-400'
            placeholder='Tìm theo tên, email, SĐT, lĩnh vực…'
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
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className='grid grid-cols-2 gap-2'>
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
      </div>

      {/* Bảng */}
      <div className='rounded-2xl border bg-white p-0 shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-left text-sm'>
            <thead className='sticky top-0 bg-gray-50 text-gray-500'>
              <tr>
                <th className='px-4 py-3 font-semibold'>Khách hàng</th>
                <th className='px-4 py-3 font-semibold'>Liên hệ</th>
                <th className='px-4 py-3 font-semibold'>Lĩnh vực</th>
                <th className='px-4 py-3 font-semibold'>Kinh phí</th>
                <th className='px-4 py-3 font-semibold'>Ngày tạo</th>
                <th className='px-4 py-3 font-semibold'>Trạng thái</th>
                <th className='px-4 py-3 font-semibold text-right'>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((r) => (
                <tr key={r.id} className='border-t'>
                  <td className='px-4 py-3'>
                    <div className='font-medium text-gray-900'>{r.name}</div>
                    <div className='line-clamp-1 max-w-[380px] text-xs text-gray-500'>{r.description}</div>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='text-sm'>{r.phone}</div>
                    <div className='text-xs text-gray-500'>{r.email}</div>
                  </td>
                  <td className='px-4 py-3'>{r.field}</td>
                  <td className='px-4 py-3'>{r.budget}</td>
                  <td className='px-4 py-3'>{r.createdAt}</td>
                  <td className='px-4 py-3'>
                    <span className={`rounded-full px-2 py-1 text-xs ${statusStyles[r.status]}`}>{r.status}</span>
                  </td>
                  <td className='px-4 py-3 text-right'>
                    <div className='flex justify-end gap-2'>
                      <button
                        onClick={() => setActive(r)}
                        className='rounded-lg border px-2 py-1 text-xs hover:bg-gray-50'
                      >
                        Chi tiết
                      </button>
                      {r.status !== 'Đã chốt' && (
                        <button
                          onClick={() => updateStatus(r.id, 'Đã chốt')}
                          className='rounded-lg bg-emerald-500 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-600'
                        >
                          Chốt
                        </button>
                      )}
                      {r.status !== 'Từ chối' && (
                        <button
                          onClick={() => updateStatus(r.id, 'Từ chối')}
                          className='rounded-lg bg-rose-500 px-2 py-1 text-xs font-semibold text-white hover:bg-rose-600'
                        >
                          Từ chối
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={7} className='px-4 py-8 text-center text-sm text-gray-500'>
                    Không có dữ liệu phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className='flex items-center justify-between gap-2 border-t px-4 py-3'>
          <div className='text-sm text-gray-500'>
            Tổng <span className='font-semibold text-gray-700'>{filtered.length}</span> yêu cầu
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

      {/* Modal chi tiết */}
      {active && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4'>
          <div className='w-full max-w-2xl rounded-2xl border bg-white p-5 shadow-lg'>
            <div className='mb-3 flex items-center justify-between'>
              <h4 className='text-lg font-semibold'>Chi tiết yêu cầu • {active.id}</h4>
              <button
                onClick={() => setActive(null)}
                className='rounded-full px-2 py-1 text-xl leading-none hover:bg-gray-100'
              >
                ×
              </button>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <Field label='Họ tên' value={active.name} />
              <Field label='Số điện thoại' value={active.phone} />
              <Field label='Email' value={active.email} />
              <Field label='Lĩnh vực' value={active.field} />
              <Field label='Kinh phí dự kiến' value={active.budget} />
              <Field label='Ngày tạo' value={active.createdAt} />
              <div className='md:col-span-2'>
                <div className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Mô tả dự án</div>
                <div className='mt-1 rounded-xl border bg-gray-50 p-3 text-sm text-gray-800'>{active.description}</div>
              </div>
              <div className='md:col-span-2'>
                <div className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Trạng thái</div>
                <div className='mt-2 flex flex-wrap gap-2'>
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(active.id, s)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${active.status === s ? statusStyles[s] : 'border'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className='mt-5 flex justify-end gap-2'>
              <button onClick={() => setActive(null)} className='rounded-lg border px-4 py-2 text-sm hover:bg-gray-50'>
                Đóng
              </button>
              <button
                onClick={() => setActive(null)}
                className='rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600'
              >
                Lưu thay đổi
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
