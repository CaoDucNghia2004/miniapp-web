import { useMemo, useState } from 'react'

type PaymentStatus = 'Chờ duyệt' | 'Đã nhận' | 'Hoàn tiền' | 'Từ chối'
type PaymentMethod = 'Chuyển khoản' | 'Tiền mặt' | 'QR/Wallet' | 'Khác'

type Payment = {
  id: string
  contractId: string
  customer: string
  amount: number
  method: PaymentMethod
  note?: string
  dueDate: string
  paidAt?: string
  status: PaymentStatus
}

const BADGE: Record<PaymentStatus, string> = {
  'Chờ duyệt': 'bg-amber-100 text-amber-700',
  'Đã nhận': 'bg-emerald-100 text-emerald-700',
  'Hoàn tiền': 'bg-violet-100 text-violet-700',
  'Từ chối': 'bg-rose-100 text-rose-700'
}
const METHODS: PaymentMethod[] = ['Chuyển khoản', 'Tiền mặt', 'QR/Wallet', 'Khác']

const seed: Payment[] = [
  {
    id: 'PM-00125',
    contractId: 'HD-2025-0031',
    customer: 'Alpha',
    amount: 45000000,
    method: 'Chuyển khoản',
    note: 'Đợt 2',
    dueDate: '2025-08-22',
    paidAt: '2025-08-22',
    status: 'Đã nhận'
  },
  {
    id: 'PM-00124',
    contractId: 'HD-2025-0030',
    customer: 'Beta',
    amount: 30000000,
    method: 'QR/Wallet',
    note: 'Đợt 1',
    dueDate: '2025-08-21',
    status: 'Chờ duyệt'
  },
  {
    id: 'PM-00123',
    contractId: 'HD-2025-0029',
    customer: 'Gama',
    amount: 15000000,
    method: 'Tiền mặt',
    note: 'Bổ sung',
    dueDate: '2025-08-15',
    paidAt: '2025-08-16',
    status: 'Đã nhận'
  },
  {
    id: 'PM-00122',
    contractId: 'HD-2025-0028',
    customer: 'Omega',
    amount: 5000000,
    method: 'Khác',
    note: 'Hoàn tiền',
    dueDate: '2025-08-10',
    paidAt: '2025-08-11',
    status: 'Hoàn tiền'
  }
]

const fmt = (n: number) => n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })

export default function PaymentManagement() {
  const [data, setData] = useState<Payment[]>(seed)

  // ----- filters (đổi tên để tránh trùng) -----
  const [q, setQ] = useState('')
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | 'Tất cả'>('Tất cả')
  const [method, setMethod] = useState<PaymentMethod | 'Tất cả'>('Tất cả')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(8)

  // modal
  const [active, setActive] = useState<Payment | null>(null)

  const filtered = useMemo(() => {
    return data.filter((p) => {
      const hay = `${p.id} ${p.contractId} ${p.customer}`.toLowerCase()
      const okText = hay.includes(q.trim().toLowerCase())
      const okStatus = filterStatus === 'Tất cả' ? true : p.status === filterStatus
      const okMethod = method === 'Tất cả' ? true : p.method === method
      const okFrom = from ? p.dueDate >= from : true
      const okTo = to ? p.dueDate <= to : true
      return okText && okStatus && okMethod && okFrom && okTo
    })
  }, [data, q, filterStatus, method, from, to])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  // totals
  const totalAmount = filtered.reduce((s, p) => s + p.amount, 0)
  const totalReceived = filtered.filter((p) => p.status === 'Đã nhận').reduce((s, p) => s + p.amount, 0)
  const totalPending = filtered.filter((p) => p.status === 'Chờ duyệt').reduce((s, p) => s + p.amount, 0)

  // ----- actions (đổi tên hàm) -----
  const updatePaymentStatus = (id: string, next: PaymentStatus) => {
    setData((prev) =>
      prev.map((x) =>
        x.id === id
          ? { ...x, status: next, paidAt: next === 'Đã nhận' ? new Date().toISOString().slice(0, 10) : x.paidAt }
          : x
      )
    )
    setActive((prev) => (prev && prev.id === id ? { ...prev, status: next } : prev))
  }

  const exportCSV = () => {
    const headers = [
      'Mã',
      'Hợp đồng',
      'Khách hàng',
      'Số tiền',
      'Phương thức',
      'Ghi chú',
      'Due date',
      'Đã nhận lúc',
      'Trạng thái'
    ]
    const rows = filtered.map((p) => [
      p.id,
      p.contractId,
      p.customer,
      p.amount,
      p.method,
      p.note ?? '',
      p.dueDate,
      p.paidAt ?? '',
      p.status
    ])
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payments_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col justify-between gap-3 md:flex-row md:items-center'>
        <div>
          <h2 className='text-xl font-semibold text-gray-900 md:text-2xl'>Quản lý thanh toán</h2>
          <p className='text-sm text-gray-500'>Theo dõi các lần thu/chi liên quan hợp đồng.</p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <div className='rounded-lg border px-3 py-2 text-sm'>
            Tổng: <span className='font-semibold'>{fmt(totalAmount)}</span>
          </div>
          <div className='rounded-lg border px-3 py-2 text-sm'>
            Đã nhận: <span className='font-semibold text-emerald-600'>{fmt(totalReceived)}</span>
          </div>
          <div className='rounded-lg border px-3 py-2 text-sm'>
            Chờ duyệt: <span className='font-semibold text-amber-600'>{fmt(totalPending)}</span>
          </div>
          <button
            onClick={exportCSV}
            className='rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600'
          >
            ⬇️ Xuất CSV
          </button>
        </div>
      </div>

      {/* Filters */}
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
            placeholder='Tìm theo mã, hợp đồng, khách hàng…'
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setFilterStatus(e.target.value as any)
            setPage(1)
          }}
          className='rounded-xl border px-3 py-2 text-sm'
        >
          <option value='Tất cả'>Tất cả trạng thái</option>
          {(['Chờ duyệt', 'Đã nhận', 'Hoàn tiền', 'Từ chối'] as PaymentStatus[]).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={method}
          onChange={(e) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setMethod(e.target.value as any)
            setPage(1)
          }}
          className='rounded-xl border px-3 py-2 text-sm'
        >
          <option value='Tất cả'>Tất cả phương thức</option>
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
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

      {/* Table */}
      <div className='rounded-2xl border bg-white p-0 shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-left text-sm'>
            <thead className='sticky top-0 bg-gray-50 text-gray-500'>
              <tr>
                <th className='px-4 py-3 font-semibold'>Mã/ Hợp đồng</th>
                <th className='px-4 py-3 font-semibold'>Khách hàng</th>
                <th className='px-4 py-3 font-semibold'>Số tiền</th>
                <th className='px-4 py-3 font-semibold'>Phương thức</th>
                <th className='px-4 py-3 font-semibold'>Due date</th>
                <th className='px-4 py-3 font-semibold'>Đã nhận lúc</th>
                <th className='px-4 py-3 font-semibold'>Trạng thái</th>
                <th className='px-4 py-3 font-semibold text-right'>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((p) => (
                <tr key={p.id} className='border-t'>
                  <td className='px-4 py-3'>
                    <div className='font-semibold'>{p.id}</div>
                    <div className='text-xs text-gray-500'>{p.contractId}</div>
                  </td>
                  <td className='px-4 py-3'>{p.customer}</td>
                  <td className='px-4 py-3'>{fmt(p.amount)}</td>
                  <td className='px-4 py-3'>{p.method}</td>
                  <td className='px-4 py-3'>{p.dueDate}</td>
                  <td className='px-4 py-3'>{p.paidAt || '-'}</td>
                  <td className='px-4 py-3'>
                    <span className={`rounded-full px-2 py-1 text-xs ${BADGE[p.status]}`}>{p.status}</span>
                  </td>
                  <td className='px-4 py-3 text-right'>
                    <div className='flex justify-end gap-2'>
                      <button
                        onClick={() => setActive(p)}
                        className='rounded-lg border px-2 py-1 text-xs hover:bg-gray-50'
                      >
                        Chi tiết
                      </button>
                      {p.status !== 'Đã nhận' && (
                        <button
                          onClick={() => updatePaymentStatus(p.id, 'Đã nhận')}
                          className='rounded-lg bg-emerald-500 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-600'
                        >
                          Xác nhận nhận
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={8} className='px-4 py-8 text-center text-sm text-gray-500'>
                    Không có thanh toán phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='flex items-center justify-between gap-2 border-t px-4 py-3'>
          <div className='text-sm text-gray-500'>
            Tổng <span className='font-semibold text-gray-700'>{filtered.length}</span> giao dịch
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

      {/* Modal detail */}
      {active && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4'>
          <div className='w-full max-w-2xl rounded-2xl border bg-white p-5 shadow-lg'>
            <div className='mb-3 flex items-center justify-between'>
              <h4 className='text-lg font-semibold'>Chi tiết thanh toán • {active.id}</h4>
              <button
                onClick={() => setActive(null)}
                className='rounded-full px-2 py-1 text-xl leading-none hover:bg-gray-100'
              >
                ×
              </button>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <Field label='Hợp đồng' value={active.contractId} />
              <Field label='Khách hàng' value={active.customer} />
              <Field label='Số tiền' value={fmt(active.amount)} />
              <Field label='Phương thức' value={active.method} />
              <Field label='Due date' value={active.dueDate} />
              <Field label='Đã nhận lúc' value={active.paidAt || '-'} />
              <div className='md:col-span-2'>
                <div className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Ghi chú</div>
                <div className='mt-1 rounded-xl border bg-gray-50 p-3 text-sm text-gray-800'>{active.note || '-'}</div>
              </div>
              <div className='md:col-span-2'>
                <div className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Trạng thái</div>
                <div className='mt-2 flex flex-wrap gap-2'>
                  {(['Chờ duyệt', 'Đã nhận', 'Hoàn tiền', 'Từ chối'] as PaymentStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => updatePaymentStatus(active.id, s)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${active.status === s ? BADGE[s] : 'border'}`}
                    >
                      {s}
                    </button>
                  ))}
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
