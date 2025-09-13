import { useEffect } from 'react'
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Steps,
  Timeline,
  Popconfirm,
  Card,
  Divider,
  message
} from 'antd'
import { FileAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { Field } from 'src/types/field.type'
import type { User } from 'src/types/user.type'
import type { Project } from 'src/types/projects.type'
import type { ProjectPhase } from 'src/types/projectPhase.type'
import type { Contract } from 'src/types/contract.type'
import contractsApi from 'src/apis/contracts.api'
import { getContractUrl, getProjectPhaseStatusLabel } from 'src/utils/utils'

interface ProjectFormModalProps {
  open: boolean
  onClose: () => void
  step: number
  setStep: (step: number) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  phaseForm: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contractForm: any
  fields?: Field[]
  users?: User[]
  selectedProject: Project | null
  editingProject: Project | null
  editingPhase: ProjectPhase | null
  setEditingPhase: (p: ProjectPhase | null) => void
  phases?: ProjectPhase[]
  contracts?: Contract[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSubmitProject: (values: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSubmitPhase: (values: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSubmitContract: (values: any) => void
  onDeletePhase: (id: number) => void
}

export default function ProjectFormModal({
  open,
  onClose,
  step,
  setStep,
  form,
  phaseForm,
  contractForm,
  fields,
  users,
  selectedProject,
  editingProject,
  editingPhase,
  setEditingPhase,
  phases,
  contracts,
  handleSubmitProject,
  handleSubmitPhase,
  handleSubmitContract,
  onDeletePhase
}: ProjectFormModalProps) {
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    if (open && contracts && contracts.length > 0) {
      const c = contracts[0]
      contractForm.setFieldsValue({
        contractNumber: c.contractNumber,
        contractFile: c.contractFile,
        signedDate: c.signedDate ? dayjs(c.signedDate) : null
      })
    }
  }, [open, contracts, contractForm])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmitProject = (values: any) => {
    if (phases && phases.length > 0) {
      if (values.status === 'PENDING') {
        const invalid = phases.some((p) => p.status !== 'PENDING')
        if (invalid) {
          messageApi.error('Không thể đặt dự án ở trạng thái "Đang chờ" khi có giai đoạn không phải Đang chờ.')
          return
        }
      }
      if (values.status === 'COMPLETED') {
        const invalid = phases.some((p) => p.status !== 'COMPLETED')
        if (invalid) {
          messageApi.error('Tất cả giai đoạn phải "Hoàn thành" trước khi dự án có thể đánh dấu là Hoàn thành.')
          return
        }
      }
    }
    handleSubmitProject(values)
  }

  // ✅ validate khi submit Phase (Step 1)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmitPhase = (values: any) => {
    if (!selectedProject) return
    const projectStatus = selectedProject.status
    const phaseStatus = values.status

    if (projectStatus === 'PENDING' && phaseStatus !== 'PENDING') {
      messageApi.error('Giai đoạn không hợp lệ: Dự án đang "Đang chờ" → giai đoạn chỉ được phép "Đang chờ".')
      return
    }
    if (projectStatus === 'COMPLETED' && phaseStatus !== 'COMPLETED') {
      messageApi.error('Giai đoạn không hợp lệ: Dự án đã "Hoàn thành" → giai đoạn bắt buộc phải "Hoàn thành".')
      return
    }
    // CANCELLED thì cho phép mọi trạng thái
    handleSubmitPhase(values)
  }

  return (
    <Modal
      title={editingProject ? 'Cập nhật dự án' : 'Thêm dự án'}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {contextHolder}
      <Steps current={step} items={[{ title: 'Dự án' }, { title: 'Giai đoạn' }, { title: 'Hợp đồng' }]} />

      {/* Step 0 - Project */}
      {step === 0 && (
        <Form form={form} layout='vertical' onFinish={onSubmitProject} className='mt-4'>
          <Form.Item label='Tên dự án' name='name' rules={[{ required: true, message: 'Vui lòng nhập tên dự án' }]}>
            <Input />
          </Form.Item>
          <Form.Item label='Mô tả' name='description'>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label='Ngày bắt đầu' name='startDate' rules={[{ required: true, message: 'Chọn ngày bắt đầu' }]}>
            <DatePicker format='DD/MM/YYYY' />
          </Form.Item>
          <Form.Item label='Ngày kết thúc' name='endDate' rules={[{ required: true, message: 'Chọn ngày kết thúc' }]}>
            <DatePicker format='DD/MM/YYYY' />
          </Form.Item>
          <Form.Item label='Lĩnh vực' name='fieldId' rules={[{ required: true, message: 'Chọn lĩnh vực' }]}>
            <Select options={(fields || []).map((f) => ({ label: f.fieldName, value: f.id }))} />
          </Form.Item>
          <Form.Item label='Khách hàng' name='userId' rules={[{ required: true, message: 'Chọn khách hàng' }]}>
            <Select
              showSearch
              options={(users || []).map((u) => ({
                label: `${u.name || 'Chưa có tên'} - ${u.email}`,
                value: u.id
              }))}
            />
          </Form.Item>
          <Form.Item label='Trạng thái' name='status' rules={[{ required: true, message: 'Chọn trạng thái dự án' }]}>
            <Select
              options={[
                { label: 'Đang chờ', value: 'PENDING' },
                { label: 'Đang thực hiện', value: 'IN_PROGRESS' },
                { label: 'Hoàn thành', value: 'COMPLETED' },
                { label: 'Đã hủy', value: 'CANCELLED' }
              ]}
            />
          </Form.Item>
          <Button type='primary' htmlType='submit'>
            Lưu và tiếp tục
          </Button>
        </Form>
      )}

      {/* Step 1 - Phases */}
      {step === 1 && selectedProject && (
        <div className='mt-4'>
          <Form form={phaseForm} layout='vertical' onFinish={onSubmitPhase}>
            <Form.Item
              label='Tên giai đoạn'
              name='phaseName'
              rules={[{ required: true, message: 'Nhập tên giai đoạn' }]}
              hasFeedback
            >
              <Input placeholder='Nhập tên giai đoạn...' />
            </Form.Item>
            <Form.Item label='Mô tả' name='description'>
              <Input.TextArea rows={2} placeholder='Mô tả chi tiết giai đoạn...' />
            </Form.Item>
            <div className='grid grid-cols-2 gap-4'>
              <Form.Item
                label='Ngày bắt đầu'
                name='startDate'
                rules={[{ required: true, message: 'Chọn ngày bắt đầu' }]}
                hasFeedback
              >
                <DatePicker format='DD/MM/YYYY' className='w-full' />
              </Form.Item>
              <Form.Item
                label='Ngày kết thúc'
                name='endDate'
                rules={[{ required: true, message: 'Chọn ngày kết thúc' }]}
                hasFeedback
              >
                <DatePicker format='DD/MM/YYYY' className='w-full' />
              </Form.Item>
            </div>
            <Form.Item
              label='Trạng thái'
              name='status'
              rules={[{ required: true, message: 'Chọn trạng thái giai đoạn' }]}
              hasFeedback
            >
              <Select
                placeholder='Chọn trạng thái'
                options={[
                  {
                    label: '⏳ Đang chờ',
                    value: 'PENDING',
                    disabled:
                      selectedProject.status !== 'PENDING' &&
                      selectedProject.status !== 'IN_PROGRESS' &&
                      selectedProject.status !== 'CANCELLED'
                  },
                  {
                    label: '🚀 Đang thực hiện',
                    value: 'IN_PROGRESS',
                    disabled: selectedProject.status !== 'IN_PROGRESS' && selectedProject.status !== 'CANCELLED'
                  },
                  {
                    label: '✅ Hoàn thành',
                    value: 'COMPLETED',
                    disabled: selectedProject.status === 'PENDING'
                  }
                ]}
              />
            </Form.Item>
            <Form.Item
              label='Số tiền'
              name='amountDue'
              rules={[{ required: true, message: 'Nhập số tiền' }]}
              hasFeedback
            >
              <Input type='number' placeholder='Nhập số tiền...' />
            </Form.Item>

            <Button type='dashed' htmlType='submit' icon={<FileAddOutlined />} block>
              {editingPhase ? 'Cập nhật giai đoạn' : '➕ Thêm giai đoạn'}
            </Button>
          </Form>

          <Divider />

          <Card title='📑 Danh sách giai đoạn' className='mt-10 shadow rounded-lg border border-gray-200'>
            {phases && phases.length > 0 ? (
              <Timeline
                mode='left'
                items={phases.map((p) => ({
                  dot: <span className='text-blue-500'>•</span>,
                  children: (
                    <div className='flex justify-between items-start p-3 rounded-md hover:bg-gray-50 transition'>
                      <div>
                        <b className='text-blue-600'>{p.phaseName}</b>{' '}
                        <span className='text-gray-500 text-sm'>
                          ({new Date(p.startDate).toLocaleDateString('vi-VN')} -{' '}
                          {new Date(p.endDate).toLocaleDateString('vi-VN')})
                        </span>
                        <p className='mt-1 text-gray-700'>{p.description || 'Không có mô tả'}</p>
                        <p className='text-sm'>
                          <b>Trạng thái:</b>{' '}
                          <span
                            className={
                              p.status === 'COMPLETED'
                                ? 'text-green-600'
                                : p.status === 'IN_PROGRESS'
                                  ? 'text-orange-500'
                                  : 'text-gray-500'
                            }
                          >
                            {getProjectPhaseStatusLabel(p.status)}
                          </span>
                        </p>
                        <p className='text-sm'>
                          <b>Số tiền:</b> {p.amountDue.toLocaleString()} VND
                        </p>
                      </div>
                      <div className='flex gap-2'>
                        <Button
                          size='small'
                          type='default'
                          icon={<EditOutlined style={{ color: '#1890ff' }} />}
                          onClick={() => {
                            setEditingPhase(p)
                            phaseForm.setFieldsValue({
                              ...p,
                              startDate: dayjs(p.startDate),
                              endDate: dayjs(p.endDate)
                            })
                          }}
                        />
                        <Popconfirm title='Bạn có chắc muốn xóa giai đoạn này?' onConfirm={() => onDeletePhase(p.id)}>
                          <Button size='small' danger icon={<DeleteOutlined style={{ color: 'red' }} />} />
                        </Popconfirm>
                      </div>
                    </div>
                  )
                }))}
              />
            ) : (
              <p className='text-gray-500 italic'>Chưa có giai đoạn nào</p>
            )}
          </Card>

          <div className='flex gap-2 mt-4'>
            <Button onClick={() => setStep(0)}>⬅️ Quay lại dự án</Button>
            <Button type='primary' onClick={() => setStep(2)}>
              Tiếp tục ➡️ hợp đồng
            </Button>
          </div>
        </div>
      )}

      {/* Step 2 - Contract */}
      {step === 2 && selectedProject && (
        <div className='mt-4'>
          <Form form={contractForm} layout='vertical' onFinish={handleSubmitContract}>
            <Form.Item
              label='Số hợp đồng'
              name='contractNumber'
              rules={[{ required: true, message: 'Nhập số hợp đồng' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label='Tổng giá trị hợp đồng'>
              <Input
                value={(phases || []).reduce((acc, p) => acc + (p.amountDue || 0), 0).toLocaleString() + ' VND'}
                disabled
              />
            </Form.Item>

            {/* Ngày ký hợp đồng */}
            <Form.Item
              label='Ngày ký hợp đồng'
              name='signedDate'
              rules={[{ required: true, message: 'Chọn ngày ký hợp đồng' }]}
            >
              <DatePicker format='DD/MM/YYYY' className='w-full' />
            </Form.Item>

            <Form.Item name='contractFile' hidden>
              <Input />
            </Form.Item>

            <Form.Item label='File hợp đồng' required>
              {contracts && contracts.length > 0 && contracts[0].contractFile ? (
                <div>
                  <p>
                    File hiện tại:{' '}
                    <a
                      href={getContractUrl(contracts[0].contractFile)}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 underline hover:text-blue-800'
                    >
                      {contracts[0].contractFile.split('/').pop()}
                    </a>
                  </p>
                  <label className='inline-flex items-center px-3 py-2 bg-gray-100 border rounded cursor-pointer hover:bg-gray-200'>
                    📂
                    <input
                      type='file'
                      accept='.pdf'
                      className='hidden'
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        try {
                          const res = await contractsApi.uploadFile(file)
                          const relativePath = res.data.data.fileUrl
                          contractForm.setFieldsValue({ contractFile: relativePath })
                        } catch (err) {
                          console.error('Upload error:', err)
                        }
                      }}
                    />
                  </label>
                </div>
              ) : (
                <label className='inline-flex items-center px-3 py-2 bg-gray-100 border rounded cursor-pointer hover:bg-gray-200'>
                  📂
                  <input
                    type='file'
                    accept='.pdf'
                    className='hidden'
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      try {
                        const res = await contractsApi.uploadFile(file)
                        const relativePath = res.data.data.fileUrl
                        contractForm.setFieldsValue({ contractFile: relativePath })
                      } catch (err) {
                        console.error('Upload error:', err)
                      }
                    }}
                  />
                </label>
              )}
            </Form.Item>

            <div className='flex gap-2 mt-4'>
              <Button icon={<EditOutlined />} onClick={() => setStep(1)}>
                Quay lại giai đoạn
              </Button>
              <Button type='primary' htmlType='submit'>
                {contracts && contracts.length > 0 ? 'Cập nhật hợp đồng' : 'Lưu hợp đồng'}
              </Button>
            </div>
          </Form>
        </div>
      )}
    </Modal>
  )
}
