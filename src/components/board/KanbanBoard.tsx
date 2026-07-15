import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  TASK_STATUSES,
  type Task,
  type TaskStatus,
} from '@/types/task.types'
import { KanbanColumn } from '@/components/board/KanbanColumn'
import { TaskCard } from '@/components/board/TaskCard'
import { useOptimisticTaskUpdate } from '@/hooks/useOptimisticTask'

interface KanbanBoardProps {
  tasks: Task[]
  isSelected: (id: string) => boolean
  onToggleSelect: (id: string) => void
  onTaskClick: (task: Task) => void
}

function resolveDropStatus(
  overId: string | number,
  tasks: Task[],
): TaskStatus | null {
  const id = String(overId)
  if (TASK_STATUSES.some((s) => s.value === id)) {
    return id as TaskStatus
  }
  const overTask = tasks.find((t) => t.id === id)
  return overTask?.status ?? null
}

export function KanbanBoard({
  tasks,
  isSelected,
  onToggleSelect,
  onTaskClick,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [failedDragId, setFailedDragId] = useState<string | null>(null)
  const optimisticUpdate = useOptimisticTaskUpdate()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      done: [],
    }
    for (const task of tasks) {
      grouped[task.status].push(task)
    }
    return grouped
  }, [tasks])

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    if (task) setActiveTask(task)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    
    const taskId = String(active.id)
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    if (!over) {
      setFailedDragId(taskId)
      setTimeout(() => setFailedDragId(null), 300)
      return
    }

    const newStatus = resolveDropStatus(over.id, tasks)
    if (!newStatus || task.status === newStatus) {
      setFailedDragId(taskId)
      setTimeout(() => setFailedDragId(null), 300)
      return
    }

    optimisticUpdate.mutate({ id: taskId, updates: { status: newStatus } })
  }

  const handleDragCancel = () => setActiveTask(null)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex-1 min-h-0 flex gap-4 overflow-x-auto overflow-y-hidden pb-4">
        {TASK_STATUSES.map(({ value }) => (
          <KanbanColumn
            key={value}
            status={value}
            tasks={tasksByStatus[value]}
            isSelected={isSelected}
            onToggleSelect={onToggleSelect}
            onTaskClick={onTaskClick}
            failedDragId={failedDragId}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            isSelected={isSelected(activeTask.id)}
            onToggleSelect={() => undefined}
            onEdit={() => undefined}
            isDragOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
