import { useNavigate } from 'react-router-dom'
import { BellOff, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { NotificationItem } from './NotificationItem'
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications'
import { useNotificationStore } from '@/store/useNotificationStore'

export function NotificationPanel() {
  const navigate = useNavigate()
  const { data: notifications = [], isLoading } = useNotifications()
  const markAsRead = useMarkNotificationRead()
  const markAllAsRead = useMarkAllNotificationsRead()
  const setPanelOpen = useNotificationStore((s) => s.setPanelOpen)

  const handleNavigate = (taskId?: string) => {
    if (taskId) navigate(`/board/task/${taskId}`)
  }

  const today = notifications.filter(
    (n) => new Date(n.createdAt).toDateString() === new Date().toDateString(),
  )
  const earlier = notifications.filter(
    (n) => new Date(n.createdAt).toDateString() !== new Date().toDateString(),
  )

  const hasUnread = notifications.some((n) => !n.isRead)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700/50">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Notifications
        </h2>
        <div className="flex items-center gap-1">
          {hasUnread && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsRead.mutate()}
              className="text-xs text-orange-600 dark:text-orange-400"
            >
              Mark all read
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPanelOpen(false)}
            className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BellOff className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No notifications</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              You're all caught up!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {today.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-medium mb-2 px-1">
                  Today
                </div>
                <div className="space-y-2">
                  {today.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onRead={(id) => markAsRead.mutate(id)}
                      onNavigate={handleNavigate}
                    />
                  ))}
                </div>
              </div>
            )}
            {earlier.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-medium mb-2 px-1">
                  Earlier
                </div>
                <div className="space-y-2">
                  {earlier.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onRead={(id) => markAsRead.mutate(id)}
                      onNavigate={handleNavigate}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
