import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema, parseTaskFormValues, type TaskFormValues } from '@/lib/validators/task'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea, Select } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useCreateTask } from '@/hooks/useTasks'
import type { TaskStatus } from '@/types/task.types'

interface TaskFormModalProps {
  isOpen: boolean
  onClose: () => void
  defaultStatus?: TaskStatus
}

export function TaskFormModal({
  isOpen,
  onClose,
  defaultStatus = 'todo',
}: TaskFormModalProps) {
  const createTask = useCreateTask()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: defaultStatus,
      priority: undefined,
      dueDate: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        title: '',
        description: '',
        status: defaultStatus,
        priority: undefined,
        dueDate: '',
      })
    }
  }, [isOpen, defaultStatus, reset])

  const onSubmit = (values: TaskFormValues) => {
    createTask.mutate(parseTaskFormValues(values), {
      onSuccess: () => {
        reset()
        onClose()
      },
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Task Baru">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="title"
          label="Judul"
          placeholder="Masukkan judul task"
          error={errors.title?.message}
          {...register('title')}
        />

        <Textarea
          id="description"
          label="Deskripsi (opsional)"
          placeholder="Detail task..."
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select id="status" label="Status" {...register('status')}>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </Select>

          <Select id="priority" label="Prioritas (opsional)" {...register('priority')}>
            <option value="">— Pilih —</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </div>

        <Input
          id="dueDate"
          type="date"
          label="Due Date (opsional)"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" isLoading={createTask.isPending}>
            Simpan Task
          </Button>
        </div>
      </form>
    </Modal>
  )
}
