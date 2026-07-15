import { format, isPast, isToday, parseISO } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Calendar } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { PRIORITY_CONFIG, type Task } from '@/types/task.types'

interface TaskCardProps {
  task: Task
  isSelected: boolean
  onToggleSelect: (id: string) => void
  onClick: (task: Task) => void
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
  onClick,
  isDragOverlay = false,
  isShake = false,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { task, status: task.status },
      disabled: isDragOverlay,
    })

  const style = undefined // transform is not needed when using DragOverlay

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
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group relative rounded-[12px] bg-white p-3 shadow-sm transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] border border-slate-200 border-l-[3px] ${STATUS_COLORS[task.status]} ${
        isDragOverlay ? 'cursor-grabbing' : 'cursor-grab active:cursor-grabbing'
      } ${
        isDragging && !isDragOverlay
          ? 'opacity-40'
          : 'hover:border-slate-300 hover:shadow-md'
      } ${isSelected ? 'ring-2 ring-orange-100' : ''} ${isDragOverlay ? 'scale-[1.05] -rotate-2 shadow-xl ring-2 ring-slate-200' : ''} ${
        isShake ? 'animate-shake border-red-300 ring-2 ring-red-100 z-10' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(task.id)}
          onClick={(e) => e.stopPropagation()}
          className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
          aria-label={`Pilih task ${task.title}`}
        />

        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={() => onClick(task)}
        >
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] font-medium text-slate-400">
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
          <h3 className="text-sm font-medium text-slate-900">{task.title}</h3>
          {task.description ? (
            <p className="mt-1 line-clamp-2 text-xs text-slate-500">
              {task.description}
            </p>
          ) : null}
          {dueDateLabel ? (
            <div
              className={`mt-2 inline-flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600' : 'text-slate-500'}`}
            >
              <Calendar className="h-3 w-3" />
              {dueDateLabel}
            </div>
          ) : null}
        </button>

      </div>
    </div>
  )
}
