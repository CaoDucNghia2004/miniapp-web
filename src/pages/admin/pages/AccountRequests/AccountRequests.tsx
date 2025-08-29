import { useState } from 'react'
import { Table, Tag, Button, Input, Modal, Form, Space, message, Select } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import formsApi from 'src/apis/forms.api'
import type { Form as FormType } from 'src/types/form.type'

export default function AccountRequests() {
  const [selected, setSelected] = useState<FormType | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [pwd, setPwd] = useState('Aa@123456')
  const [form] = Form.useForm()
  const [filter, setFilter] = useState<'all' | 'advised' | 'notAdvised'>('all')
  const [search, setSearch] = useState('')

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['forms'],
    queryFn: () => formsApi.getAllForms().then((res) => res.data.data)
  })

  // ✅ Dùng mutation để update "advised"
  const updateAdvisedMutation = useMutation({
    mutationFn: (id: number) => formsApi.updateForm(id, { advised: true }), // giả sử có API updateForm
    onSuccess: (_, id) => {
      queryClient.setQueryData<FormType[]>(['forms'], (old) =>
        old ? old.map((f) => (f.id === id ? { ...f, advised: true } : f)) : old
      )
      message.success('Đã đánh dấu tư vấn')
    }
  })

  const handleUpdateAdvised = (id: number) => {
    updateAdvisedMutation.mutate(id)
  }

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: FormType) => (
        <div>
          <div className='font-medium'>{text}</div>
          <div className='text-xs text-gray-500'>#{record.id}</div>
        </div>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => (
        <span>
          <MailOutlined className='mr-1' /> {text}
        </span>
      )
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
      render: (text: string) =>
        text ? (
          <>
            <PhoneOutlined className='mr-1' />
            {text}
          </>
        ) : (
          '-'
        )
    },
    { title: 'Công ty', dataIndex: 'companyName', key: 'companyName' },
    { title: 'Lĩnh vực', dataIndex: 'fieldName', key: 'fieldName' },
    {
      title: 'Tư vấn',
      dataIndex: 'advised',
      key: 'advised',
      align: 'center' as const,
      render: (advised: boolean, record: FormType) =>
        advised ? (
          <Tag color='green'>Đã tư vấn</Tag>
        ) : (
          <Button size='small' loading={updateAdvisedMutation.isPending} onClick={() => handleUpdateAdvised(record.id)}>
            Đánh dấu đã tư vấn
          </Button>
        )
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: FormType) => (
        <Button
          type='primary'
          disabled={!record.advised}
          onClick={() => {
            setSelected(record)
            setOpenModal(true)
            setPwd('Aa@123456')
          }}
        >
          Tạo tài khoản
        </Button>
      )
    }
  ]

  const filteredForms = (data || []).filter((f) => {
    const matchFilter =
      filter === 'all' || (filter === 'advised' && f.advised) || (filter === 'notAdvised' && !f.advised)

    const keyword = search.trim().toLowerCase()
    const matchSearch =
      !keyword ||
      f.name?.toLowerCase().includes(keyword) ||
      f.email?.toLowerCase().includes(keyword) ||
      f.phone?.toLowerCase().includes(keyword) ||
      f.companyName?.toLowerCase().includes(keyword)

    return matchFilter && matchSearch
  })

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold'>Quản lý đăng ký</h2>
        <Space>
          <Input.Search
            placeholder='Tìm tên, email, công ty, SĐT...'
            onSearch={(val) => setSearch(val)}
            allowClear
            style={{ width: 250 }}
          />
          <Select
            value={filter}
            onChange={(val) => setFilter(val)}
            style={{ width: 180 }}
            options={[
              { label: 'Tất cả', value: 'all' },
              { label: 'Đã tư vấn', value: 'advised' },
              { label: 'Chưa tư vấn', value: 'notAdvised' }
            ]}
          />
        </Space>
      </div>

      <Table<FormType>
        loading={isLoading}
        dataSource={filteredForms}
        columns={columns}
        rowKey='id'
        pagination={{ pageSize: 5 }}
        bordered
        size='middle'
        rowClassName={(_, index) => (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}
      />

      <Modal title='Tạo tài khoản khách hàng' open={openModal} onCancel={() => setOpenModal(false)} footer={null}>
        <Form form={form} layout='vertical'>
          <Form.Item label='Email'>
            <Input defaultValue={selected?.email} />
          </Form.Item>
          <Form.Item label='Mật khẩu'>
            <Input.Password
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <div className='flex justify-end gap-2'>
            <Button onClick={() => setOpenModal(false)}>Hủy</Button>
            <Button
              type='primary'
              onClick={() => {
                // TODO: gọi API tạo account + gửi mail
                message.success('Đã tạo tài khoản & gửi mail')
                setOpenModal(false)
              }}
            >
              Lưu & Gửi mail
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
