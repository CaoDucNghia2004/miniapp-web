import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Table, Tag, Card, Input, Divider } from 'antd'
import dayjs from 'dayjs'

import contractsApi from 'src/apis/contracts.api'
import projectsApi from 'src/apis/projects.api'
import adminUsersApi from 'src/apis/adminUsers.api'

import type { Contract } from 'src/types/contract.type'
import type { Project } from 'src/types/projects.type'
import type { User } from 'src/types/user.type'

import { getContractUrl } from 'src/utils/utils'

const { Search } = Input

export default function ContractManagement() {
  const [searchText, setSearchText] = useState('')

  const { data: contractsRes } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => contractsApi.getAllContracts().then((res) => res.data.data)
  })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const contracts: Contract[] = contractsRes || []

  const { data: projectsRes } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getAllProjects().then((res) => res.data.data)
  })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const projects: Project[] = projectsRes || []

  const { data: usersRes } = useQuery({
    queryKey: ['users'],
    queryFn: () => adminUsersApi.getAllUsers().then((res) => res.data.data)
  })
  const users: User[] = usersRes || []

  // Lọc contracts theo search text (chỉ số HĐ + tên dự án)
  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      const project = projects.find((p) => p.id === c.projectId)

      const searchLower = searchText.toLowerCase()
      return (
        c.contractNumber.toLowerCase().includes(searchLower) ||
        (project?.name || '').toLowerCase().includes(searchLower)
      )
    })
  }, [contracts, projects, searchText])

  // Tổng tiền các hợp đồng (loại bỏ dự án CANCELLED)
  const totalAmount = useMemo(() => {
    return contracts.reduce((sum, c) => {
      const project = projects.find((p) => p.id === c.projectId)
      if (project?.status !== 'CANCELLED') {
        return sum + (c.totalAmount || 0)
      }
      return sum
    }, 0)
  }, [contracts, projects])

  const columns = [
    {
      title: 'Số hợp đồng',
      dataIndex: 'contractNumber',
      key: 'contractNumber',
      render: (text: string) => <Tag color='blue'>{text}</Tag>
    },
    {
      title: 'Tên dự án',
      dataIndex: 'projectId',
      key: 'projectId',
      render: (id: number) => {
        const project = projects.find((p) => p.id === id)
        return project ? project.name : `Dự án #${id}`
      }
    },
    {
      title: 'Khách hàng',
      dataIndex: 'projectId',
      key: 'customer',
      render: (id: number) => {
        const project = projects.find((p) => p.id === id)
        if (!project) return '-'
        const user = users.find((u) => u.id === project.userId)
        return user ? user.name || user.email : `Khách hàng #${project.userId}`
      }
    },
    {
      title: 'Ngày ký',
      dataIndex: 'signedDate',
      key: 'signedDate',
      render: (date: string) => (date ? dayjs(date).format('DD/MM/YYYY') : '-')
    },
    {
      title: 'Tổng giá trị',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (value: number) => (
        <span style={{ fontWeight: 600, color: '#fa8c16' }}>💰 {value.toLocaleString()} VND</span>
      )
    },
    {
      title: 'File hợp đồng',
      dataIndex: 'contractFile',
      key: 'contractFile',
      render: (file: string) =>
        file ? (
          <a href={getContractUrl(file)} target='_blank' rel='noopener noreferrer' style={{ color: '#1890ff' }}>
            Xem hợp đồng
          </a>
        ) : (
          <Tag color='red'>Chưa có file</Tag>
        )
    }
  ]

  return (
    <div className='space-y-4'>
      <Card
        title={<span className='text-xl font-bold'>📑 Quản lý hợp đồng</span>}
        bordered={false}
        extra={
          <Search
            placeholder='Tìm kiếm theo số HĐ hoặc tên dự án...'
            allowClear
            onSearch={(value) => setSearchText(value)}
            style={{ width: 350 }}
          />
        }
      >
        <Table rowKey='id' columns={columns} dataSource={filteredContracts} pagination={{ pageSize: 5 }} />
      </Card>

      <Divider />

      <Card>
        <span className='font-semibold text-lg'>
          🧾 Tổng giá trị tất cả hợp đồng (không tính dự án đã hủy):{' '}
          <span style={{ color: '#52c41a' }}>{totalAmount.toLocaleString()} VND</span>
        </span>
      </Card>
    </div>
  )
}
