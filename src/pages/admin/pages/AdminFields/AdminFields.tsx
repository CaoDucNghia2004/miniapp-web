import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Table, Button, Modal, Form, Input, Space, Popconfirm, Card, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, AppstoreAddOutlined } from '@ant-design/icons'
import fieldsApi from 'src/apis/fields.api'
import type { Field } from 'src/types/field.type'

export default function AdminFields() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Field | null>(null)
  const [search, setSearch] = useState('')
  const [form] = Form.useForm()

  const [messageApi, contextHolder] = message.useMessage()

  const { data, isLoading } = useQuery({
    queryKey: ['fields'],
    queryFn: () => fieldsApi.getAllFields().then((res) => res.data.data)
  })

  const createField = useMutation({
    mutationFn: (body: { fieldName: string; description: string }) => fieldsApi.createField(body),
    onSuccess: (res) => {
      messageApi.success(res.data.message || 'Tạo lĩnh vực thành công')
      queryClient.invalidateQueries({ queryKey: ['fields'] })
      setOpen(false)
      form.resetFields()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      messageApi.error(error?.response?.data?.message || 'Tạo lĩnh vực thất bại')
    }
  })

  const updateField = useMutation({
    mutationFn: (body: { id: number; fieldName: string; description: string }) => fieldsApi.updateField(body.id, body),
    onSuccess: (res) => {
      messageApi.success(res.data.message || 'Cập nhật lĩnh vực thành công')
      queryClient.invalidateQueries({ queryKey: ['fields'] })
      setOpen(false)
      setEditing(null)
      form.resetFields()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      messageApi.error(error?.response?.data?.message || 'Cập nhật thất bại')
    }
  })

  const deleteField = useMutation({
    mutationFn: (id: number) => fieldsApi.deleteField(id),
    onSuccess: (res) => {
      messageApi.success(res.data.message || 'Xóa lĩnh vực thành công')
      queryClient.invalidateQueries({ queryKey: ['fields'] })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      messageApi.error(error?.response?.data?.message || 'Xóa thất bại')
    }
  })

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'Tên lĩnh vực', dataIndex: 'fieldName' },
    { title: 'Mô tả', dataIndex: 'description' },
    {
      title: 'Thao tác',
      width: 200,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: Field) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(record)
              form.setFieldsValue(record)
              setOpen(true)
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title='Bạn có chắc muốn xóa lĩnh vực này?'
            okText='Xóa'
            cancelText='Hủy'
            okButtonProps={{ danger: true }}
            cancelButtonProps={{ type: 'default' }}
            placement='bottomRight'
            onConfirm={() => deleteField.mutate(record.id)}
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const filteredData = (data || [])
    .sort((a, b) => b.id - a.id)
    .filter((f) => f.fieldName.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className='space-y-4'>
      {contextHolder}

      <Card
        title={
          <span className='text-xl font-bold flex items-center gap-2'>
            <AppstoreAddOutlined /> Quản lý lĩnh vực
          </span>
        }
        extra={
          <Space>
            <Input.Search
              placeholder='Tìm kiếm lĩnh vực...'
              allowClear
              onSearch={(value) => setSearch(value)}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 250 }}
              prefix={<SearchOutlined />}
            />
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => {
                setEditing(null)
                setOpen(true)
                form.resetFields()
              }}
            >
              Thêm lĩnh vực
            </Button>
          </Space>
        }
      >
        <Table<Field>
          loading={isLoading}
          rowKey='id'
          dataSource={filteredData}
          columns={columns}
          bordered
          pagination={{ pageSize: 5 }}
          rowClassName={(_, index) => (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}
        />
      </Card>

      <Modal
        open={open}
        title={editing ? '✏️ Sửa lĩnh vực' : '➕ Thêm lĩnh vực'}
        onCancel={() => {
          setOpen(false)
          setEditing(null)
        }}
        onOk={() => form.submit()}
        okText='Lưu'
        cancelText='Hủy'
        style={{ borderRadius: 12 }}
      >
        <Form
          form={form}
          layout='vertical'
          onFinish={(values) => {
            if (editing) {
              updateField.mutate({ ...values, id: editing.id })
            } else {
              createField.mutate(values)
            }
          }}
        >
          {editing && (
            <Form.Item label='ID' name='id'>
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item
            label='Tên lĩnh vực'
            name='fieldName'
            rules={[{ required: true, message: 'Vui lòng nhập tên lĩnh vực' }]}
          >
            <Input placeholder='Nhập tên lĩnh vực...' />
          </Form.Item>
          <Form.Item label='Mô tả' name='description'>
            <Input.TextArea rows={3} placeholder='Nhập mô tả (không bắt buộc)' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
