import { useState } from 'react'
import { Table, Tag, Button, Input, Modal, Form, Space, message, Select } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import formsApi from 'src/apis/forms.api'
import type { Form as FormType } from 'src/types/form.type'
import adminUsersApi from 'src/apis/adminUsers.api'
import authApi from 'src/apis/auth.api'

export default function AccountRequests() {
  const [selected, setSelected] = useState<FormType | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [pwd, setPwd] = useState('Aa@123456')
  const [form] = Form.useForm()
  const [filter, setFilter] = useState<'all' | 'advised' | 'notAdvised'>('all')
  const [search, setSearch] = useState('')

  const [messageApi, contextHolder] = message.useMessage()

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['forms'],
    queryFn: () => formsApi.getAllForms().then((res) => res.data.data)
  })

  const updateAdvisedMutation = useMutation({
    mutationFn: (id: number) => formsApi.updateForm(id, { isAdvised: true }),
    onSuccess: (_, id) => {
      queryClient.setQueryData<FormType[]>(['forms'], (old) =>
        old ? old.map((f) => (f.id === id ? { ...f, isAdvised: true } : f)) : old
      )
      messageApi.success('Đã đánh dấu tư vấn')
    },
    onError: () => {
      messageApi.error('Cập nhật thất bại, vui lòng thử lại')
    }
  })

  const createAccountMutation = useMutation({
    mutationFn: async (body: { email: string; password: string; name: string; phone: string; companyName: string }) => {
      // Tạo user bằng adminUsersApi
      const res = await adminUsersApi.createUser(body)

      // Gửi mail cho khách hàng
      await authApi.sendAccount({
        email: body.email,
        password: body.password,
        loginUrl: 'http://localhost:3000/login'
      })

      return res
    },
    onSuccess: (res) => {
      messageApi.success(res.data.message || 'Đã tạo tài khoản & gửi mail cho khách hàng')
      setOpenModal(false)
      form.resetFields()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errMsg = error?.response?.data?.message || 'Tạo tài khoản thất bại'
      messageApi.error(errMsg) // ✅
      if (errMsg.toLowerCase().includes('email')) {
        form.setFields([{ name: 'email', errors: [errMsg] }])
      } else {
        form.setFields([{ name: 'password', errors: [errMsg] }])
      }
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
      dataIndex: 'isAdvised',
      key: 'isAdvised',
      align: 'center' as const,
      render: (isAdvised: boolean, record: FormType) =>
        isAdvised ? (
          <Tag color='green'>Đã tư vấn</Tag>
        ) : (
          <Button
            size='small'
            loading={updateAdvisedMutation.isPending && updateAdvisedMutation.variables === record.id}
            onClick={() => handleUpdateAdvised(record.id)}
          >
            Đánh dấu đã tư vấn
          </Button>
        )
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right' as const,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: FormType) => (
        <Button
          type='primary'
          disabled={!record.isAdvised}
          onClick={() => {
            setSelected(record)
            setOpenModal(true)
            setPwd('Aa@123456')
            form.resetFields()
          }}
        >
          Tạo tài khoản
        </Button>
      )
    }
  ]

  const filteredForms = (data || [])
    .filter((f) => {
      const matchFilter =
        filter === 'all' || (filter === 'advised' && f.isAdvised) || (filter === 'notAdvised' && !f.isAdvised)

      const keyword = search.trim().toLowerCase()
      const matchSearch =
        !keyword ||
        f.name?.toLowerCase().includes(keyword) ||
        f.email?.toLowerCase().includes(keyword) ||
        f.phone?.toLowerCase().includes(keyword) ||
        f.companyName?.toLowerCase().includes(keyword)

      return matchFilter && matchSearch
    })
    .sort((a, b) => b.id - a.id)

  return (
    <div>
      {contextHolder}
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold'>Quản lý đăng ký</h2>
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
        rowClassName={(_, index) => (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}
      />
      <Modal title='Tạo tài khoản khách hàng' open={openModal} onCancel={() => setOpenModal(false)} footer={null}>
        <Form form={form} layout='vertical' initialValues={{ email: selected?.email }}>
          <Form.Item label='Email' name='email'>
            <Input disabled />
          </Form.Item>
          <Form.Item label='Mật khẩu' name='password' validateTrigger={false}>
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
              loading={createAccountMutation.isPending}
              onClick={() => {
                if (!selected) return
                form.setFields([
                  { name: 'email', errors: [] },
                  { name: 'password', errors: [] }
                ]) // clear lỗi cũ
                createAccountMutation.mutate({
                  email: selected.email,
                  password: pwd,
                  name: selected.name,
                  phone: selected.phone,
                  companyName: selected.companyName
                })
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
