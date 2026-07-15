import { create } from 'zustand'
import type { Task } from '@/types/task.types'

interface UIState {
  isCreateOpen: boolean
  setIsCreateOpen: (isOpen: boolean) => void
  selectedTask: Task | null
  setSelectedTask: (task: Task | null) => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isOpen: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  isCreateOpen: false,
  setIsCreateOpen: (isOpen) => set({ isCreateOpen: isOpen }),
  selectedTask: null,
  setSelectedTask: (task) => set({ selectedTask: task }),
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
}))
