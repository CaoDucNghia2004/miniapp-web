import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Table, Button, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { Form } from 'antd'
import projectsApi from 'src/apis/projects.api'
import fieldsApi from 'src/apis/fields.api'
import adminUsersApi from 'src/apis/adminUsers.api'
import projectPhasesApi from 'src/apis/projectPhases.api'
import contractsApi from 'src/apis/contracts.api'
import type { Project } from 'src/types/projects.type'
import type { ProjectPhase } from 'src/types/projectPhase.type'
import ProjectStatusTag from '../../components/ProjectStatusTag'
import ProjectFormModal from '../../components/ProjectFormModal'
import ProjectDetailModal from '../../components/ProjectDetailModal'

export default function ProjectManagement() {
  const queryClient = useQueryClient()
  const [openModal, setOpenModal] = useState(false)
  const [openDetailModal, setOpenDetailModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const [form] = Form.useForm()
  const [phaseForm] = Form.useForm()
  const [contractForm] = Form.useForm()

  const [editingPhase, setEditingPhase] = useState<ProjectPhase | null>(null)
  const [step, setStep] = useState(0)
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

  const { data: phases } = useQuery({
    queryKey: ['project-phases', selectedProject?.id],
    queryFn: () =>
      selectedProject
        ? projectPhasesApi.getProjectPhasesByProjectId(selectedProject.id).then((res) => res.data.data)
        : [],
    enabled: !!selectedProject
  })

  const { data: contracts } = useQuery({
    queryKey: ['contracts', selectedProject?.id],
    queryFn: () =>
      selectedProject ? contractsApi.getContractsByProject(selectedProject.id).then((res) => res.data.data) : [],
    enabled: !!selectedProject
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: (res) => {
      messageApi.success(res.data.message || 'Tạo dự án thành công')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setStep(1)
      setSelectedProject(res.data.data)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      messageApi.error(err.response?.data?.message || 'Tạo dự án thất bại')
    }
  })

  const updateMutation = useMutation({
    mutationFn: projectsApi.updateProject,
    onSuccess: (res) => {
      messageApi.success(res.data.message || 'Cập nhật dự án thành công')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setSelectedProject(res.data.data)
      setStep(1)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      messageApi.error(err.response?.data?.message || 'Cập nhật dự án thất bại')
    }
  })

  const createPhaseMutation = useMutation({
    mutationFn: projectPhasesApi.createProjectPhase,
    onSuccess: (res) => {
      messageApi.success(res.data.message || 'Thêm giai đoạn thành công')
      queryClient.invalidateQueries({ queryKey: ['project-phases', selectedProject?.id] })
      phaseForm.resetFields()
      setEditingPhase(null)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      messageApi.error(err.response?.data?.message || 'Thêm giai đoạn thất bại')
    }
  })

  const updatePhaseMutation = useMutation({
    mutationFn: projectPhasesApi.updateProjectPhase,
    onSuccess: (res) => {
      messageApi.success(res.data.message || 'Cập nhật giai đoạn thành công')
      queryClient.invalidateQueries({ queryKey: ['project-phases', selectedProject?.id] })
      phaseForm.resetFields()
      setEditingPhase(null)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      messageApi.error(err.response?.data?.message || 'Cập nhật giai đoạn thất bại')
    }
  })

  const createContractMutation = useMutation({
    mutationFn: contractsApi.createContract,
    onSuccess: (res) => {
      messageApi.success(res.data.message || 'Tạo hợp đồng thành công')
      queryClient.invalidateQueries({ queryKey: ['contracts', selectedProject?.id] })
      contractForm.resetFields()
      setOpenModal(false)
      setStep(0)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      messageApi.error(err.response?.data?.message || 'Tạo hợp đồng thất bại')
    }
  })

  const updateContractMutation = useMutation({
    mutationFn: contractsApi.updateContract,
    onSuccess: (res) => {
      messageApi.success(res.data.message || 'Cập nhật hợp đồng thành công')
      queryClient.invalidateQueries({ queryKey: ['contracts', selectedProject?.id] })
      contractForm.resetFields()
      setOpenModal(false)
      setStep(0)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      messageApi.error(err.response?.data?.message || 'Cập nhật hợp đồng thất bại')
    }
  })

  // Handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmitProject = (values: any) => {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmitPhase = (values: any) => {
    if (!selectedProject) return
    const payload = {
      ...values,
      projectId: selectedProject.id,
      startDate: values.startDate.format('YYYY-MM-DD'),
      endDate: values.endDate.format('YYYY-MM-DD')
    }
    if (editingPhase) {
      updatePhaseMutation.mutate({ ...payload, id: editingPhase.id })
    } else {
      createPhaseMutation.mutate(payload)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmitContract = (values: any) => {
    if (!selectedProject) return
    const payload = {
      contractNumber: values.contractNumber,
      contractFile: values.contractFile, // lúc này là string URL do upload trả về
      totalAmount: phases?.reduce((acc, p) => acc + p.amountDue, 0) || 0,
      projectId: selectedProject.id,
      signedDate: null
    }

    if (contracts && contracts.length > 0) {
      updateContractMutation.mutate({ ...payload, id: contracts[0].id })
    } else {
      createContractMutation.mutate(payload)
    }
  }

  const handleDeletePhase = (id: number) => {
    projectPhasesApi.deleteProjectPhase(id).then(() => {
      queryClient.invalidateQueries({ queryKey: ['project-phases', selectedProject?.id] })
    })
  }

  const handleDeleteContract = (id: number) => {
    contractsApi.deleteContract(id).then(() => {
      queryClient.invalidateQueries({ queryKey: ['contracts', selectedProject?.id] })
    })
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
      render: (status: Project['status']) => <ProjectStatusTag status={status} />
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
              setSelectedProject(record)
              setOpenModal(true)
              setStep(0)
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
            setStep(0)
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
        pagination={{ pageSize: 5 }}
      />

      <ProjectFormModal
        open={openModal}
        onClose={() => {
          setOpenModal(false)
          form.resetFields()
          setStep(0)
        }}
        step={step}
        setStep={setStep}
        form={form}
        phaseForm={phaseForm}
        contractForm={contractForm}
        fields={fields}
        users={users}
        selectedProject={selectedProject}
        editingProject={editingProject}
        editingPhase={editingPhase}
        setEditingPhase={setEditingPhase}
        phases={phases}
        contracts={contracts}
        handleSubmitProject={handleSubmitProject}
        handleSubmitPhase={handleSubmitPhase}
        handleSubmitContract={handleSubmitContract}
        onDeletePhase={handleDeletePhase}
      />

      <ProjectDetailModal
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        project={selectedProject}
        phases={phases}
        contracts={contracts}
        onDeleteContract={handleDeleteContract}
      />
    </div>
  )
}
