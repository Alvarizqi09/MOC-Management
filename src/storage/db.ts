import type { Task } from '@/types/task.types'

const TASKS_KEY = 'taskflow_tasks'
const TICKET_COUNTER_KEY = 'taskflow_ticket_counter'
const INITIAL_COUNTER = 1000

function readTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY)
    return raw ? (JSON.parse(raw) as Task[]) : []
  } catch {
    return []
  }
}

function writeTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

function getNextTicketNumber(): number {
  const raw = localStorage.getItem(TICKET_COUNTER_KEY)
  const current = raw ? parseInt(raw, 10) : INITIAL_COUNTER
  const next = Number.isNaN(current) ? INITIAL_COUNTER + 1 : current + 1
  localStorage.setItem(TICKET_COUNTER_KEY, String(next))
  return next
}

export function generateTicketId(): string {
  const num = getNextTicketNumber()
  return `TASKFLOW-${num}`
}

export function getAllTasks(): Task[] {
  return readTasks()
}

export function getTaskById(id: string): Task | undefined {
  return readTasks().find((t) => t.id === id)
}

export function createTask(task: Task): Task {
  const tasks = readTasks()
  tasks.push(task)
  writeTasks(tasks)
  return task
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const tasks = readTasks()
  const index = tasks.findIndex((t) => t.id === id)
  if (index === -1) return null

  const updated: Task = {
    ...tasks[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  tasks[index] = updated
  writeTasks(tasks)
  return updated
}

export function deleteTask(id: string): boolean {
  const tasks = readTasks()
  const filtered = tasks.filter((t) => t.id !== id)
  if (filtered.length === tasks.length) return false
  writeTasks(filtered)
  return true
}

export function seedInitialTasks(): void {
  if (readTasks().length > 0) return

  const now = new Date().toISOString()
  const samples: Omit<Task, 'id' | 'ticketId'>[] = [
    {
      title: 'Setup project repository',
      description: 'Initialize Vite + React + TypeScript with proper folder structure',
      status: 'done',
      priority: 'high',
      dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      createdAt: now,
      updatedAt: now,
    },
    {
      title: 'Implement Mock API layer',
      description: 'Custom axios adapter with delay and error simulation',
      status: 'in_progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      createdAt: now,
      updatedAt: now,
    },
    {
      title: 'Build Kanban board with drag-and-drop',
      description: 'Use @dnd-kit for column transitions with optimistic updates',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      createdAt: now,
      updatedAt: now,
    },
    {
      title: 'Add bulk actions',
      description: 'Multi-select tasks and mark done or delete in batch',
      status: 'todo',
      priority: 'low',
      createdAt: now,
      updatedAt: now,
    },
  ]

  const tasks: Task[] = samples.map((sample) => ({
    ...sample,
    id: crypto.randomUUID(),
    ticketId: generateTicketId(),
  }))

  writeTasks(tasks)
}
