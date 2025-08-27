import { useMemo, useState } from 'react'

type ProjectStatus = 'Chuẩn bị' | 'Đang thực hiện' | 'Chờ khách duyệt' | 'Tạm dừng' | 'Hoàn thành'
type ProjectHealth = 'Tốt' | 'Cảnh báo' | 'Nguy cấp'

type Milestone = {
  id: string
  title: string
  done: boolean
}

type Project = {
  id: string // PJ-0001
  name: string
  customer: string
  manager: string
  status: ProjectStatus
  health: ProjectHealth
  progress: number // %
  startDate: string // YYYY-MM-DD
  dueDate: string // YYYY-MM-DD
  budget?: number // VND
  spent?: number // VND
  tags?: string[]
  lastUpdate?: string
  milestones: Milestone[]
}

const STATUS: ProjectStatus[] = ['Chuẩn bị', 'Đang thực hiện', 'Chờ khách duyệt', 'Tạm dừng', 'Hoàn thành']
const HEALTH: ProjectHealth[] = ['Tốt', 'Cảnh báo', 'Nguy cấp']

const HEALTH_BADGE: Record<ProjectHealth, string> = {
  Tốt: 'bg-emerald-100 text-emerald-700',
  'Cảnh báo': 'bg-amber-100 text-amber-700',
  'Nguy cấp': 'bg-rose-100 text-rose-700'
}

const STATUS_BADGE: Record<ProjectStatus, string> = {
  'Chuẩn bị': 'bg-sky-100 text-sky-700',
  'Đang thực hiện': 'bg-indigo-100 text-indigo-700',
  'Chờ khách duyệt': 'bg-violet-100 text-violet-700',
  'Tạm dừng': 'bg-gray-100 text-gray-700',
  'Hoàn thành': 'bg-teal-100 text-teal-700'
}

// ===== Dummy data (thay bằng API) =====
const seed: Project[] = [
  {
    id: 'PJ-0008',
    name: 'MiniApp Loyalty Alpha',
    customer: 'Công ty Alpha',
    manager: 'Lan',
    status: 'Đang thực hiện',
    health: 'Tốt',
    progress: 78,
    startDate: '2025-08-01',
    dueDate: '2025-09-05',
    budget: 95000000,
    spent: 42000000,
    tags: ['Loyalty', 'Payment'],
    lastUpdate: '2025-08-22',
    milestones: [
      { id: 'M1', title: 'Thiết kế UI', done: true },
      { id: 'M2', title: 'Tính năng tích điểm', done: true },
      { id: 'M3', title: 'Thanh toán', done: false },
      { id: 'M4', title: 'Triển khai & test', done: false }
    ]
  },
  {
    id: 'PJ-0007',
    name: 'MiniApp Booking Beta',
    customer: 'Công ty Beta',
    manager: 'Minh',
    status: 'Chờ khách duyệt',
    health: 'Cảnh báo',
    progress: 52,
    startDate: '2025-07-25',
    dueDate: '2025-08-28',
    budget: 120000000,
    spent: 30000000,
    tags: ['Booking'],
    lastUpdate: '2025-08-21',
    milestones: [
      { id: 'M1', title: 'API lịch', done: true },
      { id: 'M2', title: 'Luồng đặt chỗ', done: true },
      { id: 'M3', title: 'Duyệt khách hàng', done: false }
    ]
  },
  {
    id: 'PJ-0006',
    name: 'MiniApp Promo Gama',
    customer: 'Gama',
    manager: 'Huy',
    status: 'Hoàn thành',
    health: 'Tốt',
    progress: 100,
    startDate: '2025-07-05',
    dueDate: '2025-08-15',
    budget: 60000000,
    spent: 58000000,
    tags: ['Promotion'],
    lastUpdate: '2025-08-15',
    milestones: [
      { id: 'M1', title: 'Khuyến mãi', done: true },
      { id: 'M2', title: 'Báo cáo', done: true }
    ]
  },
  {
    id: 'PJ-0005',
    name: 'MiniApp CRM Omega',
    customer: 'Omega',
    manager: 'Nam',
    status: 'Tạm dừng',
    health: 'Nguy cấp',
    progress: 20,
    startDate: '2025-08-10',
    dueDate: '2025-09-30',
    budget: 80000000,
    spent: 5000000,
    tags: ['CRM'],
    lastUpdate: '2025-08-18',
    milestones: [
      { id: 'M1', title: 'Khảo sát', done: true },
      { id: 'M2', title: 'Thiết kế kiến trúc', done: false }
    ]
  }
]

const fmt = (n?: number) =>
  typeof n === 'number'
    ? n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
    : '-'

const isOverdue = (p: Project) => p.status !== 'Hoàn thành' && new Date(p.dueDate) < new Date()

export default function ProjectManagement() {
  const [data, setData] = useState<Project[]>(seed)

  // filters
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<ProjectStatus | 'Tất cả'>('Tất cả')
  const [health, setHealth] = useState<ProjectHealth | 'Tất cả'>('Tất cả')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(8)

  // modal chi tiết
  const [active, setActive] = useState<Project | null>(null)

  // filter logic
  const filtered = useMemo(() => {
    return data.filter((p) => {
      const hay = `${p.id} ${p.name} ${p.customer} ${p.manager} ${(p.tags ?? []).join(' ')}`.toLowerCase()
      const okText = hay.includes(q.trim().toLowerCase())
      const okStatus = status === 'Tất cả' ? true : p.status === status
      const okHealth = health === 'Tất cả' ? true : p.health === health
      const okFrom = from ? p.startDate >= from : true
      const okTo = to ? p.dueDate <= to : true
      return okText && okStatus && okHealth && okFrom && okTo
    })
  }, [data, q, status, health, from, to])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  // KPIs
  const total = filtered.length
  const avgProgress = total ? Math.round(filtered.reduce((s, p) => s + p.progress, 0) / total) : 0
  const overdueCount = filtered.filter(isOverdue).length

  // actions
  const updateStatus = (id: string, next: ProjectStatus) => {
    setData((prev) => prev.map((x) => (x.id === id ? { ...x, status: next } : x)))
    setActive((prev) => (prev && prev.id === id ? { ...prev, status: next } : prev))
  }

  const updateProgress = (id: string, next: number) => {
    const v = Math.max(0, Math.min(100, Math.round(next)))
    setData((prev) => prev.map((x) => (x.id === id ? { ...x, progress: v } : x)))
    setActive((prev) => (prev && prev.id === id ? { ...prev, progress: v } : prev))
  }

  const toggleMilestone = (pid: string, mid: string) => {
    setData((prev) =>
      prev.map((p) =>
        p.id !== pid ? p : { ...p, milestones: p.milestones.map((m) => (m.id === mid ? { ...m, done: !m.done } : m)) }
      )
    )
    setActive((prev) =>
      prev && prev.id === pid
        ? { ...prev, milestones: prev.milestones.map((m) => (m.id === mid ? { ...m, done: !m.done } : m)) }
        : prev
    )
  }

  const exportCSV = () => {
    const headers = [
      'Mã',
      'Tên',
      'Khách hàng',
      'Quản lý',
      'Trạng thái',
      'Sức khỏe',
      'Tiến độ',
      'Bắt đầu',
      'Hạn',
      'Ngân sách',
      'Đã chi',
      'Tags'
    ]
    const rows = filtered.map((p) => [
      p.id,
      p.name,
      p.customer,
      p.manager,
      p.status,
      p.health,
      `${p.progress}%`,
      p.startDate,
      p.dueDate,
      p.budget ?? '',
      p.spent ?? '',
      (p.tags ?? []).join('|')
    ])
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `projects_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className='space-y-6'>
      {/* Header + KPI */}
      <div className='flex flex-col justify-between gap-3 md:flex-row md:items-center'>
        <div>
          <h2 className='text-xl font-semibold text-gray-900 md:text-2xl'>Quản lý dự án / Tiến độ</h2>
          <p className='text-sm text-gray-500'>Theo dõi tình trạng dự án, sức khỏe và mốc công việc.</p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <div className='rounded-lg border px-3 py-2 text-sm'>
            Tổng: <span className='font-semibold'>{total}</span>
          </div>
          <div className='rounded-lg border px-3 py-2 text-sm'>
            Tiến độ TB: <span className='font-semibold'>{avgProgress}%</span>
          </div>
          <div className='rounded-lg border px-3 py-2 text-sm'>
            Quá hạn: <span className={`font-semibold ${overdueCount ? 'text-rose-600' : ''}`}>{overdueCount}</span>
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
            placeholder='Tìm theo mã, tên, KH, quản lý, tag…'
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
        <select
          value={health}
          onChange={(e) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setHealth(e.target.value as any)
            setPage(1)
          }}
          className='rounded-xl border px-3 py-2 text-sm'
        >
          <option value='Tất cả'>Tất cả sức khỏe</option>
          {HEALTH.map((s) => (
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
                <th className='px-4 py-3 font-semibold'>Tiến độ</th>
                <th className='px-4 py-3 font-semibold'>Sức khỏe</th>
                <th className='px-4 py-3 font-semibold'>Trạng thái</th>
                <th className='px-4 py-3 font-semibold'>Bắt đầu</th>
                <th className='px-4 py-3 font-semibold'>Hạn</th>
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
                  <td className='px-4 py-3 w-48'>
                    <div className='flex items-center gap-2'>
                      <div className='h-2 w-full rounded-full bg-gray-100'>
                        <div
                          className='h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-500'
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                      <div className='w-10 text-right text-xs text-gray-600'>{p.progress}%</div>
                    </div>
                  </td>
                  <td className='px-4 py-3'>
                    <span className={`rounded-full px-2 py-1 text-xs ${HEALTH_BADGE[p.health]}`}>{p.health}</span>
                  </td>
                  <td className='px-4 py-3'>
                    <span className={`rounded-full px-2 py-1 text-xs ${STATUS_BADGE[p.status]}`}>{p.status}</span>
                  </td>
                  <td className='px-4 py-3'>{p.startDate}</td>
                  <td className={`px-4 py-3 ${isOverdue(p) ? 'text-rose-600 font-medium' : ''}`}>{p.dueDate}</td>
                  <td className='px-4 py-3 text-right'>
                    <div className='flex justify-end gap-2'>
                      <button
                        onClick={() => setActive(p)}
                        className='rounded-lg border px-2 py-1 text-xs hover:bg-gray-50'
                      >
                        Chi tiết
                      </button>
                      {p.status !== 'Hoàn thành' && (
                        <button
                          onClick={() => updateStatus(p.id, 'Hoàn thành')}
                          className='rounded-lg bg-teal-500 px-2 py-1 text-xs font-semibold text-white hover:bg-teal-600'
                        >
                          Hoàn thành
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
              <Field label='Trạng thái' value={active.status} />
              <Field label='Sức khỏe' value={active.health} />
              <Field label='Tiến độ' value={`${active.progress}%`} />
              <Field label='Bắt đầu' value={active.startDate} />
              <Field label='Hạn' value={active.dueDate} />
              <Field label='Ngân sách' value={fmt(active.budget)} />
              <Field label='Đã chi' value={fmt(active.spent)} />
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

              {/* Cập nhật trạng thái */}
              <div className='md:col-span-2'>
                <div className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Đổi trạng thái</div>
                <div className='mt-2 flex flex-wrap gap-2'>
                  {STATUS.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(active.id, s)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${active.status === s ? STATUS_BADGE[s] : 'border'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cập nhật tiến độ */}
              <div className='md:col-span-2'>
                <div className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Cập nhật tiến độ (%)</div>
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

              {/* Milestones */}
              <div className='md:col-span-2'>
                <div className='mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500'>Mốc công việc</div>
                <ul className='space-y-2'>
                  {active.milestones.map((m) => (
                    <li key={m.id} className='flex items-center justify-between rounded-xl border p-3'>
                      <div className='flex items-center gap-3'>
                        <input
                          type='checkbox'
                          checked={m.done}
                          onChange={() => toggleMilestone(active.id, m.id)}
                          className='h-4 w-4 accent-orange-500'
                        />
                        <span className={m.done ? 'text-gray-500 line-through' : 'text-gray-800'}>{m.title}</span>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${m.done ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {m.done ? 'Hoàn tất' : 'Chưa xong'}
                      </span>
                    </li>
                  ))}
                </ul>
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
