import { useMemo, useState } from 'react'

type Lead = {
  id: string
  createdAt: string
  fullName: string
  email: string
  phone?: string
  companyName?: string
  address?: string
}

const MOCK: Lead[] = [
  {
    id: 'LD-001',
    createdAt: '2025-08-10T08:30:00Z',
    fullName: 'Nguyễn Văn A',
    email: 'vana@gmail.com',
    phone: '0909123123',
    companyName: 'Công ty A',
    address: '12 Nguyễn Văn B, Q.3, HCM'
  },
  {
    id: 'LD-002',
    createdAt: '2025-08-12T14:00:00Z',
    fullName: 'Trần Thị B',
    email: 'tranb@gmail.com',
    phone: '0987123456',
    companyName: 'Startup B',
    address: 'Số 5 Lê Lợi, Q.1, HCM'
  }
]

export default function AccountRequests() {
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<Lead | null>(null)
  const [openCreate, setOpenCreate] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [pwd, setPwd] = useState('Aa@123456')

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase()
    return MOCK.filter(
      (l) =>
        !kw ||
        l.fullName.toLowerCase().includes(kw) ||
        l.email.toLowerCase().includes(kw) ||
        (l.companyName || '').toLowerCase().includes(kw)
    )
  }, [q])

  const genPwd = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%?'
    const rand = Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    setPwd(rand)
  }

  return (
    <div className='space-y-6'>
      {/* Header + search */}
      <div className='flex flex-col justify-between gap-3 md:flex-row md:items-center'>
        <div>
          <h2 className='text-xl font-semibold md:text-2xl'>Quản lý đăng ký</h2>
          <p className='text-sm text-gray-500'>
            Chỉ cần dùng <b>email</b> và đặt <b>password</b> để tạo tài khoản cho khách.
          </p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder='Tìm tên, email, công ty…'
          className='w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200 md:w-72'
        />
      </div>

      {/* Bảng */}
      <div className='rounded-2xl border bg-white shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-sm'>
            <thead className='bg-gray-50 text-left text-gray-500'>
              <tr>
                <th className='px-4 py-3 font-semibold'>Khách hàng</th>
                <th className='px-4 py-3 font-semibold'>Email</th>
                <th className='px-4 py-3 font-semibold'>Số điện thoại</th>
                <th className='px-4 py-3 font-semibold'>Công ty</th>
                <th className='px-4 py-3 font-semibold'>Địa chỉ</th>
                <th className='px-4 py-3 font-semibold'>Ngày đăng ký</th>
                <th className='px-4 py-3 font-semibold text-right'>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className='border-t'>
                  <td className='px-4 py-3'>
                    <div className='font-medium'>{r.fullName}</div>
                    <div className='text-xs text-gray-500'>{r.id}</div>
                  </td>
                  <td className='px-4 py-3'>{r.email}</td>
                  <td className='px-4 py-3'>{r.phone || '-'}</td>
                  <td className='px-4 py-3'>{r.companyName || '-'}</td>
                  <td className='px-4 py-3'>{r.address || '-'}</td>
                  <td className='px-4 py-3'>{new Date(r.createdAt).toLocaleString()}</td>
                  <td className='px-4 py-3 text-right'>
                    <div className='flex flex-wrap justify-end gap-2'>
                      <button
                        className='rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600'
                        onClick={() => {
                          setSelected(r)
                          setOpenCreate(true)
                          setPwd('Aa@123456')
                          setShowPwd(false)
                        }}
                      >
                        Tạo tài khoản
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className='px-4 py-8 text-center text-gray-500'>
                    Không có bản ghi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal tạo tài khoản (UI only: Email + Password) */}
      {selected && openCreate && (
        <Modal title='Tạo tài khoản khách hàng' onClose={() => setOpenCreate(false)}>
          <div className='grid gap-4'>
            {/* Email (prefilled, edit được nếu muốn) */}
            <div>
              <label className='text-sm font-medium text-gray-700'>Email</label>
              <input
                defaultValue={selected.email}
                className='mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200'
              />
              <p className='mt-1 text-xs text-gray-500'>Tài khoản sẽ đăng nhập bằng địa chỉ email này.</p>
            </div>

            {/* Password */}
            <div>
              <label className='text-sm font-medium text-gray-700'>Mật khẩu</label>
              <div className='mt-1 flex gap-2'>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  className='w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200'
                />
                <button
                  type='button'
                  onClick={() => setShowPwd((v) => !v)}
                  className='rounded-lg border px-3 py-2 text-sm hover:bg-gray-50'
                >
                  {showPwd ? 'Ẩn' : 'Hiện'}
                </button>
                <button type='button' onClick={genPwd} className='rounded-lg border px-3 py-2 text-sm hover:bg-gray-50'>
                  Tạo ngẫu nhiên
                </button>
              </div>
              <p className='mt-1 text-xs text-gray-500'>
                Gợi ý: tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
              </p>
            </div>

            {/* Action */}
            <div className='mt-2 flex justify-end gap-2'>
              <button
                className='rounded-lg border px-4 py-2 text-sm hover:bg-gray-50'
                onClick={() => setOpenCreate(false)}
              >
                Huỷ
              </button>
              <button
                className='rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700'
                onClick={() => setOpenCreate(false)}
              >
                Lưu (demo)
              </button>
            </div>

            {/* Thông tin tham khảo (đẹp UI, không bắt buộc) */}
            <div className='rounded-xl bg-gray-50 p-4 text-sm text-gray-600'>
              <div className='font-medium text-gray-700'>Thông tin tham khảo</div>
              <div className='mt-2 grid gap-2 md:grid-cols-2'>
                <StaticField label='Tên khách hàng' value={selected.fullName} />
                <StaticField label='Công ty' value={selected.companyName || '-'} />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ---------- UI helpers ---------- */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/40' onClick={onClose} />
      <div className='relative z-10 w-full max-w-2xl rounded-2xl border bg-white p-6 shadow-xl'>
        <div className='mb-4 flex items-center justify-between'>
          <h4 className='text-lg font-semibold'>{title}</h4>
          <button className='rounded-full px-2 py-1 text-xl leading-none hover:bg-gray-100' onClick={onClose}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function StaticField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <label className='text-sm font-medium text-gray-700'>{label}</label>
      <div className='mt-1 w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm text-gray-700'>{value || '-'}</div>
    </div>
  )
}
