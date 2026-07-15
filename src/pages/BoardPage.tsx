import { RefreshCw, Plus } from 'lucide-react'
import { SearchBar } from '@/components/search/SearchBar'
import { FilterTabs } from '@/components/search/FilterTabs'
import { SelectAllCheckbox } from '@/components/bulk/SelectAllCheckbox'
import { BulkActionBar } from '@/components/bulk/BulkActionBar'
import { KanbanBoard } from '@/components/board/KanbanBoard'
import { BoardSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { useTasks } from '@/hooks/useTasks'
import { useFilteredTasks, useDebouncedValue } from '@/hooks/useFilteredTasks'
import { useBulkSelection } from '@/hooks/useBulkSelection'
import { useFilterStore } from '@/store/useFilterStore'
import { useUIStore } from '@/store/useUIStore'

export function BoardPage() {
  const filterStatus = useFilterStore((s) => s.filterStatus)
  const searchKeyword = useFilterStore((s) => s.searchKeyword)
  const debouncedSearch = useDebouncedValue(searchKeyword, 300)
  const setSelectedTask = useUIStore((s) => s.setSelectedTask)

  const { data: tasks, isLoading, isError, error, refetch, isFetching } = useTasks()
  const filteredTasks = useFilteredTasks(tasks, filterStatus, debouncedSearch)

  const {
    selectedCount,
    allVisibleSelected,
    someVisibleSelected,
    handleSelectAll,
    handleToggle,
    isSelected,
    getSelectedIds,
    deselectAll,
  } = useBulkSelection(filteredTasks)

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex shrink-0 items-end justify-between gap-3">
        <div>
          <div className="font-syne text-2xl tracking-tight text-slate-900">
            Kanban Board
          </div>
          <div className="text-sm text-slate-500">
            Track every opportunity with intent.
          </div>
        </div>
        <Button onClick={() => useUIStore.getState().setIsCreateOpen(true)} size="sm" className="bg-orange-500 text-white hover:bg-orange-600">
          <Plus className="mr-2 h-4 w-4" />
          Task Baru
        </Button>
      </div>

      <div className="mb-6 flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar />
          <FilterTabs />
        </div>

        <div className="flex items-center gap-3">
          {filteredTasks.length > 0 ? (
            <SelectAllCheckbox
              checked={allVisibleSelected}
              indeterminate={someVisibleSelected}
              onChange={handleSelectAll}
            />
          ) : null}
        </div>
      </div>

      {isLoading ? (
        <BoardSkeleton />
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
        <div className="min-h-0 flex-1">
          <KanbanBoard
            tasks={filteredTasks}
            isSelected={isSelected}
            onToggleSelect={handleToggle}
            onTaskClick={setSelectedTask}
          />
        </div>
      )}

      {isFetching && !isLoading ? (
        <p className="mt-4 shrink-0 text-center text-xs text-slate-400">Memuat ulang...</p>
      ) : null}

      <BulkActionBar
        selectedCount={selectedCount}
        selectedIds={getSelectedIds()}
        onClear={deselectAll}
      />
    </div>
  )
}
