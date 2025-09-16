import { Card, Col, Row, List, Typography } from 'antd'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'

import projectsApi from 'src/apis/projects.api'
import contractsApi from 'src/apis/contracts.api'
import paymentsApi from 'src/apis/payments.api'
import adminUsersApi from 'src/apis/adminUsers.api'
import projectPhasesApi from 'src/apis/projectPhases.api'

import type { Project } from 'src/types/projects.type'
import type { Contract } from 'src/types/contract.type'
import type { Payment } from 'src/types/payment.type'
import type { User } from 'src/types/user.type'
import type { ProjectPhase } from 'src/types/projectPhase.type'

const COLORS = ['#1890ff', '#faad14', '#52c41a', '#ff4d4f']

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Title } = Typography

export default function AdminDashboard() {
  // ================== Fetch data ==================
  const { data: projectsRes } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getAllProjects().then((res) => res.data.data)
  })
  const projects: Project[] = projectsRes || []

  const { data: contractsRes } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => contractsApi.getAllContracts().then((res) => res.data.data)
  })
  const contracts: Contract[] = contractsRes || []

  const { data: paymentsRes } = useQuery({
    queryKey: ['payments'],
    queryFn: () => paymentsApi.getAllPayments().then((res) => res.data.data)
  })
  const payments: Payment[] = paymentsRes || []

  const { data: usersRes } = useQuery({
    queryKey: ['users'],
    queryFn: () => adminUsersApi.getAllUsers().then((res) => res.data.data)
  })
  const users: User[] = usersRes || []

  const { data: phasesRes } = useQuery({
    queryKey: ['phases'],
    queryFn: () => projectPhasesApi.getAllPhases().then((res) => res.data.data)
  })
  const phases: ProjectPhase[] = phasesRes || []

  // ================== Summary ==================
  const totalContractsValue = contracts.reduce((sum, c) => {
    const project = projects.find((p) => p.id === c.projectId)
    return project?.status !== 'CANCELLED' ? sum + (c.totalAmount || 0) : sum
  }, 0)

  const totalPaid = payments
    .filter((p) => p.paymentStatus === 'COMPLETED')
    .reduce((sum, p) => {
      const phase = phases.find((ph) => ph.id === p.projectPhaseId)
      return sum + (phase?.amountDue || 0)
    }, 0)

  const totalRemain = totalContractsValue - totalPaid

  // ================== Charts ==================
  const projectStatusData = [
    { name: 'Đang chờ', value: projects.filter((p) => p.status === 'PENDING').length },
    { name: 'Đang thực hiện', value: projects.filter((p) => p.status === 'IN_PROGRESS').length },
    { name: 'Hoàn thành', value: projects.filter((p) => p.status === 'COMPLETED').length },
    { name: 'Đã hủy', value: projects.filter((p) => p.status === 'CANCELLED').length }
  ]

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    return {
      month,
      projects: projects.filter((p) => dayjs(p.startDate).month() + 1 === month).length,
      contracts: contracts.filter((c) => dayjs(c.signedDate).month() + 1 === month).length,
      revenue: payments
        .filter((p) => p.paymentStatus === 'COMPLETED' && dayjs(p.paymentDate).month() + 1 === month)
        .reduce((sum, p) => {
          const phase = phases.find((ph) => ph.id === p.projectPhaseId)
          return sum + (phase?.amountDue || 0)
        }, 0)
    }
  })

  // ================== Recent lists ==================
  const recentProjects = [...projects].sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix()).slice(0, 5)

  const recentPayments = [...payments]
    .filter((p) => p.paymentStatus === 'COMPLETED')
    .sort((a, b) => dayjs(b.paymentDate).unix() - dayjs(a.paymentDate).unix())
    .slice(0, 5)
    .map((p) => {
      const phase = phases.find((ph) => ph.id === p.projectPhaseId)
      const proj = projects.find((pr) => pr.id === phase?.projectId)
      return {
        projectName: proj?.name || 'Không rõ dự án',
        phaseName: phase?.phaseName || 'Không rõ giai đoạn',
        amount: phase?.amountDue || 0,
        paymentDate: p.paymentDate
      }
    })

  const recentContracts = [...contracts]
    .sort((a, b) => dayjs(b.signedDate).unix() - dayjs(a.signedDate).unix())
    .slice(0, 5)

  const recentUsers = [...users].sort((a, b) => b.id - a.id).slice(0, 5)

  // ================== Alerts ==================
  const today = dayjs()
  const upcomingProjects = projects.filter(
    (p) => dayjs(p.endDate).isAfter(today) && dayjs(p.endDate).diff(today, 'day') <= 2
  )

  const overduePhases = phases.filter((ph) => dayjs(ph.endDate).isBefore(today) && ph.status !== 'COMPLETED')

  const projectsPendingPayment = phases
    .filter((ph) => payments.some((pay) => pay.projectPhaseId === ph.id && pay.paymentStatus === 'PENDING'))
    .map((ph) => {
      const proj = projects.find((p) => p.id === ph.projectId)
      return { ...ph, projectName: proj?.name }
    })

  return (
    <div className='space-y-6'>
      {/* Summary */}
      <Row gutter={16}>
        <Col span={4}>
          <Card title='👥 Khách hàng'>{users.length}</Card>
        </Col>
        <Col span={4}>
          <Card title='📊 Tổng dự án'>{projects.length}</Card>
        </Col>
        <Col span={5}>
          <Card title='📑 Tổng hợp đồng'>{contracts.length}</Card>
        </Col>
        <Col span={5}>
          <Card title='💰 Tổng giá trị HĐ'>{totalContractsValue.toLocaleString()} VND</Card>
        </Col>
        <Col span={6}>
          <Card title='💵 Đã thu / Còn lại'>
            ✅ {totalPaid.toLocaleString()} VND / ⚠️ {totalRemain.toLocaleString()} VND
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title='📊 Trạng thái tất cả dự án'>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie data={projectStatusData} dataKey='value' nameKey='name' label>
                  {projectStatusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout='horizontal' verticalAlign='bottom' align='center' />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title='📊 Dự án theo tháng'>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='projects' fill='#1890ff' name='Dự án' />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title='💵 Doanh thu theo tháng'>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis tickFormatter={(value) => `${value.toLocaleString()}`} />
                <Tooltip
                  formatter={(value: number) => [`${value.toLocaleString()} VND`, 'Doanh thu']}
                  labelFormatter={(label) => `Tháng ${label}`}
                />
                <Line type='monotone' dataKey='revenue' stroke='#52c41a' name='Doanh thu' />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Recent lists */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title='📌 Top 5 dự án mới nhất'>
            <List
              dataSource={recentProjects}
              renderItem={(item) => <List.Item>{item.name}</List.Item>}
              locale={{ emptyText: 'Không có' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title='💵 Thanh toán gần đây (tất cả dự án)'>
            <List
              dataSource={recentPayments}
              renderItem={(item) => (
                <List.Item>
                  {item.projectName} - {item.phaseName} : {item.amount.toLocaleString()} VND
                </List.Item>
              )}
              locale={{ emptyText: 'Không có' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title='📑 Top 5 hợp đồng mới nhất'>
            <List
              dataSource={recentContracts}
              renderItem={(item) => {
                const proj = projects.find((p) => p.id === item.projectId)
                return (
                  <List.Item>
                    {item.contractNumber} - {proj?.name}
                  </List.Item>
                )
              }}
              locale={{ emptyText: 'Không có' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title='👥 Top 5 khách hàng mới nhất'>
            <List
              dataSource={recentUsers}
              renderItem={(item) => <List.Item>{item.name || item.email}</List.Item>}
              locale={{ emptyText: 'Không có' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Alerts */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Card title='⏳ Dự án sắp hết hạn'>
            <List
              dataSource={upcomingProjects}
              renderItem={(item) => (
                <List.Item>
                  {item.name} (hết hạn {dayjs(item.endDate).format('DD/MM/YYYY')})
                </List.Item>
              )}
              locale={{ emptyText: 'Không có' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title='❌ Giai đoạn trễ hạn'>
            <List
              dataSource={overduePhases}
              renderItem={(item) => {
                const proj = projects.find((p) => p.id === item.projectId)
                return (
                  <List.Item>
                    {item.phaseName} - {proj?.name} ({dayjs(item.endDate).format('DD/MM/YYYY')})
                  </List.Item>
                )
              }}
              locale={{ emptyText: 'Không có' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title='💵 Dự án đang chờ thanh toán'>
            <List
              dataSource={projectsPendingPayment}
              renderItem={(item) => (
                <List.Item>
                  {item.projectName} - {item.phaseName}
                </List.Item>
              )}
              locale={{ emptyText: 'Không có' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
