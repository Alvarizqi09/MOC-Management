import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthSession } from '@/types/task.types'

interface AuthState extends AuthSession {
  login: (token: string, username: string) => void
  logout: () => void
}

const initialState: AuthSession = {
  isAuthenticated: false,
  token: '',
  user: { username: '' },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      login: (token, username) =>
        set({
          isAuthenticated: true,
          token,
          user: { username },
        }),
      logout: () => set(initialState),
    }),
    {
      name: 'taskflow-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        user: state.user,
      }),
    },
  ),
)
