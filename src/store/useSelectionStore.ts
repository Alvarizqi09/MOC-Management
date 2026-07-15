import { create } from 'zustand'

interface SelectionState {
  selectedIds: Set<string>
  toggleSelection: (id: string) => void
  selectAll: (ids: string[]) => void
  deselectAll: () => void
  isSelected: (id: string) => boolean
  getSelectedCount: () => number
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  selectedIds: new Set<string>(),

  toggleSelection: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return { selectedIds: next }
    }),

  selectAll: (ids) => set({ selectedIds: new Set(ids) }),

  deselectAll: () => set({ selectedIds: new Set() }),

  isSelected: (id) => get().selectedIds.has(id),

  getSelectedCount: () => get().selectedIds.size,
}))
