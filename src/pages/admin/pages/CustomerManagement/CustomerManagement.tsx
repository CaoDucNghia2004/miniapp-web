import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Table, Input, Space, Card } from 'antd'
import { SearchOutlined, TeamOutlined } from '@ant-design/icons'
import adminUsersApi from 'src/apis/adminUsers.api'
import type { User } from 'src/types/user.type'

export default function CustomerManagement() {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => adminUsersApi.getAllUsers().then((res) => res.data.data)
  })

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 70
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone'
    },
    {
      title: 'Công ty',
      dataIndex: 'companyName'
    }
  ]

  const filteredData = (data || [])
    .sort((a: User, b: User) => b.id - a.id)
    .filter(
      (u: User) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className='space-y-4'>
      <Card
        title={
          <span className='text-xl font-bold flex items-center gap-2'>
            <TeamOutlined /> Quản lý khách hàng
          </span>
        }
        extra={
          <Space>
            <Input.Search
              placeholder='Tìm kiếm khách hàng...'
              allowClear
              onSearch={(value) => setSearch(value)}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 250 }}
              prefix={<SearchOutlined />}
            />
          </Space>
        }
      >
        <Table<User>
          loading={isLoading}
          rowKey='id'
          dataSource={filteredData}
          columns={columns}
          bordered
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  )
}
