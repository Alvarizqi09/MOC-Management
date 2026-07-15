import { format, isPast, isToday, parseISO } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Calendar, Pencil, Trash2 } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import { PRIORITY_CONFIG, type Task } from '@/types/task.types'
import { useState } from 'react'
import { AlertDialog } from '@/components/ui/AlertDialog'
import { useDeleteTask } from '@/hooks/useTasks'
import { useNavigate } from 'react-router-dom'

interface TaskCardProps {
  task: Task
  isSelected: boolean
  onToggleSelect: (id: string) => void
  onEdit: (task: Task) => void
  isDragOverlay?: boolean
  isShake?: boolean
}

const STATUS_COLORS: Record<string, string> = {
  todo: 'border-l-[#8B5CF6]',
  in_progress: 'border-l-[#3B82F6]',
  done: 'border-l-[#10B981]',
}

export function TaskCard({
  task,
  isSelected,
  onToggleSelect,
  onEdit,
  isDragOverlay = false,
  isShake = false,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } =
    useDraggable({
      id: task.id,
      data: { task, status: task.status },
      disabled: isDragOverlay,
    })
    
  const navigate = useNavigate()
  const deleteTask = useDeleteTask()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const priority = task.priority ? PRIORITY_CONFIG[task.priority] : null

  const dueDateLabel = task.dueDate
    ? format(parseISO(task.dueDate), 'd MMM yyyy', { locale: localeId })
    : null

  const isOverdue =
    task.dueDate &&
    task.status !== 'done' &&
    isPast(parseISO(task.dueDate)) &&
    !isToday(parseISO(task.dueDate))

  return (
    <>
      <div
        ref={isDragOverlay ? undefined : setNodeRef}
        {...listeners}
        {...attributes}
        className={`group relative rounded-[12px] bg-white dark:bg-slate-800 p-3 shadow-sm transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] border border-slate-200 dark:border-slate-700 border-l-[3px] ${STATUS_COLORS[task.status]} ${
          isDragOverlay ? 'cursor-grabbing' : 'cursor-grab active:cursor-grabbing'
        } ${
          isDragging && !isDragOverlay
            ? 'opacity-40'
            : 'hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
        } ${isSelected ? 'ring-2 ring-orange-100 dark:ring-orange-900/30' : ''} ${isDragOverlay ? 'scale-[1.05] -rotate-2 shadow-xl dark:shadow-slate-900/50 ring-2 ring-slate-200 dark:ring-slate-700' : ''} ${
          isShake ? 'animate-shake border-red-300 ring-2 ring-red-100 z-10' : ''
        }`}
      >
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(task.id)}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
            aria-label={`Pilih task ${task.title}`}
          />

          <button
            type="button"
            className="min-w-0 flex-1 text-left"
            onClick={() => navigate(`/board/task/${task.id}`)}
          >
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                {task.ticketId}
              </span>
              {priority ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${priority.className}`}
                >
                  {priority.label}
                </span>
              ) : null}
            </div>
            <h3 className={`text-sm font-medium pr-12 ${task.status === 'done' ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>
              {task.title}
            </h3>
            {task.description ? (
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                {task.description}
              </p>
            ) : null}
            {dueDateLabel ? (
              <div
                className={`mt-2 inline-flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}
              >
                <Calendar className="h-3 w-3" />
                {dueDateLabel}
              </div>
            ) : null}
          </button>
        </div>

        {/* Hover Actions */}
        {!isDragOverlay && (
          <div className="absolute top-2 right-2 flex opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(task)
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="rounded-full p-1.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsDeleteDialogOpen(true)
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="rounded-full p-1.5 text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {!isDragOverlay && (
        <AlertDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={() => {
            deleteTask.mutate(task.id, {
              onSuccess: () => setIsDeleteDialogOpen(false)
            })
          }}
          title="Hapus Task"
          description={
            <>
              Apakah Anda yakin ingin menghapus task <strong>{task.title}</strong>? Aksi ini tidak dapat dibatalkan.
            </>
          }
          isLoading={deleteTask.isPending}
        />
      )}
    </>
  )
}
