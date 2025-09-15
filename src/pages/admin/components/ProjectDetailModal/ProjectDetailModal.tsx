import { Modal, Card, Descriptions, Timeline, Button, Popconfirm, Tag, Divider } from 'antd'
import { DeleteOutlined, FilePdfOutlined } from '@ant-design/icons'
import type { Project } from 'src/types/projects.type'
import type { ProjectPhase } from 'src/types/projectPhase.type'
import type { Contract } from 'src/types/contract.type'
import type { Payment } from 'src/types/payment.type'
import ProjectStatusTag from '../ProjectStatusTag'
import { getContractUrl, getProjectPhaseStatusLabel } from 'src/utils/utils'

interface ProjectDetailModalProps {
  open: boolean
  onClose: () => void
  project: Project | null
  phases?: ProjectPhase[]
  contracts?: Contract[]
  payments?: Payment[]
  onDeleteContract: (id: number) => void
}

export default function ProjectDetailModal({
  open,
  onClose,
  project,
  phases,
  contracts,
  payments = [],
  onDeleteContract
}: ProjectDetailModalProps) {
  return (
    <Modal title='📋 Chi tiết dự án' open={open} onCancel={onClose} footer={null} width={950}>
      {project && (
        <div className='space-y-6'>
          <Card title='📌 Thông tin dự án' bordered={false} className='shadow-sm rounded-lg'>
            <Descriptions
              column={2}
              size='middle'
              bordered
              labelStyle={{ fontWeight: 'bold', width: 140 }}
              contentStyle={{ background: '#fafafa' }}
            >
              <Descriptions.Item label='ID'>{project.id}</Descriptions.Item>
              <Descriptions.Item label='Tên dự án'>{project.name}</Descriptions.Item>
              <Descriptions.Item label='Mô tả'>{project.description}</Descriptions.Item>
              <Descriptions.Item label='Ngày bắt đầu'>
                {new Date(project.startDate).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label='Ngày kết thúc'>
                {new Date(project.endDate).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label='Trạng thái'>
                <ProjectStatusTag status={project.status} />
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Divider />

          <Card title='📑 Giai đoạn dự án' bordered={false} className='shadow-sm rounded-lg'>
            {phases && phases.length > 0 ? (
              <Timeline
                mode='left'
                items={phases.map((p) => {
                  const payment = payments.find((pm) => pm.projectPhaseId === p.id)
                  return {
                    label: (
                      <Tag color='blue'>
                        {new Date(p.startDate).toLocaleDateString('vi-VN')} -{' '}
                        {new Date(p.endDate).toLocaleDateString('vi-VN')}
                      </Tag>
                    ),
                    children: (
                      <div className='pl-2'>
                        <p className='font-semibold text-blue-600'>{p.phaseName}</p>
                        <p className='text-gray-600 text-sm'>{p.description || 'Không có mô tả'}</p>
                        <p>
                          <b>Trạng thái giai đoạn:</b>{' '}
                          <Tag
                            color={
                              p.status === 'COMPLETED' ? 'green' : p.status === 'IN_PROGRESS' ? 'orange' : 'default'
                            }
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
                              {payment.paymentStatus === 'COMPLETED'
                                ? 'Hoàn tất'
                                : payment.paymentStatus === 'FAILED'
                                  ? 'Thất bại'
                                  : 'Đang chờ'}
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

          <Card title='📄 Hợp đồng' bordered={false} className='shadow-sm rounded-lg'>
            {contracts && contracts.length > 0 ? (
              contracts.map((c) => (
                <div
                  key={c.id}
                  className='flex justify-between items-center border p-3 mb-3 rounded-lg bg-gray-50 hover:shadow transition'
                >
                  <div>
                    <p>
                      <b>Số hợp đồng:</b> {c.contractNumber}
                    </p>
                    <p>
                      <b>Giá trị:</b> {c.totalAmount?.toLocaleString() || 0} VND
                    </p>
                    <p>
                      <b>Ngày ký:</b> {c.signedDate ? new Date(c.signedDate).toLocaleDateString('vi-VN') : 'Chưa ký'}
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
                  <Popconfirm title='Bạn có chắc muốn xóa hợp đồng này?' onConfirm={() => onDeleteContract(c.id)}>
                    <Button danger size='small' icon={<DeleteOutlined />} />
                  </Popconfirm>
                </div>
              ))
            ) : (
              <p className='text-gray-500 italic'>Chưa có hợp đồng</p>
            )}
          </Card>
        </div>
      )}
    </Modal>
  )
}
