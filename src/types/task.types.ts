export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  ticketId: string
  title: string
  description?: string
  status: TaskStatus
  priority?: TaskPriority
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface AuthSession {
  isAuthenticated: boolean
  token: string
  user: { username: string; avatarUrl?: string }
}

export interface AuthResponse {
  token: string
  user: { username: string; avatarUrl?: string }
}

export type FilterStatus = 'all' | 'completed' | 'incomplete'

export interface CreateTaskInput {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
}

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  low: { label: 'Low', className: 'bg-slate-100 text-slate-600' },
  medium: { label: 'Medium', className: 'bg-amber-50 text-amber-700' },
  high: { label: 'High', className: 'bg-orange-100 text-orange-700' },
}

export type ActivityType = 'created' | 'edited' | 'status_changed' | 'deleted'

export interface TaskEvent {
  id: string
  taskId: string
  ticketId: string
  taskTitle: string
  type: ActivityType
  details: string
  createdAt: string
}

