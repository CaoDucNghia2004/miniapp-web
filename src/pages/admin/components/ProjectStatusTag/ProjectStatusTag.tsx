import { Tag } from 'antd'
import { ClockCircleOutlined, SyncOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import type { Project } from 'src/types/projects.type'
import { getProjectStatusLabel } from 'src/utils/utils'

interface ProjectStatusTagProps {
  status: Project['status']
}

export default function ProjectStatusTag({ status }: ProjectStatusTagProps) {
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
