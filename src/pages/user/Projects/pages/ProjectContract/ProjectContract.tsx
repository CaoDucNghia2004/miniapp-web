import { Card, Divider, Table, Tag } from 'antd'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'

import contractsApi from 'src/apis/contracts.api'
import projectsApi from 'src/apis/projects.api'
import paymentsApi from 'src/apis/payments.api'
import projectPhasesApi from 'src/apis/projectPhases.api'

import type { Contract } from 'src/types/contract.type'
import type { Payment } from 'src/types/payment.type'
import type { ProjectPhase } from 'src/types/projectPhase.type'
import type { Project } from 'src/types/projects.type'
import { getContractUrl, getPaymentStatusLabel } from 'src/utils/utils'

interface PaymentWithInfo extends Payment {
  projectName?: string
  phaseName?: string
  amountDue?: number
}

export default function ProjectContract() {
  // ===== Lấy danh sách dự án theo email =====
  const { data: projectsRes } = useQuery({
    queryKey: ['projectsByEmail'],
    queryFn: () => projectsApi.getProjectsByEmail().then((res) => res.data.data)
  })
  const projects: Project[] = projectsRes || []

  // ===== Lấy danh sách hợp đồng theo email =====
  const { data: contractsRes } = useQuery({
    queryKey: ['contractsByEmail'],
    queryFn: () => contractsApi.getContractsByEmail('').then((res) => res.data.data)
  })
  const contracts: Contract[] = contractsRes || []

  // ===== Lấy payments & phases cho tất cả project =====
  const { data: paymentsData } = useQuery({
    queryKey: ['paymentsAndPhases'],
    queryFn: async () => {
      let allPayments: PaymentWithInfo[] = []

      for (const project of projects) {
        const phasesRes = await projectPhasesApi.getProjectPhasesByProjectId(project.id)
        const phases: ProjectPhase[] = phasesRes.data.data || []

        try {
          const paymentsRes = await paymentsApi.getPaymentsByProjectId(project.id)
          const payments: Payment[] = paymentsRes.data.data || []

          const enrichedPayments = payments.map((p) => {
            const phase = phases.find((ph) => ph.id === p.projectPhaseId)
            return {
              ...p,
              projectName: project.name,
              phaseName: phase?.phaseName,
              amountDue: phase?.amountDue
            }
          })

          allPayments = [...allPayments, ...enrichedPayments]
        } catch {
          // nếu không có API thanh toán thì bỏ qua
        }
      }

      return allPayments
    },
    enabled: projects.length > 0
  })
  const payments: PaymentWithInfo[] = paymentsData || []

  // ===== Cột bảng Hợp đồng =====
  const contractColumns = [
    {
      title: 'Số hợp đồng',
      dataIndex: 'contractNumber',
      key: 'contractNumber'
    },
    {
      title: 'Ngày ký',
      dataIndex: 'signedDate',
      key: 'signedDate',
      render: (date: string) => (date ? dayjs(date).format('DD/MM/YYYY') : 'Chưa ký')
    },
    {
      title: 'Giá trị hợp đồng',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (value: number) => `${value?.toLocaleString() || 0} VND`
    },
    {
      title: 'File hợp đồng',
      dataIndex: 'contractFile',
      key: 'contractFile',
      render: (file: string) =>
        file ? (
          <a href={getContractUrl(file)} target='_blank' rel='noopener noreferrer'>
            Xem file
          </a>
        ) : (
          <span className='text-gray-400 italic'>Chưa có file</span>
        )
    }
  ]

  const paymentColumns = [
    {
      title: 'Ngày thanh toán',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Dự án + Giai đoạn',
      key: 'phaseName',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: PaymentWithInfo) => (
        <span>
          {record.projectName || 'Dự án'} - {record.phaseName || 'Giai đoạn'}
        </span>
      )
    },
    {
      title: 'Số tiền',
      key: 'amountDue',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: PaymentWithInfo) => `${record.amountDue?.toLocaleString() || 0} VND`
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string) => {
        const typedStatus = status as 'COMPLETED' | 'FAILED' | 'PENDING'
        return (
          <Tag color={typedStatus === 'COMPLETED' ? 'green' : typedStatus === 'FAILED' ? 'red' : 'orange'}>
            {getPaymentStatusLabel(typedStatus)}
          </Tag>
        )
      }
    }
  ]

  return (
    <div className='space-y-6'>
      <Card title='📑 Danh sách hợp đồng' className='shadow-md rounded-xl'>
        <Table
          rowKey='id'
          dataSource={contracts}
          columns={contractColumns}
          pagination={false}
          locale={{ emptyText: 'Chưa có hợp đồng' }}
        />
      </Card>

      <Divider />

      <Card title='💵 Lịch sử thanh toán' className='shadow-md rounded-xl'>
        <Table
          rowKey='id'
          dataSource={payments}
          columns={paymentColumns}
          pagination={false}
          locale={{ emptyText: 'Chưa có thanh toán' }}
        />
      </Card>
    </div>
  )
}
