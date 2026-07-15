import { useCallback, useMemo } from 'react'
import { useSelectionStore } from '@/store/useSelectionStore'
import type { Task } from '@/types/task.types'

export function useBulkSelection(visibleTasks: Task[]) {
  const selectedIds = useSelectionStore((s) => s.selectedIds)
  const toggleSelection = useSelectionStore((s) => s.toggleSelection)
  const selectAll = useSelectionStore((s) => s.selectAll)
  const deselectAll = useSelectionStore((s) => s.deselectAll)

  const visibleIds = useMemo(
    () => visibleTasks.map((t) => t.id),
    [visibleTasks],
  )

  const selectedCount = selectedIds.size

  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id))

  const someVisibleSelected =
    visibleIds.some((id) => selectedIds.has(id)) && !allVisibleSelected

  const handleSelectAll = useCallback(() => {
    if (allVisibleSelected) {
      deselectAll()
    } else {
      selectAll(visibleIds)
    }
  }, [allVisibleSelected, deselectAll, selectAll, visibleIds])

  const handleToggle = useCallback(
    (id: string) => {
      toggleSelection(id)
    },
    [toggleSelection],
  )

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds],
  )

  const getSelectedIds = useCallback(
    () => Array.from(selectedIds),
    [selectedIds],
  )

  return {
    selectedCount,
    allVisibleSelected,
    someVisibleSelected,
    handleSelectAll,
    handleToggle,
    isSelected,
    getSelectedIds,
    deselectAll,
  }
}
