import { useState } from 'react'
import {
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  Input,
  Descriptions,
  Card,
  message,
  Space,
  Divider
} from 'antd'
import {
  EditOutlined,
  DollarOutlined,
  EyeOutlined,
  FileTextOutlined,
  ScheduleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  FilterOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import projectsApi from 'src/apis/projects.api'
import projectPhasesApi from 'src/apis/projectPhases.api'
import paymentsApi from 'src/apis/payments.api'
import adminUsersApi from 'src/apis/adminUsers.api'
import contractsApi from 'src/apis/contracts.api'

import type { Project } from 'src/types/projects.type'
import type { ProjectPhase } from 'src/types/projectPhase.type'
import type { Payment } from 'src/types/payment.type'
import type { Contract } from 'src/types/contract.type'

import { getProjectPhaseStatusLabel, getProjectStatusLabel } from 'src/utils/utils'

export default function PaymentManagement() {
  const [openModal, setOpenModal] = useState(false)
  const [openDetailModal, setOpenDetailModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedPhase, setSelectedPhase] = useState<ProjectPhase | null>(null)
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const [messageApi, contextHolder] = message.useMessage()
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const { data: projectsRes } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getAllProjects().then((res) => res.data.data)
  })
  const projects: Project[] = (projectsRes || []).sort((a: Project, b: Project) => b.id - a.id)

  const filteredProjects = statusFilter ? projects.filter((p) => p.status === statusFilter) : projects

  const { data: contractsRes } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => contractsApi.getAllContracts().then((res) => res.data.data)
  })
  const contracts: Contract[] = contractsRes || []

  const { data: usersRes } = useQuery({
    queryKey: ['users'],
    queryFn: () => adminUsersApi.getAllUsers().then((res) => res.data.data)
  })
  const users = usersRes || []

  const { data: phasesRes } = useQuery({
    queryKey: ['phases', selectedProject?.id],
    queryFn: () =>
      selectedProject
        ? projectPhasesApi.getProjectPhasesByProjectId(selectedProject.id).then((res) => res.data.data)
        : Promise.resolve([]),
    enabled: !!selectedProject?.id
  })
  const phases: ProjectPhase[] = phasesRes || []

  const { data: paymentsRes } = useQuery({
    queryKey: ['payments', selectedProject?.id],
    queryFn: () =>
      selectedProject
        ? paymentsApi.getPaymentsByProjectId(selectedProject.id).then((res) => res.data.data)
        : Promise.resolve([]),
    enabled: !!selectedProject?.id
  })
  const payments: Payment[] = paymentsRes || []

  const createPaymentMutation = useMutation({
    mutationFn: paymentsApi.createPayment,
    onSuccess: (res) => {
      messageApi.success(res.data.message || '✅ Tạo thanh toán thành công')
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      setOpenModal(false)
      form.resetFields()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errMsg = error?.response?.data?.message || '❌ Tạo thanh toán thất bại'
      messageApi.error(errMsg)
    }
  })

  const updatePaymentMutation = useMutation({
    mutationFn: paymentsApi.updatePayment,
    onSuccess: (res) => {
      messageApi.success(res.data.message || '✅ Cập nhật thanh toán thành công')
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      setOpenModal(false)
      form.resetFields()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errMsg = error?.response?.data?.message || '❌ Cập nhật thanh toán thất bại'
      messageApi.error(errMsg)
    }
  })

  const getTotalContract = (projectId: number) => {
    const c = contracts.find((con) => con.projectId === projectId)
    return c ? c.totalAmount : 0
  }

  const getTotalPhaseAmount = (projectId: number) =>
    phases.filter((ph) => ph.projectId === projectId).reduce((sum, ph) => sum + (ph.amountDue || 0), 0)

  const getTotalPaidAmount = (projectId: number) =>
    phases
      .filter((ph) => ph.projectId === projectId)
      .reduce((sum, ph) => {
        const payment = payments.find((p) => p.projectPhaseId === ph.id && p.paymentStatus === 'COMPLETED')
        return sum + (payment ? ph.amountDue : 0)
      }, 0)

  const columns = [
    {
      title: 'Tên dự án',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <FileTextOutlined style={{ color: '#1890ff' }} />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: 'Khách hàng',
      dataIndex: 'userId',
      key: 'userId',
      render: (id: number) => {
        const user = users.find((u) => u.id === id)
        return user ? user.name || user.email : `Khách hàng #${id}`
      }
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (record: Project) => (
        <Space>
          <ScheduleOutlined style={{ color: '#722ed1' }} />
          {dayjs(record.startDate).format('DD/MM/YYYY')} - {dayjs(record.endDate).format('DD/MM/YYYY')}
        </Space>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (s: Project['status']) => {
        const label = getProjectStatusLabel(s)
        let color: string = 'blue'
        if (s === 'COMPLETED') color = 'green'
        if (s === 'CANCELLED') color = 'red'
        return <Tag color={color}>{label}</Tag>
      }
    },
    {
      title: 'Tổng hợp đồng',
      key: 'contract',
      render: (record: Project) => (
        <span style={{ fontWeight: 600, color: '#fa8c16' }}>💰 {getTotalContract(record.id).toLocaleString()} VND</span>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: Project) => (
        <Space>
          <Button
            type='primary'
            icon={<EditOutlined />}
            disabled={record.status === 'CANCELLED'}
            onClick={() => {
              setSelectedProject(record)
              setSelectedPhase(null)
              setCurrentPayment(null)
              form.resetFields()
              form.setFieldValue('projectId', record.id)
              setOpenModal(true)
            }}
          >
            Thanh toán
          </Button>

          <Button
            type='dashed'
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedProject(record)
              setOpenDetailModal(true)
            }}
          >
            Chi tiết
          </Button>
        </Space>
      )
    }
  ]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (values: any) => {
    if (!selectedPhase) return

    const payload = {
      projectPhaseId: values.phaseId,
      paymentDate: values.paymentDate.format('YYYY-MM-DD'),
      paymentStatus: values.paymentStatus,
      transactionId: values.transactionId
    }

    if (selectedProject?.status === 'CANCELLED') {
      messageApi.error('❌ Dự án đã hủy, không thể tạo thanh toán')
      return
    }

    if (currentPayment) {
      updatePaymentMutation.mutate({ ...payload, id: currentPayment.id })
    } else {
      createPaymentMutation.mutate(payload)
    }
  }

  const handleSelectPhase = (phaseId: number) => {
    const phase = phases.find((ph) => ph.id === phaseId) || null
    setSelectedPhase(phase)

    if (phase) {
      const payment = payments.find((p) => p.projectPhaseId === phase.id) || null
      setCurrentPayment(payment)

      if (payment) {
        form.setFieldsValue({
          phaseId: phase.id,
          paymentDate: dayjs(payment.paymentDate),
          paymentStatus: payment.paymentStatus,
          transactionId: payment.transactionId
        })
      } else {
        form.setFieldsValue({
          phaseId: phase.id,
          paymentDate: null,
          paymentStatus: undefined,
          transactionId: ''
        })
      }
    }
  }

  return (
    <div className='space-y-4'>
      {contextHolder}
      <Card
        title={
          <span className='text-xl font-bold flex items-center gap-2'>
            <DollarOutlined /> Quản lý thanh toán
          </span>
        }
        extra={
          <Space>
            <span className='font-medium flex items-center gap-1'>
              <FilterOutlined /> Lọc theo trạng thái:
            </span>
            <Select
              value={statusFilter || 'ALL'}
              style={{ width: 200 }}
              onChange={(value) => setStatusFilter(value === 'ALL' ? null : value)}
              options={[
                { label: '🌍 Tất cả', value: 'ALL' },
                { label: '⏳ Đang chờ', value: 'PENDING' },
                { label: '🚧 Đang thực hiện', value: 'IN_PROGRESS' },
                { label: '✅ Hoàn thành', value: 'COMPLETED' },
                { label: '❌ Đã hủy', value: 'CANCELLED' }
              ]}
            />
          </Space>
        }
      >
        <Table rowKey='id' columns={columns} dataSource={filteredProjects} pagination={{ pageSize: 5 }} />
      </Card>

      <Modal
        title={currentPayment ? '✏️ Cập nhật thanh toán' : '➕ Tạo thanh toán'}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        width={750}
        footer={null}
        style={{ borderRadius: 12 }}
      >
        <Form form={form} layout='vertical' onFinish={handleSubmit} className='space-y-4'>
          <Card size='small' title='📌 Thông tin dự án' bordered={false}>
            {selectedProject && (
              <p>
                <b>Dự án:</b> {selectedProject.name}
              </p>
            )}
          </Card>

          <Divider />
          {selectedProject && (
            <Card size='small' title='📑 Thông tin giai đoạn' bordered={false}>
              <Form.Item label='Chọn giai đoạn' name='phaseId' rules={[{ required: true }]}>
                <Select
                  placeholder='Chọn giai đoạn'
                  onChange={handleSelectPhase}
                  options={phases.map((ph) => ({ label: ph.phaseName, value: ph.id }))}
                />
              </Form.Item>

              {selectedPhase && (
                <Descriptions bordered column={1} size='middle'>
                  <Descriptions.Item label='Tên giai đoạn'>{selectedPhase.phaseName}</Descriptions.Item>
                  <Descriptions.Item label='Mô tả'>{selectedPhase.description}</Descriptions.Item>
                  <Descriptions.Item label='Thời gian'>
                    {dayjs(selectedPhase.startDate).format('DD/MM/YYYY')} -{' '}
                    {dayjs(selectedPhase.endDate).format('DD/MM/YYYY')}
                  </Descriptions.Item>
                  <Descriptions.Item label='Trạng thái'>
                    <Tag color={selectedPhase.status === 'COMPLETED' ? 'green' : 'blue'}>
                      {getProjectPhaseStatusLabel(selectedPhase.status)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label='Số tiền'>
                    💰 {selectedPhase.amountDue.toLocaleString()} VND
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Card>
          )}

          {selectedPhase && (
            <Card size='small' title='💳 Thông tin thanh toán' bordered={false}>
              <Form.Item label='Ngày thanh toán' name='paymentDate' rules={[{ required: true }]}>
                <DatePicker className='w-full' format='DD/MM/YYYY' />
              </Form.Item>

              <Form.Item label='Trạng thái thanh toán' name='paymentStatus' rules={[{ required: true }]}>
                <Select
                  placeholder='Chọn trạng thái'
                  options={[
                    { label: '⏳ Đang chờ', value: 'PENDING', icon: <ClockCircleOutlined /> },
                    {
                      label: '✅ Hoàn tất',
                      value: 'COMPLETED',
                      disabled: selectedPhase?.status !== 'COMPLETED',
                      icon: <CheckCircleOutlined />
                    },
                    { label: '❌ Thất bại', value: 'FAILED', icon: <CloseCircleOutlined /> }
                  ]}
                />
              </Form.Item>

              <Form.Item label='Mã giao dịch (TransactionId)' name='transactionId'>
                <Input placeholder='Nhập mã giao dịch (nếu có)' />
              </Form.Item>
            </Card>
          )}

          <div className='flex justify-end gap-2 mt-4'>
            <Button onClick={() => setOpenModal(false)}>Hủy</Button>
            <Button type='primary' htmlType='submit'>
              {currentPayment ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title='📊 Chi tiết thanh toán'
        open={openDetailModal}
        onCancel={() => setOpenDetailModal(false)}
        width={650}
        footer={null}
        style={{ borderRadius: 12 }}
      >
        {selectedProject && (
          <Card>
            <Descriptions bordered column={1} size='middle'>
              <Descriptions.Item label='Tổng số giai đoạn'>
                {phases.filter((ph) => ph.projectId === selectedProject.id).length}
              </Descriptions.Item>
              <Descriptions.Item label='Số giai đoạn đã thanh toán'>
                {
                  phases.filter(
                    (ph) =>
                      ph.projectId === selectedProject.id &&
                      payments.some((p) => p.projectPhaseId === ph.id && p.paymentStatus === 'COMPLETED')
                  ).length
                }
              </Descriptions.Item>
              <Descriptions.Item label='Tổng tiền cần thanh toán'>
                💵 {getTotalPhaseAmount(selectedProject.id).toLocaleString()} VND
              </Descriptions.Item>
              <Descriptions.Item label='Tổng tiền đã thanh toán'>
                ✅ {getTotalPaidAmount(selectedProject.id).toLocaleString()} VND
              </Descriptions.Item>
              <Descriptions.Item label='Còn lại'>
                ⚠️ {(getTotalPhaseAmount(selectedProject.id) - getTotalPaidAmount(selectedProject.id)).toLocaleString()}{' '}
                VND
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </Modal>
    </div>
  )
}
