import { Card, Col, Row, List, Tag, Button, Modal, Timeline, Divider } from 'antd'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { FilePdfOutlined } from '@ant-design/icons'

import projectsApi from 'src/apis/projects.api'
import contractsApi from 'src/apis/contracts.api'
import projectPhasesApi from 'src/apis/projectPhases.api'
import paymentsApi from 'src/apis/payments.api'

import type { Project } from 'src/types/projects.type'
import type { Contract } from 'src/types/contract.type'
import type { ProjectPhase } from 'src/types/projectPhase.type'
import type { Payment } from 'src/types/payment.type'
import {
  getContractUrl,
  getProjectStatusLabel,
  getProjectPhaseStatusLabel,
  getPaymentStatusLabel
} from 'src/utils/utils'

export default function DashboardUser() {
  const [openDetail, setOpenDetail] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projectPhases, setProjectPhases] = useState<ProjectPhase[]>([])
  const [projectContracts, setProjectContracts] = useState<Contract[]>([])
  const [projectPayments, setProjectPayments] = useState<Payment[]>([])

  const [totalContracts, setTotalContracts] = useState<Contract[]>([])
  const [totalPaid, setTotalPaid] = useState<number>(0)

  const { data: projectsRes } = useQuery({
    queryKey: ['projectsByEmail'],
    queryFn: () => projectsApi.getProjectsByEmail().then((res) => res.data.data)
  })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const projects: Project[] = projectsRes || []

  // ===== Sau khi có projects thì load hợp đồng + thanh toán =====
  useEffect(() => {
    const fetchContractsAndPayments = async () => {
      let allContracts: Contract[] = []
      let allPayments: Payment[] = []
      let allPhases: ProjectPhase[] = []

      for (const project of projects) {
        const contractsRes = await contractsApi.getContractsByProject(project.id)
        allContracts = [...allContracts, ...(contractsRes.data.data || [])]

        const phasesRes = await projectPhasesApi.getProjectPhasesByProjectId(project.id)
        allPhases = [...allPhases, ...(phasesRes.data.data || [])]

        try {
          const paymentsRes = await paymentsApi.getPaymentsByProjectId(project.id)
          allPayments = [...allPayments, ...(paymentsRes.data.data || [])]
        } catch {
          // nếu API không có thì bỏ qua
        }
      }

      setTotalContracts(allContracts)

      const paidAmount = allPayments
        .filter((p) => p.paymentStatus === 'COMPLETED')
        .reduce((sum, p) => {
          const phase = allPhases.find((ph) => ph.id === p.projectPhaseId)
          return sum + (phase?.amountDue || 0)
        }, 0)

      setTotalPaid(paidAmount)
    }

    if (projects.length > 0) {
      fetchContractsAndPayments()
    }
  }, [projects])

  const totalContractsValue = totalContracts.reduce((sum, c) => sum + (c.totalAmount || 0), 0)
  const totalRemain = totalContractsValue - totalPaid

  const handleOpenDetail = async (project: Project) => {
    setSelectedProject(project)
    setOpenDetail(true)

    try {
      const phasesRes = await projectPhasesApi.getProjectPhasesByProjectId(project.id)
      setProjectPhases(phasesRes.data.data || [])

      const contractsRes = await contractsApi.getContractsByProject(project.id)
      setProjectContracts(contractsRes.data.data || [])

      try {
        const paymentsRes = await paymentsApi.getPaymentsByProjectId(project.id)
        setProjectPayments(paymentsRes.data.data || [])
      } catch {
        setProjectPayments([])
      }
    } catch (error) {
      console.error('Lỗi load chi tiết:', error)
    }
  }

  return (
    <div className='space-y-6'>
      <Row gutter={16}>
        <Col span={8}>
          <Card title='📊 Số dự án đang tham gia' className='shadow-md rounded-xl bg-blue-50'>
            {projects.length}
          </Card>
        </Col>
        <Col span={8}>
          <Card title='📑 Tổng hợp đồng đã ký' className='shadow-md rounded-xl bg-purple-50'>
            {totalContracts.length}
          </Card>
        </Col>
        <Col span={8}>
          <Card title='💵 Đã thanh toán / Còn lại' className='shadow-md rounded-xl bg-green-50'>
            ✅ {totalPaid.toLocaleString()} VND / ⚠️ {totalRemain.toLocaleString()} VND
          </Card>
        </Col>
      </Row>

      <Card title={<span className='text-xl font-bold'>📋 Dự án của tôi</span>} className='shadow-md rounded-xl'>
        <List
          dataSource={projects}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button type='link' onClick={() => handleOpenDetail(item)}>
                  Xem chi tiết
                </Button>
              ]}
            >
              <List.Item.Meta
                title={<span className='text-base font-semibold'>{item.name}</span>}
                description={
                  <div>
                    <p className='mt-2'>{item.description}</p>
                    <p className='my-2'>
                      ⏳ {dayjs(item.startDate).format('DD/MM/YYYY')} - {dayjs(item.endDate).format('DD/MM/YYYY')}
                    </p>
                    <Tag
                      color={
                        item.status === 'COMPLETED'
                          ? 'green'
                          : item.status === 'IN_PROGRESS'
                            ? 'blue'
                            : item.status === 'PENDING'
                              ? 'orange'
                              : 'red'
                      }
                    >
                      {getProjectStatusLabel(item.status)}
                    </Tag>
                  </div>
                }
              />
            </List.Item>
          )}
          locale={{ emptyText: 'Bạn chưa có dự án nào' }}
        />
      </Card>

      <Modal
        title={`📋 Chi tiết dự án: ${selectedProject?.name}`}
        open={openDetail}
        onCancel={() => setOpenDetail(false)}
        footer={null}
        width={900}
      >
        <Card title='📑 Giai đoạn dự án' bordered={false} className='shadow-sm rounded-lg'>
          {projectPhases.length > 0 ? (
            <Timeline
              mode='left'
              items={projectPhases.map((p) => {
                const payment = projectPayments.find((pm) => pm.projectPhaseId === p.id)
                return {
                  label: (
                    <Tag color='blue'>
                      {dayjs(p.startDate).format('DD/MM/YYYY')} - {dayjs(p.endDate).format('DD/MM/YYYY')}
                    </Tag>
                  ),
                  children: (
                    <div className='pl-2'>
                      <p className='font-semibold text-blue-600'>{p.phaseName}</p>
                      <p className='text-gray-600 text-sm'>{p.description || 'Không có mô tả'}</p>
                      <p>
                        <b>Trạng thái giai đoạn:</b>{' '}
                        <Tag
                          color={p.status === 'COMPLETED' ? 'green' : p.status === 'IN_PROGRESS' ? 'orange' : 'default'}
                        >
                          {getProjectPhaseStatusLabel(p.status)}
                        </Tag>
                      </p>
                      <p>
                        <b>Số tiền:</b> {p.amountDue.toLocaleString()} VND
                      </p>

                      <p>
                        <b>Thanh toán:</b>{' '}
                        {payment ? (
                          <Tag
                            color={
                              payment.paymentStatus === 'COMPLETED'
                                ? 'green'
                                : payment.paymentStatus === 'FAILED'
                                  ? 'red'
                                  : 'default'
                            }
                          >
                            {getPaymentStatusLabel(payment.paymentStatus)}
                          </Tag>
                        ) : (
                          <Tag color='default'>Chưa có</Tag>
                        )}
                      </p>
                    </div>
                  )
                }
              })}
            />
          ) : (
            <p className='text-gray-500 italic'>Chưa có giai đoạn nào</p>
          )}
        </Card>

        <Divider />

        <Card title='📄 Hợp đồng' bordered={false} className='shadow-sm rounded-lg mt-4'>
          {projectContracts.length > 0 ? (
            projectContracts.map((c) => (
              <div key={c.id} className='border p-3 mb-3 rounded-lg bg-gray-50 hover:shadow transition'>
                <p>
                  <b>Số hợp đồng:</b> {c.contractNumber}
                </p>
                <p>
                  <b>Giá trị:</b> {c.totalAmount?.toLocaleString() || 0} VND
                </p>
                <p>
                  <b>Ngày ký:</b> {c.signedDate ? dayjs(c.signedDate).format('DD/MM/YYYY') : 'Chưa ký'}
                </p>
                <p>
                  <b>File:</b>{' '}
                  {c.contractFile ? (
                    <a
                      href={getContractUrl(c.contractFile as string)}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline'
                    >
                      <FilePdfOutlined /> Xem hợp đồng
                    </a>
                  ) : (
                    <span className='text-gray-400 italic'>Chưa có file</span>
                  )}
                </p>
              </div>
            ))
          ) : (
            <p className='text-gray-500 italic'>Chưa có hợp đồng</p>
          )}
        </Card>
      </Modal>
    </div>
  )
}
