import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, Plus, LogOut, User, Settings } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useUIStore } from '@/store/useUIStore'
import { Button } from '@/components/ui/Button'
import logoImage from '@/assets/logo-dark.svg'
import logoDarkImage from '@/assets/fallback.svg'

export function Sidebar({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const setIsCreateOpen = useUIStore((s) => s.setIsCreateOpen)
  const setIsMobileMenuOpen = useUIStore((s) => s.setIsMobileMenuOpen)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className={`flex h-full flex-col border-r border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 ${
        variant === 'mobile' ? 'w-full' : 'hidden md:flex w-64'
      }`}
    >
      <div className="flex h-16 shrink-0 items-center border-b border-slate-100 dark:border-slate-700/50 px-6">
        <div className="flex items-center gap-3">
          <img src={logoImage} alt="TaskFlow" className="h-8 w-auto dark:hidden" />
          <img src={logoDarkImage} alt="TaskFlow" className="h-8 w-auto hidden dark:block" />
          <span className="font-bold text-slate-900 dark:text-white tracking-tight">TaskFlow</span>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <Button 
          className="mb-8 w-full justify-center shadow-md shadow-orange-500/20"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Task Baru
        </Button>

        <nav className="space-y-1">
          <NavLink
            to="/board"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            <LayoutDashboard className="h-5 w-5" />
            Board
          </NavLink>

          <NavLink
            to="/timeline"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            <CalendarDays className="h-5 w-5" />
            Timeline
          </NavLink>

          <NavLink
            to="/settings"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            <Settings className="h-5 w-5" />
            Settings
          </NavLink>
        </nav>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-700/50 p-4 shrink-0">
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400">
            <User className="h-5 w-5" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
              {user?.username}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-red-600 dark:hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
