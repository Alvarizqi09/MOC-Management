import { getAllTasks } from '@/storage/db'
import type { AppNotification } from '@/types/notification.types'
import type { Task } from '@/types/task.types'

export function generateNotifications(tasks: Task[]): AppNotification[] {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

  const notifications: AppNotification[] = []

  for (const task of tasks) {
    if (!task.dueDate || task.status === 'done') continue

    const dueDate = new Date(task.dueDate)
    const dueDay = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())

    if (dueDay < today) {
      const daysOverdue = Math.floor((today.getTime() - dueDay.getTime()) / (24 * 60 * 60 * 1000))
      notifications.push({
        id: `overdue-${task.id}`,
        type: 'overdue',
        title: 'Task Overdue',
        message: `"${task.title}" (${task.ticketId}) is overdue by ${daysOverdue} day${daysOverdue > 1 ? 's' : ''}.`,
        taskId: task.id,
        ticketId: task.ticketId,
        isRead: false,
        createdAt: dueDate.toISOString(),
      })
    }

    if (dueDay.getTime() === today.getTime()) {
      notifications.push({
        id: `due-today-${task.id}`,
        type: 'due_today',
        title: 'Due Today',
        message: `"${task.title}" (${task.ticketId}) is due today. Don't forget!`,
        taskId: task.id,
        ticketId: task.ticketId,
        isRead: false,
        createdAt: new Date(today.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      })
    }

    if (dueDay > today && dueDay <= weekEnd) {
      const daysLeft = Math.floor((dueDay.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
      notifications.push({
        id: `due-week-${task.id}`,
        type: 'deadline_approaching',
        title: 'Deadline Approaching',
        message: `"${task.title}" (${task.ticketId}) is due in ${daysLeft} day${daysLeft > 1 ? 's' : ''}.`,
        taskId: task.id,
        ticketId: task.ticketId,
        isRead: false,
        createdAt: new Date(today.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      })
    }
  }

  if (tasks.length > 0) {
    const oneDayAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const activeCount = tasks.filter((t) => t.status !== 'done').length
    notifications.push({
      id: 'welcome-info',
      type: 'due_this_week',
      title: 'Welcome to TaskFlow',
      message: `You have ${activeCount} active task${activeCount !== 1 ? 's' : ''}. Stay on top of your deadlines!`,
      isRead: false,
      createdAt: oneDayAgo.toISOString(),
    })
  }

  notifications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return notifications
}

const READ_STATUS_KEY = 'taskflow_notifications_read'

function getReadStatus(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(READ_STATUS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function setReadStatus(status: Record<string, boolean>): void {
  localStorage.setItem(READ_STATUS_KEY, JSON.stringify(status))
}

export function getNotificationsWithReadStatus(): AppNotification[] {
  const tasks = getAllTasks()
  const generated = generateNotifications(tasks)
  const readStatus = getReadStatus()

  return generated.map((n) => ({
    ...n,
    isRead: readStatus[n.id] ?? n.isRead,
  }))
}

export function markNotificationRead(id: string): void {
  const status = getReadStatus()
  status[id] = true
  setReadStatus(status)
}

export function markAllNotificationsRead(): void {
  const tasks = getAllTasks()
  const generated = generateNotifications(tasks)
  const status = getReadStatus()
  for (const n of generated) {
    status[n.id] = true
  }
  setReadStatus(status)
}
