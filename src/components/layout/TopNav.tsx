import { Menu } from 'lucide-react'
import { useUIStore } from '@/store/useUIStore'
import { useAuthStore } from '@/store/useAuthStore'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Sidebar } from './Sidebar'
import { NotificationBell } from '@/components/notifications/NotificationBell'

export function TopNav() {
  const isMobileMenuOpen = useUIStore((s) => s.isMobileMenuOpen)
  const setIsMobileMenuOpen = useUIStore((s) => s.setIsMobileMenuOpen)
  const { user } = useAuthStore()

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger render={
              <button
                className="rounded-lg p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 focus:outline-none"
                aria-label="Open sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
            } />
            <SheetContent side="left" className="p-0 w-64 border-r border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900">
              <Sidebar variant="mobile" />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
        <NotificationBell />

        <div className="h-8 w-8 overflow-hidden rounded-full bg-orange-100 dark:bg-orange-900/40 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center text-orange-700 dark:text-orange-400 ml-2">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm font-semibold">{user?.username?.charAt(0).toUpperCase()}</span>
          )}
        </div>
      </div>
    </header>
  )
}
