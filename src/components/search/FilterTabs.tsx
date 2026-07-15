import { useFilterStore } from '@/store/useFilterStore'
import type { FilterStatus } from '@/types/task.types'

const FILTERS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'completed', label: 'Selesai' },
  { value: 'incomplete', label: 'Belum Selesai' },
]

export function FilterTabs() {
  const filterStatus = useFilterStore((s) => s.filterStatus)
  const setFilterStatus = useFilterStore((s) => s.setFilterStatus)

  return (
    <div
      className="flex shrink-0 rounded-lg border border-slate-200 bg-slate-50 p-0.5"
      role="tablist"
      aria-label="Filter status task"
    >
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          role="tab"
          aria-selected={filterStatus === value}
          onClick={() => setFilterStatus(value)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] sm:text-sm ${
            filterStatus === value
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
