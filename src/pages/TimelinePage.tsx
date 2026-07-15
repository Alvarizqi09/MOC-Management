import { RefreshCw } from 'lucide-react'
import { TimelineView } from '@/components/timeline/TimelineView'
import { Button } from '@/components/ui/Button'
import { useTasks, useEvents } from '@/hooks/useTasks'
import { useUIStore } from '@/store/useUIStore'

export function TimelinePage() {
  const setSelectedTask = useUIStore((s) => s.setSelectedTask)

  const { data: tasks, isLoading: tasksLoading, isError: tasksError, error: tasksErrorObj, refetch: refetchTasks } = useTasks()
  const { data: events = [], isLoading: eventsLoading, refetch: refetchEvents } = useEvents()

  const isLoading = tasksLoading || eventsLoading
  const isError = tasksError
  const error = tasksErrorObj
  const refetch = () => { refetchTasks(); refetchEvents() }

  return (
    <div className="flex h-full flex-col overflow-y-auto pb-8 pt-4">
      <div className="mb-8 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Timeline</h1>
        <p className="text-sm text-slate-500">Lihat jadwal task dalam tampilan kalender</p>
      </div>



      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2 h-80 rounded-xl bg-slate-200 animate-pulse" />
          <div className="lg:col-span-3 h-80 rounded-xl bg-slate-200 animate-pulse" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 py-16 text-center">
          <p className="mb-2 text-sm font-medium text-red-700">Gagal memuat data</p>
          <p className="mb-4 text-xs text-red-500">
            {(error as Error)?.message ?? 'Terjadi kesalahan'}
          </p>
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </Button>
        </div>
      ) : (
        <TimelineView tasks={tasks || []} events={events} onTaskClick={setSelectedTask} />
      )}

    </div>
  )
}
