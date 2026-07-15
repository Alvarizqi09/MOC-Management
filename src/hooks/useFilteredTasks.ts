import { useEffect, useMemo, useState } from 'react'
import type { FilterStatus, Task } from '@/types/task.types'

export function useFilteredTasks(
  tasks: Task[] | undefined,
  filterStatus: FilterStatus,
  searchKeyword: string,
): Task[] {
  return useMemo(() => {
    if (!tasks) return []

    let filtered = tasks

    if (filterStatus === 'completed') {
      filtered = filtered.filter((t) => t.status === 'done')
    } else if (filterStatus === 'incomplete') {
      filtered = filtered.filter((t) => t.status !== 'done')
    }

    const keyword = searchKeyword.trim().toLowerCase()
    if (keyword) {
      filtered = filtered.filter((t) => {
        const ticketMatch =
          t.ticketId.toLowerCase().includes(keyword) ||
          t.ticketId.replace('TASKFLOW-', '').includes(keyword)
        const titleMatch = t.title.toLowerCase().includes(keyword)
        const descMatch = t.description?.toLowerCase().includes(keyword)
        return ticketMatch || titleMatch || !!descMatch
      })
    }

    return filtered
  }, [tasks, filterStatus, searchKeyword])
}

export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}
