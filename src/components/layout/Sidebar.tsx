import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, Plus, LogOut, User } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useUIStore } from '@/store/useUIStore'
import { Button } from '@/components/ui/Button'

export function Sidebar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const setIsCreateOpen = useUIStore((s) => s.setIsCreateOpen)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white shadow-sm">
      <div className="flex h-16 items-center border-b border-slate-100 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-orange-500 font-bold text-white">
            TF
          </div>
          <span className="font-bold text-slate-900 tracking-tight">TaskFlow</span>
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
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <CalendarDays className="h-5 w-5" />
            Timeline
          </NavLink>
        </nav>
      </div>

      <div className="border-t border-slate-100 p-4">
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-700">
            <User className="h-5 w-5" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-slate-900">
              {user?.username}
            </p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
