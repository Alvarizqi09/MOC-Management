import type { Task, TaskEvent } from '@/types/task.types'

const TASKS_KEY = 'taskflow_tasks'
const EVENTS_KEY = 'taskflow_events'
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

function readEvents(): TaskEvent[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY)
    return raw ? (JSON.parse(raw) as TaskEvent[]) : []
  } catch {
    return []
  }
}

function writeTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

function writeEvents(events: TaskEvent[]): void {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
}

export function logEvent(data: Omit<TaskEvent, 'id' | 'createdAt'>): void {
  const events = readEvents()
  events.push({
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  })
  writeEvents(events)
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

export function getAllEvents(): TaskEvent[] {
  return readEvents()
}

export function clearAllEvents(): void {
  writeEvents([])
}

export function getTaskById(id: string): Task | undefined {
  return readTasks().find((t) => t.id === id)
}

export function createTask(task: Task): Task {
  const tasks = readTasks()
  tasks.push(task)
  writeTasks(tasks)
  
  logEvent({
    taskId: task.id,
    ticketId: task.ticketId,
    taskTitle: task.title,
    type: 'created',
    details: 'Task created',
  })
  
  return task
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const tasks = readTasks()
  const index = tasks.findIndex((t) => t.id === id)
  if (index === -1) return null

  const oldTask = tasks[index]
  const updated: Task = {
    ...oldTask,
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  tasks[index] = updated
  writeTasks(tasks)

  if (updates.status && updates.status !== oldTask.status) {
    logEvent({
      taskId: updated.id,
      ticketId: updated.ticketId,
      taskTitle: updated.title,
      type: 'status_changed',
      details: `Status changed from ${oldTask.status} → ${updates.status}`,
    })
  } else {
    logEvent({
      taskId: updated.id,
      ticketId: updated.ticketId,
      taskTitle: updated.title,
      type: 'edited',
      details: 'Task details updated',
    })
  }

  return updated
}

export function deleteTask(id: string): boolean {
  const tasks = readTasks()
  const index = tasks.findIndex((t) => t.id === id)
  if (index === -1) return false
  
  const task = tasks[index]
  tasks.splice(index, 1)
  writeTasks(tasks)
  
  logEvent({
    taskId: task.id,
    ticketId: task.ticketId,
    taskTitle: task.title,
    type: 'deleted',
    details: 'Task deleted',
  })
  
  return true
}

export function seedInitialTasks(): void {
  const existing = localStorage.getItem(TASKS_KEY)
  if (existing !== null) return

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

  // Seed initial events for these tasks
  tasks.forEach(task => {
    logEvent({
      taskId: task.id,
      ticketId: task.ticketId,
      taskTitle: task.title,
      type: 'created',
      details: 'Task created',
    })
  })
}
