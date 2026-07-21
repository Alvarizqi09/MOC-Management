import { create } from 'zustand'

interface NotificationUIState {
  isPanelOpen: boolean
  setPanelOpen: (open: boolean) => void
  togglePanel: () => void
}

export const useNotificationStore = create<NotificationUIState>((set) => ({
  isPanelOpen: false,
  setPanelOpen: (open) => set({ isPanelOpen: open }),
  togglePanel: () => set((s) => ({ isPanelOpen: !s.isPanelOpen })),
}))

