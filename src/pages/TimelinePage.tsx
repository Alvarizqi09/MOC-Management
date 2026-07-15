import { RefreshCw } from 'lucide-react'
import { SearchBar } from '@/components/search/SearchBar'
import { FilterTabs } from '@/components/search/FilterTabs'
import { TimelineView } from '@/components/timeline/TimelineView'
import { Button } from '@/components/ui/Button'
import { useTasks } from '@/hooks/useTasks'
import { useFilteredTasks, useDebouncedValue } from '@/hooks/useFilteredTasks'
import { useFilterStore } from '@/store/useFilterStore'
import { useUIStore } from '@/store/useUIStore'

export function TimelinePage() {
  const filterStatus = useFilterStore((s) => s.filterStatus)
  const searchKeyword = useFilterStore((s) => s.searchKeyword)
  const debouncedSearch = useDebouncedValue(searchKeyword, 300)
  const setSelectedTask = useUIStore((s) => s.setSelectedTask)

  const { data: tasks, isLoading, isError, error, refetch, isFetching } = useTasks()
  const filteredTasks = useFilteredTasks(tasks, filterStatus, debouncedSearch)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Timeline</h1>
        <p className="text-sm text-slate-500">Lihat jadwal task dalam tampilan kalender</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar />
          <FilterTabs />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2 h-80 rounded-xl bg-slate-200 animate-pulse" />
          <div className="lg:col-span-3 h-80 rounded-xl bg-slate-200 animate-pulse" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 py-16 text-center">
          <p className="mb-2 text-sm font-medium text-red-700">Gagal memuat task</p>
          <p className="mb-4 text-xs text-red-500">
            {(error as Error)?.message ?? 'Terjadi kesalahan'}
          </p>
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </Button>
        </div>
      ) : filteredTasks.length === 0 && tasks && tasks.length > 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <p className="text-sm font-medium text-slate-600">
            Tidak ada task yang cocok dengan filter
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Coba ubah kata kunci pencarian atau filter status
          </p>
        </div>
      ) : (
        <TimelineView tasks={filteredTasks} onTaskClick={setSelectedTask} />
      )}

      {isFetching && !isLoading ? (
        <p className="mt-4 text-center text-xs text-slate-400">Memuat ulang...</p>
      ) : null}
    </div>
  )
}
