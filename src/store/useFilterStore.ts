import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FilterStatus } from '@/types/task.types'

interface FilterState {
  filterStatus: FilterStatus
  searchKeyword: string
  setFilterStatus: (status: FilterStatus) => void
  setSearchKeyword: (keyword: string) => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      filterStatus: 'all',
      searchKeyword: '',
      setFilterStatus: (filterStatus) => set({ filterStatus }),
      setSearchKeyword: (searchKeyword) => set({ searchKeyword }),
      resetFilters: () => set({ filterStatus: 'all', searchKeyword: '' }),
    }),
    {
      name: 'taskflow-filters',
      partialize: (state) => ({
        filterStatus: state.filterStatus,
        searchKeyword: state.searchKeyword,
      }),
    },
  ),
)
