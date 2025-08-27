import { useMemo, useState } from 'react'

type SupportStatus = 'Đang hỗ trợ' | 'Bảo trì định kỳ' | 'Hoàn tất hỗ trợ' | 'Tạm dừng'

type ImplementedProject = {
  id: string // PJ-XXXX
  name: string
  customer: string
  manager: string
  tags?: string[]
  revenue: number // VND
  finishedAt: string // YYYY-MM-DD
  warrantyUntil?: string // YYYY-MM-DD
  satisfaction?: number // 1..5
  supportStatus: SupportStatus
  handoverFiles?: { name: string; url?: string }[]
  notes?: string
}

const SUPPORT_BADGE: Record<SupportStatus, string> = {
  'Đang hỗ trợ': 'bg-amber-100 text-amber-700',
  'Bảo trì định kỳ': 'bg-sky-100 text-sky-700',
  'Hoàn tất hỗ trợ': 'bg-emerald-100 text-emerald-700',
  'Tạm dừng': 'bg-gray-100 text-gray-700'
}

const initialData: ImplementedProject[] = [
  {
    id: 'PJ-0006',
    name: 'MiniApp Promo Gama',
    customer: 'Gama',
    manager: 'Huy',
    tags: ['Promotion'],
    revenue: 60000000,
    finishedAt: '2025-08-15',
    warrantyUntil: '2026-02-15',
    satisfaction: 5,
    supportStatus: 'Bảo trì định kỳ',
    handoverFiles: [{ name: 'BienBan_BanGiao.pdf' }, { name: 'HuongDan_SuDung.pdf' }],
    notes: 'Đã bàn giao đầy đủ, lịch bảo trì mỗi quý.'
  },
  {
    id: 'PJ-0004',
    name: 'MiniApp Loyalty Alpha',
    customer: 'Alpha',
    manager: 'Lan',
    tags: ['Loyalty', 'Payment'],
    revenue: 95000000,
    finishedAt: '2025-06-30',
    warrantyUntil: '2025-12-31',
    satisfaction: 4,
    supportStatus: 'Đang hỗ trợ',
    handoverFiles: [{ name: 'Invoice_HD-2025-0020.pdf' }],
    notes: 'Khách yêu cầu bổ sung báo cáo tích điểm tháng.'
  },
  {
    id: 'PJ-0003',
    name: 'MiniApp Booking Beta',
    customer: 'Beta',
    manager: 'Minh',
    tags: ['Booking'],
    revenue: 120000000,
    finishedAt: '2025-05-20',
    warrantyUntil: '2025-08-20',
    satisfaction: 3,
    supportStatus: 'Hoàn tất hỗ trợ',
    notes: 'Hết bảo hành, đã nghiệm thu cuối.'
  },
  {
    id: 'PJ-0002',
    name: 'MiniApp CRM Omega',
    customer: 'Omega',
    manager: 'Nam',
    tags: ['CRM'],
    revenue: 80000000,
    finishedAt: '2025-04-01',
    warrantyUntil: '2025-07-01',
    satisfaction: 2,
    supportStatus: 'Tạm dừng',
    notes: 'Tạm dừng hỗ trợ do chuyển phiên bản.'
  }
]

const fmtVND = (n: number) =>
  n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })

const isWarrantyActive = (p: ImplementedProject) => (p.warrantyUntil ? new Date(p.warrantyUntil) >= new Date() : false)

export default function ImplementedProjects() {
  const [data, setData] = useState<ImplementedProject[]>(initialData)

  // Filters
  const [query, setQuery] = useState('')
  const [supportFilter, setSupportFilter] = useState<SupportStatus | 'Tất cả'>('Tất cả')
  const [warrantyFilter, setWarrantyFilter] = useState<'Tất cả' | 'Còn BH' | 'Hết BH'>('Tất cả')
  const [minStar, setMinStar] = useState<number | 'Tất cả'>('Tất cả')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 8

  // Modal
  const [active, setActive] = useState<ImplementedProject | null>(null)

  const filtered = useMemo(() => {
    return data.filter((p) => {
      const haystack = `${p.id} ${p.name} ${p.customer} ${p.manager} ${(p.tags ?? []).join(' ')}`.toLowerCase()
      const okText = haystack.includes(query.trim().toLowerCase())
      const okSupport = supportFilter === 'Tất cả' ? true : p.supportStatus === supportFilter
      const okWarranty =
        warrantyFilter === 'Tất cả' ? true : warrantyFilter === 'Còn BH' ? isWarrantyActive(p) : !isWarrantyActive(p)
      const okStar = minStar === 'Tất cả' ? true : (p.satisfaction ?? 0) >= minStar
      const okFrom = from ? p.finishedAt >= from : true
      const okTo = to ? p.finishedAt <= to : true
      return okText && okSupport && okWarranty && okStar && okFrom && okTo
    })
  }, [data, query, supportFilter, warrantyFilter, minStar, from, to])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  // KPI
  const totalRevenue = filtered.reduce((s, p) => s + p.revenue, 0)
  const activeWarrantyCount = filtered.filter(isWarrantyActive).length
  const avgStar = filtered.length
    ? (filtered.reduce((s, p) => s + (p.satisfaction ?? 0), 0) / filtered.length).toFixed(1)
    : '0.0'

  // Actions
  const updateSupportStatus = (id: string, next: SupportStatus) => {
    setData((prev) => prev.map((x) => (x.id === id ? { ...x, supportStatus: next } : x)))
    setActive((prev) => (prev && prev.id === id ? { ...prev, supportStatus: next } : prev))
  }

  const extendWarranty = (id: string, months = 3) => {
    setData((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const base = p.warrantyUntil ? new Date(p.warrantyUntil) : new Date()
        const next = new Date(base)
        next.setMonth(base.getMonth() + months)
        return { ...p, warrantyUntil: next.toISOString().slice(0, 10) }
      })
    )
    setActive((prev) => {
      if (!prev || prev.id !== id) return prev
      const base = prev.warrantyUntil ? new Date(prev.warrantyUntil) : new Date()
      const next = new Date(base)
      next.setMonth(base.getMonth() + months)
      return { ...prev, warrantyUntil: next.toISOString().slice(0, 10) }
    })
  }

  const exportCSV = () => {
    const headers = [
      'Mã',
      'Tên',
      'Khách hàng',
      'Quản lý',
      'Tags',
      'Doanh thu',
      'Hoàn tất',
      'Bảo hành đến',
      'Hài lòng',
      'Trạng thái hỗ trợ'
    ]
    const rows = filtered.map((p) => [
      p.id,
      p.name,
      p.customer,
      p.manager,
      (p.tags ?? []).join('|'),
      p.revenue,
      p.finishedAt,
      p.warrantyUntil ?? '',
      p.satisfaction ?? '',
      p.supportStatus
    ])
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `implemented_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className='space-y-6'>
      {/* Header + KPI */}
      <div className='flex flex-col justify-between gap-3 md:flex-row md:items-center'>
        <div>
          <h2 className='text-xl font-semibold text-gray-900 md:text-2xl'>Dự án đã triển khai</h2>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <div className='rounded-lg border px-3 py-2 text-sm'>
            Tổng doanh thu: <span className='font-semibold'>{fmtVND(totalRevenue)}</span>
          </div>
          <div className='rounded-lg border px-3 py-2 text-sm'>
            Đang còn BH: <span className='font-semibold'>{activeWarrantyCount}</span>
          </div>
          <div className='rounded-lg border px-3 py-2 text-sm'>
            Điểm TB: <span className='font-semibold'>{avgStar}</span>/5
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
      <div className='grid gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-6'>
        <div className='md:col-span-2 flex items-center gap-2 rounded-xl border px-3 py-2'>
          <span>🔎</span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            className='w-full bg-transparent text-sm outline-none placeholder:text-gray-400'
            placeholder='Tìm theo mã, tên, KH, quản lý, tag…'
          />
        </div>
        <select
          value={supportFilter}
          onChange={(e) => {
            setSupportFilter(e.target.value as SupportStatus | 'Tất cả')
            setPage(1)
          }}
          className='rounded-xl border px-3 py-2 text-sm'
        >
          <option value='Tất cả'>Tất cả hỗ trợ</option>
          {(['Đang hỗ trợ', 'Bảo trì định kỳ', 'Hoàn tất hỗ trợ', 'Tạm dừng'] as SupportStatus[]).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={warrantyFilter}
          onChange={(e) => {
            setWarrantyFilter(e.target.value as 'Tất cả' | 'Còn BH' | 'Hết BH')
            setPage(1)
          }}
          className='rounded-xl border px-3 py-2 text-sm'
        >
          <option value='Tất cả'>Tất cả BH</option>
          <option value='Còn BH'>Còn bảo hành</option>
          <option value='Hết BH'>Hết bảo hành</option>
        </select>
        <select
          value={minStar === 'Tất cả' ? 'Tất cả' : String(minStar)}
          onChange={(e) => {
            const v = e.target.value === 'Tất cả' ? 'Tất cả' : Number(e.target.value)
            setMinStar(v)
            setPage(1)
          }}
          className='rounded-xl border px-3 py-2 text-sm'
        >
          <option value='Tất cả'>Điểm hài lòng</option>
          {[5, 4, 3, 2, 1].map((s) => (
            <option key={s} value={s}>
              {s}★ trở lên
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
                <th className='px-4 py-3 font-semibold'>Mã / Tên</th>
                <th className='px-4 py-3 font-semibold'>Khách hàng</th>
                <th className='px-4 py-3 font-semibold'>Quản lý</th>
                <th className='px-4 py-3 font-semibold'>Tags</th>
                <th className='px-4 py-3 font-semibold'>Doanh thu</th>
                <th className='px-4 py-3 font-semibold'>Hoàn tất</th>
                <th className='px-4 py-3 font-semibold'>Bảo hành đến</th>
                <th className='px-4 py-3 font-semibold'>Hài lòng</th>
                <th className='px-4 py-3 font-semibold'>Hỗ trợ</th>
                <th className='px-4 py-3 font-semibold text-right'>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((p) => (
                <tr key={p.id} className='border-t'>
                  <td className='px-4 py-3'>
                    <div className='font-semibold'>{p.id}</div>
                    <div className='text-xs text-gray-600'>{p.name}</div>
                  </td>
                  <td className='px-4 py-3'>{p.customer}</td>
                  <td className='px-4 py-3'>{p.manager}</td>
                  <td className='px-4 py-3'>
                    <div className='flex flex-wrap gap-1'>
                      {(p.tags ?? []).map((t) => (
                        <span key={t} className='rounded-full bg-gray-100 px-2 py-0.5 text-xs'>
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className='px-4 py-3'>{fmtVND(p.revenue)}</td>
                  <td className='px-4 py-3'>{p.finishedAt}</td>
                  <td className={`px-4 py-3 ${isWarrantyActive(p) ? '' : 'text-rose-600 font-medium'}`}>
                    {p.warrantyUntil || '-'}
                  </td>
                  <td className='px-4 py-3'>
                    <Stars value={p.satisfaction} />
                  </td>
                  <td className='px-4 py-3'>
                    <span className={`rounded-full px-2 py-1 text-xs ${SUPPORT_BADGE[p.supportStatus]}`}>
                      {p.supportStatus}
                    </span>
                  </td>
                  <td className='px-4 py-3 text-right'>
                    <div className='flex justify-end gap-2'>
                      <button
                        onClick={() => setActive(p)}
                        className='rounded-lg border px-2 py-1 text-xs hover:bg-gray-50'
                      >
                        Chi tiết
                      </button>
                      {p.supportStatus !== 'Hoàn tất hỗ trợ' && (
                        <button
                          onClick={() => updateSupportStatus(p.id, 'Hoàn tất hỗ trợ')}
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
                  <td colSpan={10} className='px-4 py-8 text-center text-sm text-gray-500'>
                    Không có dự án phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='flex items-center justify-between gap-2 border-t px-4 py-3'>
          <div className='text-sm text-gray-500'>
            Tổng <span className='font-semibold text-gray-700'>{filtered.length}</span> dự án
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
          <div className='w-full max-w-3xl rounded-2xl border bg-white p-5 shadow-lg'>
            <div className='mb-3 flex items-center justify-between'>
              <h4 className='text-lg font-semibold'>Chi tiết dự án • {active.id}</h4>
              <button
                onClick={() => setActive(null)}
                className='rounded-full px-2 py-1 text-xl leading-none hover:bg-gray-100'
              >
                ×
              </button>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <Field label='Tên dự án' value={active.name} />
              <Field label='Khách hàng' value={active.customer} />
              <Field label='Quản lý' value={active.manager} />
              <Field label='Hoàn tất' value={active.finishedAt} />
              <Field label='Bảo hành đến' value={active.warrantyUntil || '-'} />
              <Field label='Hài lòng' value={active.satisfaction ? `${active.satisfaction} / 5` : '-'} />
              <Field label='Doanh thu' value={fmtVND(active.revenue)} />
              <Field label='Hỗ trợ' value={active.supportStatus} />

              <div className='md:col-span-2'>
                <div className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Tags</div>
                <div className='mt-1 flex flex-wrap gap-1'>
                  {(active.tags ?? []).map((t) => (
                    <span key={t} className='rounded-full bg-gray-100 px-2 py-0.5 text-xs'>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className='md:col-span-2'>
                <div className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Ghi chú</div>
                <div className='mt-1 rounded-xl border bg-gray-50 p-3 text-sm text-gray-800'>{active.notes || '-'}</div>
              </div>

              {/* Handover files */}
              <div className='md:col-span-2'>
                <div className='mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                  Tài liệu bàn giao
                </div>
                <ul className='space-y-2'>
                  {(active.handoverFiles ?? []).map((f, idx) => (
                    <li key={idx} className='flex items-center justify-between rounded-xl border p-3'>
                      <div className='flex items-center gap-2'>
                        <span>📄</span>
                        <span className='text-sm text-gray-800'>{f.name}</span>
                      </div>
                      <button className='rounded-lg border px-3 py-1 text-xs hover:bg-gray-50'>Tải</button>
                    </li>
                  ))}
                  {(!active.handoverFiles || active.handoverFiles.length === 0) && (
                    <li className='rounded-xl border p-3 text-sm text-gray-500'>Chưa có tài liệu</li>
                  )}
                </ul>
              </div>

              {/* Quick actions */}
              <div className='md:col-span-2'>
                <div className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Thao tác nhanh</div>
                <div className='mt-2 flex flex-wrap gap-2'>
                  <button
                    onClick={() => updateSupportStatus(active.id, 'Đang hỗ trợ')}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${SUPPORT_BADGE['Đang hỗ trợ']}`}
                  >
                    Chuyển “Đang hỗ trợ”
                  </button>
                  <button
                    onClick={() => updateSupportStatus(active.id, 'Bảo trì định kỳ')}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${SUPPORT_BADGE['Bảo trì định kỳ']}`}
                  >
                    Đặt “Bảo trì định kỳ”
                  </button>
                  <button
                    onClick={() => extendWarranty(active.id, 3)}
                    className='rounded-full border px-3 py-1 text-xs font-semibold'
                  >
                    Gia hạn bảo hành +3 tháng
                  </button>
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

function Stars({ value }: { value?: number }) {
  if (!value) return <span>-</span>
  return <span>{'★'.repeat(Math.max(0, Math.min(5, value)))}</span>
}
