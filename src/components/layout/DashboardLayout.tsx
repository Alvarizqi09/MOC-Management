import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TaskFormModal } from '@/components/task/TaskFormModal'
import { TaskDetail } from '@/components/task/TaskDetail'
import { useUIStore } from '@/store/useUIStore'

export function DashboardLayout() {
  const isCreateOpen = useUIStore((s) => s.isCreateOpen)
  const setIsCreateOpen = useUIStore((s) => s.setIsCreateOpen)
  
  const selectedTask = useUIStore((s) => s.selectedTask)
  const setSelectedTask = useUIStore((s) => s.setSelectedTask)

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="mx-auto w-full max-w-7xl flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      <TaskFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <TaskDetail
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  )
}
