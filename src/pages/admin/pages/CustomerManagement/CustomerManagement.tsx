import { useMemo, useState } from 'react'

type CustomerStatus = 'Tiềm năng' | 'Đang chăm sóc' | 'Đã mua' | 'Ngưng'
type CustomerSource = 'Form Website' | 'Facebook' | 'Zalo' | 'Giới thiệu' | 'Khác'

type Customer = {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  industry?: string
  source: CustomerSource
  status: CustomerStatus
  lastActivity?: string // text ngắn
  createdAt: string // YYYY-MM-DD
}

const STATUS_BADGE: Record<CustomerStatus, string> = {
  'Tiềm năng': 'bg-blue-100 text-blue-700',
  'Đang chăm sóc': 'bg-amber-100 text-amber-700',
  'Đã mua': 'bg-emerald-100 text-emerald-700',
  Ngưng: 'bg-rose-100 text-rose-700'
}

const SOURCES: CustomerSource[] = ['Form Website', 'Facebook', 'Zalo', 'Giới thiệu', 'Khác']
const STATUSES: CustomerStatus[] = ['Tiềm năng', 'Đang chăm sóc', 'Đã mua', 'Ngưng']

// ========= Dummy data (thay bằng API sau) =========
const seed: Customer[] = [
  {
    id: 'C-001',
    name: 'Nguyễn Văn A',
    email: 'vana@gmail.com',
    phone: '0123456789',
    company: 'Alpha',
    industry: 'Bán lẻ',
    source: 'Form Website',
    status: 'Đang chăm sóc',
    lastActivity: 'Gọi tư vấn 20/08',
    createdAt: '2025-08-18'
  },
  {
    id: 'C-002',
    name: 'Trần Thị B',
    email: 'tranb@example.com',
    phone: '0902xxxxxx',
    company: 'Beta',
    industry: 'Du lịch',
    source: 'Facebook',
    status: 'Tiềm năng',
    lastActivity: 'Nhắn Zalo hỏi chi phí',
    createdAt: '2025-08-20'
  },
  {
    id: 'C-003',
    name: 'Công ty Gama',
    email: 'hi@gama.vn',
    phone: '0933xxxxxx',
    company: 'Gama',
    industry: 'F&B',
    source: 'Giới thiệu',
    status: 'Đã mua',
    lastActivity: 'Ký HĐ 19/08',
    createdAt: '2025-08-19'
  },
  {
    id: 'C-004',
    name: 'Nguyễn C',
    email: 'c@example.com',
    phone: '0909xxxxxx',
    source: 'Khác',
    status: 'Ngưng',
    lastActivity: 'Không phản hồi',
    createdAt: '2025-08-10'
  }
]

export default function CustomerManagement() {
  // ------- state chính -------
  const [data, setData] = useState<Customer[]>(seed)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<CustomerStatus | 'Tất cả'>('Tất cả')
  const [source, setSource] = useState<CustomerSource | 'Tất cả'>('Tất cả')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(8)

  // modal thêm/sửa
  const [editing, setEditing] = useState<Customer | null>(null)
  const [form, setForm] = useState<Customer>({
    id: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    source: 'Form Website',
    status: 'Tiềm năng',
    lastActivity: '',
    createdAt: new Date().toISOString().slice(0, 10)
  })

  // ------- lọc / tìm kiếm -------
  const filtered = useMemo(() => {
    return data.filter((c) => {
      const hay = `${c.name} ${c.email} ${c.phone} ${c.company ?? ''} ${c.industry ?? ''}`.toLowerCase()
      const okText = hay.includes(q.trim().toLowerCase())
      const okStatus = status === 'Tất cả' ? true : c.status === status
      const okSource = source === 'Tất cả' ? true : c.source === source
      const okFrom = from ? c.createdAt >= from : true
      const okTo = to ? c.createdAt <= to : true
      return okText && okStatus && okSource && okFrom && okTo
    })
  }, [data, q, status, source, from, to])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  // ------- handlers -------
  const resetForm = () => {
    setForm({
      id: '',
      name: '',
      email: '',
      phone: '',
      company: '',
      industry: '',
      source: 'Form Website',
      status: 'Tiềm năng',
      lastActivity: '',
      createdAt: new Date().toISOString().slice(0, 10)
    })
  }

  const openCreate = () => {
    resetForm()
    setEditing({ ...form })
  }

  const openEdit = (c: Customer) => {
    setForm(c)
    setEditing(c)
  }

  const save = () => {
    // validate cơ bản
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) return alert('Tên / Email / SĐT là bắt buộc!')
    if (!form.id) {
      // create
      const next: Customer = { ...form, id: genId(data) }
      setData((prev) => [next, ...prev])
    } else {
      // update
      setData((prev) => prev.map((x) => (x.id === form.id ? form : x)))
    }
    setEditing(null)
  }

  const remove = (id: string) => {
    if (!confirm('Xoá khách hàng này?')) return
    setData((prev) => prev.filter((x) => x.id !== id))
  }

  const exportCSV = () => {
    const headers = [
      'ID',
      'Họ tên',
      'Email',
      'SĐT',
      'Công ty',
      'Lĩnh vực',
      'Nguồn',
      'Trạng thái',
      'Hoạt động gần nhất',
      'Ngày tạo'
    ]
    const rows = filtered.map((c) => [
      c.id,
      c.name,
      c.email,
      c.phone,
      c.company ?? '',
      c.industry ?? '',
      c.source,
      c.status,
      c.lastActivity ?? '',
      c.createdAt
    ])
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `customers_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className='space-y-6'>
      {/* header */}
      <div className='flex flex-col justify-between gap-3 md:flex-row md:items-center'>
        <div>
          <h2 className='text-xl font-semibold text-gray-900 md:text-2xl'>Quản lý khách hàng</h2>
          <p className='text-sm text-gray-500'>Theo dõi khách hàng theo trạng thái chăm sóc & nguồn vào.</p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <button
            onClick={openCreate}
            className='rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600'
          >
            + Thêm khách hàng
          </button>
          <button onClick={exportCSV} className='rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50'>
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
            placeholder='Tìm theo tên, email, SĐT, công ty…'
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
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={source}
          onChange={(e) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setSource(e.target.value as any)
            setPage(1)
          }}
          className='rounded-xl border px-3 py-2 text-sm'
        >
          <option value='Tất cả'>Tất cả nguồn</option>
          {SOURCES.map((s) => (
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
                <th className='px-4 py-3 font-semibold'>Công ty</th>
                <th className='px-4 py-3 font-semibold'>Lĩnh vực</th>
                <th className='px-4 py-3 font-semibold'>Nguồn</th>
                <th className='px-4 py-3 font-semibold'>Trạng thái</th>
                <th className='px-4 py-3 font-semibold'>Hoạt động gần nhất</th>
                <th className='px-4 py-3 font-semibold text-right'>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((c) => (
                <tr key={c.id} className='border-t'>
                  <td className='px-4 py-3'>
                    <div className='font-medium text-gray-900'>{c.name}</div>
                    <div className='text-xs text-gray-500'>{c.createdAt}</div>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='text-sm'>{c.phone}</div>
                    <div className='text-xs text-gray-500'>{c.email}</div>
                  </td>
                  <td className='px-4 py-3'>{c.company || '-'}</td>
                  <td className='px-4 py-3'>{c.industry || '-'}</td>
                  <td className='px-4 py-3'>
                    <span className='rounded-full bg-gray-100 px-2 py-1 text-xs'>{c.source}</span>
                  </td>
                  <td className='px-4 py-3'>
                    <span className={`rounded-full px-2 py-1 text-xs ${STATUS_BADGE[c.status]}`}>{c.status}</span>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='line-clamp-1 max-w-[280px] text-xs text-gray-600'>{c.lastActivity || '-'}</div>
                  </td>
                  <td className='px-4 py-3 text-right'>
                    <div className='flex justify-end gap-2'>
                      <button
                        onClick={() => openEdit(c)}
                        className='rounded-lg border px-2 py-1 text-xs hover:bg-gray-50'
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => remove(c.id)}
                        className='rounded-lg bg-rose-500 px-2 py-1 text-xs font-semibold text-white hover:bg-rose-600'
                      >
                        Xoá
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={8} className='px-4 py-8 text-center text-sm text-gray-500'>
                    Không có khách hàng phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className='flex items-center justify-between gap-2 border-t px-4 py-3'>
          <div className='text-sm text-gray-500'>
            Tổng <span className='font-semibold text-gray-700'>{filtered.length}</span> khách hàng
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

      {/* Modal thêm/sửa */}
      {editing && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4'>
          <div className='w-full max-w-2xl rounded-2xl border bg-white p-5 shadow-lg'>
            <div className='mb-3 flex items-center justify-between'>
              <h4 className='text-lg font-semibold'>{form.id ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng'}</h4>
              <button
                onClick={() => setEditing(null)}
                className='rounded-full px-2 py-1 text-xl leading-none hover:bg-gray-100'
              >
                ×
              </button>
            </div>

            <div className='grid gap-3 md:grid-cols-2'>
              <Field label='Họ tên *'>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className='w-full rounded-xl border px-3 py-2 text-sm'
                />
              </Field>
              <Field label='Email *'>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className='w-full rounded-xl border px-3 py-2 text-sm'
                />
              </Field>
              <Field label='Số điện thoại *'>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className='w-full rounded-xl border px-3 py-2 text-sm'
                />
              </Field>
              <Field label='Công ty'>
                <input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className='w-full rounded-xl border px-3 py-2 text-sm'
                />
              </Field>
              <Field label='Lĩnh vực'>
                <input
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className='w-full rounded-xl border px-3 py-2 text-sm'
                />
              </Field>
              <Field label='Nguồn'>
                <select
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value as CustomerSource })}
                  className='w-full rounded-xl border px-3 py-2 text-sm'
                >
                  {SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label='Trạng thái'>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as CustomerStatus })}
                  className='w-full rounded-xl border px-3 py-2 text-sm'
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label='Ngày tạo'>
                <input
                  type='date'
                  value={form.createdAt}
                  onChange={(e) => setForm({ ...form, createdAt: e.target.value })}
                  className='w-full rounded-xl border px-3 py-2 text-sm'
                />
              </Field>
              <div className='md:col-span-2'>
                <div className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Hoạt động gần nhất</div>
                <textarea
                  value={form.lastActivity}
                  onChange={(e) => setForm({ ...form, lastActivity: e.target.value })}
                  rows={3}
                  className='mt-1 w-full rounded-xl border px-3 py-2 text-sm'
                />
              </div>
            </div>

            <div className='mt-5 flex justify-end gap-2'>
              <button onClick={() => setEditing(null)} className='rounded-lg border px-4 py-2 text-sm hover:bg-gray-50'>
                Huỷ
              </button>
              <button
                onClick={save}
                className='rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600'
              >
                {form.id ? 'Lưu thay đổi' : 'Thêm khách hàng'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helpers
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className='text-xs font-semibold uppercase tracking-wide text-gray-500'>{label}</div>
      <div className='mt-1'>{children}</div>
    </div>
  )
}

function genId(list: { id: string }[]) {
  const n = String(list.length + 1).padStart(3, '0')
  return `C-${n}`
}
