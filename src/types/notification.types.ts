export type NotificationType =
  | 'deadline_approaching'
  | 'overdue'
  | 'due_today'
  | 'due_this_week'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  taskId?: string
  ticketId?: string
  isRead: boolean
  createdAt: string
}
