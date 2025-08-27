import { useMemo, useState } from 'react'

type TxType = 'Thu' | 'Chi'
type TxStatus = 'Thành công' | 'Chờ xử lý' | 'Thất bại'
type TxMethod = 'Chuyển khoản' | 'Tiền mặt' | 'QR/Wallet' | 'Khác'

type Transaction = {
  id: string // TX-00001
  date: string // YYYY-MM-DD
  type: TxType
  amount: number // VND (+ thu, - chi), nhưng hiển thị theo type
  method: TxMethod
  contractId?: string
  customer?: string
  reference?: string // mã tham chiếu ngân hàng/ghi chú ngắn
  status: TxStatus
  note?: string
}

const STATUS_BADGE: Record<TxStatus, string> = {
  'Thành công': 'bg-emerald-100 text-emerald-700',
  'Chờ xử lý': 'bg-amber-100 text-amber-700',
  'Thất bại': 'bg-rose-100 text-rose-700'
}
const METHODS: TxMethod[] = ['Chuyển khoản', 'Tiền mặt', 'QR/Wallet', 'Khác']
const TYPES: TxType[] = ['Thu', 'Chi']

// ===== Dummy data (thay bằng API) =====
const seed: Transaction[] = [
  {
    id: 'TX-00130',
    date: '2025-08-22',
    type: 'Thu',
    amount: 45000000,
    method: 'Chuyển khoản',
    contractId: 'HD-2025-0031',
    customer: 'Alpha',
    reference: 'FT123456VN',
    status: 'Thành công',
    note: 'Đợt 2 HĐ 0031'
  },
  {
    id: 'TX-00129',
    date: '2025-08-21',
    type: 'Thu',
    amount: 30000000,
    method: 'QR/Wallet',
    contractId: 'HD-2025-0030',
    customer: 'Beta',
    reference: 'MOMO-8842',
    status: 'Chờ xử lý',
    note: 'Đợt 1 HĐ 0030'
  },
  {
    id: 'TX-00128',
    date: '2025-08-20',
    type: 'Chi',
    amount: 5000000,
    method: 'Tiền mặt',
    reference: 'Chi tạm ứng dev',
    status: 'Thành công'
  },
  {
    id: 'TX-00127',
    date: '2025-08-16',
    type: 'Thu',
    amount: 15000000,
    method: 'Tiền mặt',
    contractId: 'HD-2025-0029',
    customer: 'Gama',
    reference: 'RV-7788',
    status: 'Thành công'
  },
  {
    id: 'TX-00126',
    date: '2025-08-11',
    type: 'Chi',
    amount: 1200000,
    method: 'Khác',
    reference: 'Phí dịch vụ',
    status: 'Thành công'
  },
  {
    id: 'TX-00125',
    date: '2025-08-09',
    type: 'Thu',
    amount: 8000000,
    method: 'Chuyển khoản',
    customer: 'Omega',
    contractId: 'HD-2025-0028',
    reference: 'FT998877',
    status: 'Thất bại',
    note: 'Ngân hàng từ chối'
  }
]

const fmtMoney = (n: number) =>
  n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })

export default function TransactionHistory() {
  const [data] = useState<Transaction[]>(seed)

  // filters
  const [q, setQ] = useState('')
  const [type, setType] = useState<TxType | 'Tất cả'>('Tất cả')
  const [status, setStatus] = useState<TxStatus | 'Tất cả'>('Tất cả')
  const [method, setMethod] = useState<TxMethod | 'Tất cả'>('Tất cả')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [minAmount, setMinAmount] = useState<string>('') // string để dễ nhập liệu
  const [maxAmount, setMaxAmount] = useState<string>('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  // modal
  const [active, setActive] = useState<Transaction | null>(null)

  const filtered = useMemo(() => {
    const min = minAmount ? Number(minAmount) : Number.NEGATIVE_INFINITY
    const max = maxAmount ? Number(maxAmount) : Number.POSITIVE_INFINITY

    return data.filter((t) => {
      const hay = `${t.id} ${t.contractId ?? ''} ${t.customer ?? ''} ${t.reference ?? ''} ${t.note ?? ''}`.toLowerCase()
      const okText = hay.includes(q.trim().toLowerCase())
      const okType = type === 'Tất cả' ? true : t.type === type
      const okStatus = status === 'Tất cả' ? true : t.status === status
      const okMethod = method === 'Tất cả' ? true : t.method === method
      const okFrom = from ? t.date >= from : true
      const okTo = to ? t.date <= to : true
      const signedAmount = t.type === 'Chi' ? -t.amount : t.amount // để range có ý nghĩa 2 chiều
      const okMin = signedAmount >= min
      const okMax = signedAmount <= max

      return okText && okType && okStatus && okMethod && okFrom && okTo && okMin && okMax
    })
  }, [data, q, type, status, method, from, to, minAmount, maxAmount])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  // KPI
  const totalIncome = filtered
    .filter((t) => t.type === 'Thu' && t.status === 'Thành công')
    .reduce((s, t) => s + t.amount, 0)
  const totalExpense = filtered
    .filter((t) => t.type === 'Chi' && t.status === 'Thành công')
    .reduce((s, t) => s + t.amount, 0)
  const net = totalIncome - totalExpense

  const exportCSV = () => {
    const headers = [
      'Mã GD',
      'Ngày',
      'Loại',
      'Số tiền',
      'Phương thức',
      'Hợp đồng',
      'Khách hàng',
      'Tham chiếu',
      'Trạng thái',
      'Ghi chú'
    ]
    const rows = filtered.map((t) => [
      t.id,
      t.date,
      t.type,
      t.amount,
      t.method,
      t.contractId ?? '',
      t.customer ?? '',
      t.reference ?? '',
      t.status,
      t.note ?? ''
    ])
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className='space-y-6'>
      {/* Header + KPI */}
      <div className='flex flex-col justify-between gap-3 md:flex-row md:items-center'>
        <div>
          <h2 className='text-xl font-semibold text-gray-900 md:text-2xl'>Lịch sử giao dịch</h2>
          <p className='text-sm text-gray-500'>Theo dõi tất cả giao dịch thu/chi liên quan hệ thống.</p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <div className='rounded-lg border px-3 py-2 text-sm'>
            Thu (OK): <span className='font-semibold text-emerald-700'>{fmtMoney(totalIncome)}</span>
          </div>
          <div className='rounded-lg border px-3 py-2 text-sm'>
            Chi (OK): <span className='font-semibold text-rose-700'>{fmtMoney(totalExpense)}</span>
          </div>
          <div className='rounded-lg border px-3 py-2 text-sm'>
            Net:{' '}
            <span className={`font-semibold ${net >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>{fmtMoney(net)}</span>
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
      <div className='grid gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-7'>
        <div className='md:col-span-2 flex items-center gap-2 rounded-xl border px-3 py-2'>
          <span>🔎</span>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setPage(1)
            }}
            className='w-full bg-transparent text-sm outline-none placeholder:text-gray-400'
            placeholder='Tìm theo mã GD, HĐ, KH, tham chiếu…'
          />
        </div>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as any)
            setPage(1)
          }}
          className='rounded-xl border px-3 py-2 text-sm'
        >
          <option value='Tất cả'>Tất cả loại</option>
          {TYPES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as any)
            setPage(1)
          }}
          className='rounded-xl border px-3 py-2 text-sm'
        >
          <option value='Tất cả'>Tất cả trạng thái</option>
          {(['Thành công', 'Chờ xử lý', 'Thất bại'] as TxStatus[]).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={method}
          onChange={(e) => {
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
        <div className='grid grid-cols-2 gap-2'>
          <input
            value={minAmount}
            onChange={(e) => {
              setMinAmount(e.target.value.replace(/[^\d-]/g, ''))
              setPage(1)
            }}
            type='text'
            inputMode='numeric'
            placeholder='Min (±VND)'
            className='rounded-xl border px-3 py-2 text-sm'
          />
          <input
            value={maxAmount}
            onChange={(e) => {
              setMaxAmount(e.target.value.replace(/[^\d-]/g, ''))
              setPage(1)
            }}
            type='text'
            inputMode='numeric'
            placeholder='Max (±VND)'
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
                <th className='px-4 py-3 font-semibold'>Mã GD / Ngày</th>
                <th className='px-4 py-3 font-semibold'>Loại</th>
                <th className='px-4 py-3 font-semibold'>Số tiền</th>
                <th className='px-4 py-3 font-semibold'>Phương thức</th>
                <th className='px-4 py-3 font-semibold'>Hợp đồng</th>
                <th className='px-4 py-3 font-semibold'>Khách hàng</th>
                <th className='px-4 py-3 font-semibold'>Trạng thái</th>
                <th className='px-4 py-3 font-semibold text-right'>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((t) => (
                <tr key={t.id} className='border-t'>
                  <td className='px-4 py-3'>
                    <div className='font-semibold'>{t.id}</div>
                    <div className='text-xs text-gray-500'>{t.date}</div>
                  </td>
                  <td className='px-4 py-3'>{t.type}</td>
                  <td className={`px-4 py-3 ${t.type === 'Thu' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {t.type === 'Thu' ? '+' : '-'}
                    {fmtMoney(t.amount)}
                  </td>
                  <td className='px-4 py-3'>{t.method}</td>
                  <td className='px-4 py-3'>{t.contractId || '-'}</td>
                  <td className='px-4 py-3'>{t.customer || '-'}</td>
                  <td className='px-4 py-3'>
                    <span className={`rounded-full px-2 py-1 text-xs ${STATUS_BADGE[t.status]}`}>{t.status}</span>
                  </td>
                  <td className='px-4 py-3 text-right'>
                    <button
                      onClick={() => setActive(t)}
                      className='rounded-lg border px-2 py-1 text-xs hover:bg-gray-50'
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={8} className='px-4 py-8 text-center text-sm text-gray-500'>
                    Không có giao dịch phù hợp
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
              <h4 className='text-lg font-semibold'>Chi tiết giao dịch • {active.id}</h4>
              <button
                onClick={() => setActive(null)}
                className='rounded-full px-2 py-1 text-xl leading-none hover:bg-gray-100'
              >
                ×
              </button>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <Field label='Ngày' value={active.date} />
              <Field label='Loại' value={active.type} />
              <Field label='Số tiền' value={`${active.type === 'Thu' ? '+' : '-'}${fmtMoney(active.amount)}`} />
              <Field label='Phương thức' value={active.method} />
              <Field label='Hợp đồng' value={active.contractId || '-'} />
              <Field label='Khách hàng' value={active.customer || '-'} />
              <Field label='Trạng thái' value={active.status} />
              <Field label='Tham chiếu' value={active.reference || '-'} />
              <div className='md:col-span-2'>
                <div className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Ghi chú</div>
                <div className='mt-1 rounded-xl border bg-gray-50 p-3 text-sm text-gray-800'>{active.note || '-'}</div>
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
