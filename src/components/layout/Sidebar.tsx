import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, Plus, LogOut, User, Settings } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useUIStore } from '@/store/useUIStore'
import { Button } from '@/components/ui/Button'
import logoImage from '@/assets/logo.png'
import fallbackImage from '@/assets/fallback.png'

export function Sidebar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const setIsCreateOpen = useUIStore((s) => s.setIsCreateOpen)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
      <div className="flex h-16 items-center border-b border-slate-100 px-6">
        <div className="flex items-center gap-3">
          <img src={logoImage} alt="TaskFlow" className="h-8 w-auto object-contain dark:hidden" />
          <img src={fallbackImage} alt="TaskFlow" className="h-8 w-auto object-contain hidden dark:block" />
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
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            <LayoutDashboard className="h-5 w-5" />
            Board
          </NavLink>

          <NavLink
            to="/timeline"
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
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            <Settings className="h-5 w-5" />
            Settings
          </NavLink>
        </nav>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 p-4">
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
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
