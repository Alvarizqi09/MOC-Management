import { useDroppable } from '@dnd-kit/core'
import { Plus, ListTodo, Timer, CheckCircle2 } from 'lucide-react'
import { TASK_STATUSES, type Task, type TaskStatus } from '@/types/task.types'
import { TaskCard } from '@/components/board/TaskCard'
import { useUIStore } from '@/store/useUIStore'

interface KanbanColumnProps {
  status: TaskStatus
  tasks: Task[]
  isSelected: (id: string) => boolean
  onToggleSelect: (id: string) => void
  onTaskClick: (task: Task) => void
  failedDragId?: string | null
}

const COLUMN_STYLES: Record<TaskStatus, { icon: React.ElementType; color: string }> = {
  todo: { icon: ListTodo, color: '#8B5CF6' }, // purple
  in_progress: { icon: Timer, color: '#3B82F6' }, // blue
  done: { icon: CheckCircle2, color: '#10B981' }, // green
}

export function KanbanColumn({
  status,
  tasks,
  isSelected,
  onToggleSelect,
  onTaskClick,
  failedDragId,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const label = TASK_STATUSES.find((s) => s.value === status)?.label ?? status
  const styles = COLUMN_STYLES[status]
  const Icon = styles.icon
  const setIsCreateOpen = useUIStore((s) => s.setIsCreateOpen)

  return (
    <div
      className={`flex h-full min-h-[420px] w-full shrink-0 flex-col rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-200 sm:w-[350px] ${
        isOver
          ? 'bg-orange-50/50 dark:bg-orange-900/10 ring-2 ring-orange-500/20 dark:ring-orange-500/30'
          : ''
      }`}
    >
      <div className="p-4 sm:p-5 pb-2">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" style={{ color: styles.color }} />
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {label}
            </h3>
          </div>
          <div className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 px-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            {tasks.length}
          </div>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 pl-6">
          Drag, drop, iterate
        </p>
      </div>

      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-3 p-3 pt-0 overflow-y-auto"
        data-status={status}
      >
        {tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-slate-100 dark:border-slate-800 p-6 text-center mt-3">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {isOver ? 'Lepaskan di sini' : 'Belum ada task'}
            </p>
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isSelected={isSelected(task.id)}
                onToggleSelect={onToggleSelect}
                onEdit={onTaskClick}
                isShake={task.id === failedDragId}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-3 pt-0 mt-auto">
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-300"
        >
          <Plus className="h-4 w-4" />
          Task Baru
        </button>
      </div>
    </div>
  )
}
