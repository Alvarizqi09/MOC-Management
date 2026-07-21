import { Bell } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'
import { useNotificationStore } from '@/store/useNotificationStore'
import { Button } from '@/components/ui/Button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { NotificationPanel } from './NotificationPanel'

export function NotificationBell() {
  const { data: notifications = [] } = useNotifications()
  const isPanelOpen = useNotificationStore((s) => s.isPanelOpen)
  const setPanelOpen = useNotificationStore((s) => s.setPanelOpen)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <Sheet open={isPanelOpen} onOpenChange={setPanelOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 animate-zoom-in">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        }
      />
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[90vw] sm:w-[380px] md:w-[420px] p-0 border-l border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900"
      >
        <NotificationPanel />
      </SheetContent>
    </Sheet>
  )
}
