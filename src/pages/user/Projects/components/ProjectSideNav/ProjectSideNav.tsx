import { CreditCard, FileText, LayoutDashboard, MessageSquare } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import path from 'src/constants/path'

const navItems = [
  { to: path.projectDashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: path.projectDetail, label: 'Chi tiết dự án', icon: FileText },
  { to: path.projectContract, label: 'Hợp đồng & Thanh toán', icon: CreditCard },
  { to: path.projectComment, label: 'Đánh giá dịch vụ', icon: MessageSquare }
]

export default function ProjectSideNav() {
  return (
    <aside className='rounded-md bg-white p-3 shadow'>
      <nav className='space-y-2'>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center px-2 py-2 rounded-md text-sm font-medium transition ${
                isActive
                  ? 'bg-orange-50 text-orange-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-orange-500'
              }`
            }
          >
            <Icon size={20} className='mr-3' />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
