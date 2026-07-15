import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, parseISO } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { CheckCircle2, Trash2 } from 'lucide-react'
import { taskSchema, parseTaskFormValues, type TaskFormValues } from '@/lib/validators/task'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea, Select } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useDeleteTask } from '@/hooks/useTasks'
import { useOptimisticTaskUpdate } from '@/hooks/useOptimisticTask'
import { PRIORITY_CONFIG, type Task } from '@/types/task.types'
import { AlertDialog } from '@/components/ui/AlertDialog'

interface TaskEditModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
}

export function TaskEditModal({ task, isOpen, onClose }: TaskEditModalProps) {
  const optimisticUpdate = useOptimisticTaskUpdate()
  const deleteTask = useDeleteTask()

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
  })

  useEffect(() => {
    if (task && isOpen) {
      reset({
        title: task.title,
        description: task.description ?? '',
        status: task.status,
        priority: task.priority ?? '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      })
    } else {
      setIsDeleteDialogOpen(false)
    }
  }, [task, isOpen, reset])

  if (!task) return null

  const priority = task.priority ? PRIORITY_CONFIG[task.priority] : null

  const onSubmit = (values: TaskFormValues) => {
    optimisticUpdate.mutate(
      {
        id: task.id,
        updates: parseTaskFormValues(values),
      },
      { onSuccess: () => onClose() },
    )
  }

  const handleMarkDone = () => {
    optimisticUpdate.mutate(
      { id: task.id, updates: { status: 'done' } },
      { onSuccess: () => onClose() },
    )
  }

  const confirmDelete = () => {
    deleteTask.mutate(task.id, { onSuccess: () => {
      setIsDeleteDialogOpen(false)
      onClose()
    }})
  }

  const isLoading = optimisticUpdate.isPending || deleteTask.isPending

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task" size="lg">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
          {task.ticketId}
        </span>
        {priority ? (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${priority.className}`}
          >
            {priority.label}
          </span>
        ) : null}
        <span className="text-xs text-slate-400">
          Dibuat{' '}
          {format(parseISO(task.createdAt), 'd MMM yyyy, HH:mm', {
            locale: localeId,
          })}
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="edit-title"
          label="Judul"
          error={errors.title?.message}
          {...register('title')}
        />

        <Textarea
          id="edit-description"
          label="Deskripsi"
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select id="edit-status" label="Status" {...register('status')}>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </Select>

          <Select id="edit-priority" label="Prioritas" {...register('priority')}>
            <option value="">— Pilih —</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </div>

        <Input
          id="edit-dueDate"
          type="date"
          label="Due Date"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
          <div className="flex gap-2">
            {task.status !== 'done' ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleMarkDone}
                disabled={isLoading}
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark as Done
              </Button>
            ) : null}
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              isLoading={deleteTask.isPending}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4" />
              Hapus
            </Button>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Tutup
            </Button>
            <Button
              type="submit"
              isLoading={optimisticUpdate.isPending}
              disabled={!isDirty || isLoading}
            >
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </form>

      <AlertDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Task"
        description={
          <>
            Apakah Anda yakin ingin menghapus task <strong>{task.title}</strong>? Aksi ini tidak dapat dibatalkan.
          </>
        }
        isLoading={deleteTask.isPending}
      />
    </Modal>
  )
}
