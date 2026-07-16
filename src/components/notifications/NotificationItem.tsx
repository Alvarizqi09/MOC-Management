import { formatDistanceToNow } from 'date-fns'
import { AlertTriangle, CalendarClock, Clock, Info, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { AppNotification, NotificationType } from '@/types/notification.types'

const ICON_MAP: Record<NotificationType, React.ElementType> = {
  overdue: AlertTriangle,
  deadline_approaching: CalendarClock,
  due_today: Clock,
  due_this_week: Info,
}

const COLOR_MAP: Record<NotificationType, string> = {
  overdue: '#EF4444',
  deadline_approaching: '#F59E0B',
  due_today: '#3B82F6',
  due_this_week: '#10B981',
}

interface Props {
  notification: AppNotification
  onRead: (id: string) => void
  onNavigate?: (taskId?: string) => void
}

export function NotificationItem({ notification, onRead, onNavigate }: Props) {
  const Icon = ICON_MAP[notification.type] ?? Info
  const color = COLOR_MAP[notification.type] ?? '#6B7280'

  return (
    <div
      className={`rounded-lg border p-3 transition ${
        notification.isRead
          ? 'border-slate-200/50 dark:border-slate-700/30 bg-transparent opacity-60'
          : 'border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/40'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: color + '18' }}
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
            {notification.title}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {notification.taskId && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[10px] text-orange-600 dark:text-orange-400 px-2"
                onClick={() => onNavigate?.(notification.taskId)}
              >
                View Task
              </Button>
            )}
            {!notification.isRead && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[10px] text-slate-500 dark:text-slate-400 px-2"
                onClick={() => onRead(notification.id)}
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark read
              </Button>
            )}
            <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
