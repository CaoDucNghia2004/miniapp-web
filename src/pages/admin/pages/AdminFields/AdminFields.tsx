import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Table, Button, Modal, Form, Input, Space, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import fieldsApi from 'src/apis/fields.api'
import type { Field } from 'src/types/field.type'
import { message } from 'antd'

export default function AdminFields() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Field | null>(null)
  const [search, setSearch] = useState('')
  const [form] = Form.useForm()

  // AntD v5: hook để hiển thị message
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
    <div>
      {/* 👇 cái này bắt buộc để render message */}
      {contextHolder}

      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold'>Quản lý lĩnh vực</h2>
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
      </div>

      <Table<Field>
        loading={isLoading}
        rowKey='id'
        dataSource={filteredData}
        columns={columns}
        bordered
        pagination={{ pageSize: 5 }}
      />

      <Modal
        open={open}
        title={editing ? 'Sửa lĩnh vực' : 'Thêm lĩnh vực'}
        onCancel={() => {
          setOpen(false)
          setEditing(null)
        }}
        onOk={() => form.submit()}
        okText='Lưu'
        cancelText='Hủy'
        destroyOnHidden
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
            <Input />
          </Form.Item>
          <Form.Item label='Mô tả' name='description'>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
