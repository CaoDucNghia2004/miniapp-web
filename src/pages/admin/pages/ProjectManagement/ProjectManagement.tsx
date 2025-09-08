import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Table, Tag, Button, Modal, Form, Input, DatePicker, Select, message, Descriptions } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import projectsApi from 'src/apis/projects.api'
import fieldsApi from 'src/apis/fields.api'
import adminUsersApi from 'src/apis/adminUsers.api'
import type { Project } from 'src/types/projects.type'
import type { Field } from 'src/types/field.type'
import type { User } from 'src/types/user.type'
import { getProjectStatusLabel } from 'src/utils/utils'
import dayjs from 'dayjs'
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons'

const renderStatusTag = (status: Project['status']) => {
  switch (status) {
    case 'PENDING':
      return (
        <Tag color='orange' icon={<ClockCircleOutlined />}>
          {getProjectStatusLabel(status)}
        </Tag>
      )
    case 'IN_PROGRESS':
      return (
        <Tag color='blue' icon={<SyncOutlined spin />}>
          {getProjectStatusLabel(status)}
        </Tag>
      )
    case 'COMPLETED':
      return (
        <Tag color='green' icon={<CheckCircleOutlined />}>
          {getProjectStatusLabel(status)}
        </Tag>
      )
    case 'CANCELLED':
      return (
        <Tag color='red' icon={<CloseCircleOutlined />}>
          {getProjectStatusLabel(status)}
        </Tag>
      )
    default:
      return <Tag>{status}</Tag>
  }
}

export default function ProjectManagement() {
  const queryClient = useQueryClient()
  const [openModal, setOpenModal] = useState(false)
  const [openDetailModal, setOpenDetailModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getAllProjects().then((res) => res.data.data)
  })

  const { data: fields } = useQuery({
    queryKey: ['fields'],
    queryFn: () => fieldsApi.getAllFields().then((res) => res.data.data)
  })

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => adminUsersApi.getAllUsers().then((res) => res.data.data)
  })

  const createMutation = useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: (res) => {
      messageApi.success(res.data.message || 'Tạo dự án thành công')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setOpenModal(false)
      form.resetFields()
    },
    onError: () => {
      messageApi.error('Tạo dự án thất bại')
    }
  })

  const updateMutation = useMutation({
    mutationFn: projectsApi.updateProject,
    onSuccess: (res) => {
      messageApi.success(res.data.message || 'Cập nhật dự án thành công')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setOpenModal(false)
      form.resetFields()
    },
    onError: () => {
      messageApi.error('Cập nhật dự án thất bại')
    }
  })

  const handleSubmit = (values: {
    name: string
    description: string
    startDate: dayjs.Dayjs
    endDate: dayjs.Dayjs
    fieldId: number
    userId: number
    status: Project['status']
  }) => {
    const payload = {
      ...values,
      startDate: values.startDate.format('YYYY-MM-DD'),
      endDate: values.endDate.format('YYYY-MM-DD')
    }

    if (editingProject) {
      updateMutation.mutate({ ...payload, id: editingProject.id })
    } else {
      createMutation.mutate(payload)
    }
  }

  const columns: ColumnsType<Project> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    { title: 'Tên dự án', dataIndex: 'name', key: 'name' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: Project['status']) => renderStatusTag(status)
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <>
          <Button
            type='link'
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedProject(record)
              setOpenDetailModal(true)
            }}
          >
            Xem
          </Button>
          <Button
            type='link'
            icon={<EditOutlined />}
            onClick={() => {
              setEditingProject(record)
              setOpenModal(true)
              form.setFieldsValue({
                ...record,
                startDate: dayjs(record.startDate),
                endDate: dayjs(record.endDate),
                fieldId: record.fieldId,
                userId: record.userId,
                status: record.status
              })
            }}
          >
            Sửa
          </Button>
        </>
      )
    }
  ]

  return (
    <div>
      {contextHolder}

      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold'>Quản lý dự án</h2>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingProject(null)
            setOpenModal(true)
            form.resetFields()
          }}
        >
          Thêm dự án
        </Button>
      </div>

      <Table<Project>
        rowKey='id'
        loading={isLoading}
        dataSource={(data || []).sort((a, b) => b.id - a.id)}
        columns={columns}
        bordered
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingProject ? 'Cập nhật dự án' : 'Thêm dự án'}
        open={openModal}
        onCancel={() => {
          setOpenModal(false)
          form.resetFields()
        }}
        onOk={() => form.submit()}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Form.Item label='Tên dự án' name='name' rules={[{ required: true, message: 'Nhập tên dự án' }]}>
            <Input />
          </Form.Item>
          <Form.Item label='Mô tả' name='description'>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label='Ngày bắt đầu' name='startDate' rules={[{ required: true }]}>
            <DatePicker format='DD/MM/YYYY' />
          </Form.Item>
          <Form.Item label='Ngày kết thúc' name='endDate' rules={[{ required: true }]}>
            <DatePicker format='DD/MM/YYYY' />
          </Form.Item>
          <Form.Item label='Lĩnh vực' name='fieldId' rules={[{ required: true }]}>
            <Select
              options={(fields || []).map((f: Field) => ({
                label: f.fieldName,
                value: f.id
              }))}
            />
          </Form.Item>
          <Form.Item label='Khách hàng' name='userId' rules={[{ required: true }]}>
            <Select
              showSearch
              options={(users || []).map((u: User) => ({
                label: `${u.name || 'Chưa có tên'} - ${u.email}`,
                value: u.id
              }))}
            />
          </Form.Item>
          <Form.Item label='Trạng thái' name='status' rules={[{ required: true }]}>
            <Select
              options={[
                { label: 'Đang chờ', value: 'PENDING' },
                { label: 'Đang thực hiện', value: 'IN_PROGRESS' },
                { label: 'Hoàn thành', value: 'COMPLETED' },
                { label: 'Đã hủy', value: 'CANCELLED' }
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title='Chi tiết dự án' open={openDetailModal} onCancel={() => setOpenDetailModal(false)} footer={null}>
        {selectedProject && (
          <Descriptions column={1} bordered size='small'>
            <Descriptions.Item label='ID'>{selectedProject.id}</Descriptions.Item>
            <Descriptions.Item label='Tên dự án'>{selectedProject.name}</Descriptions.Item>
            <Descriptions.Item label='Mô tả'>{selectedProject.description}</Descriptions.Item>
            <Descriptions.Item label='Ngày bắt đầu'>
              {new Date(selectedProject.startDate).toLocaleDateString('vi-VN')}
            </Descriptions.Item>
            <Descriptions.Item label='Ngày kết thúc'>
              {new Date(selectedProject.endDate).toLocaleDateString('vi-VN')}
            </Descriptions.Item>
            <Descriptions.Item label='Trạng thái'>{renderStatusTag(selectedProject.status)}</Descriptions.Item>
            <Descriptions.Item label='Người tạo'>{selectedProject.createdBy}</Descriptions.Item>
            <Descriptions.Item label='Ngày tạo'>
              {new Date(selectedProject.createdAt).toLocaleDateString('vi-VN')}
            </Descriptions.Item>
            {selectedProject.updatedBy && (
              <Descriptions.Item label='Người cập nhật'>{selectedProject.updatedBy}</Descriptions.Item>
            )}
            {selectedProject.updatedAt && (
              <Descriptions.Item label='Ngày cập nhật'>
                {new Date(selectedProject.updatedAt).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
            )}
            <Descriptions.Item label='Đánh giá'>{selectedProject.rating ?? '-'}</Descriptions.Item>
            <Descriptions.Item label='Nhận xét'>{selectedProject.review ?? '-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}
