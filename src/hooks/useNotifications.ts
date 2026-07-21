import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios-instance'
import type { AppNotification } from '@/types/notification.types'

export const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const

export function useNotifications() {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get<AppNotification[]>('/notifications')
      return data
    },
    staleTime: 30_000,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.patch(`/notifications/${id}/read`)
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
      const previous = queryClient.getQueryData<AppNotification[]>(NOTIFICATIONS_QUERY_KEY)

      queryClient.setQueryData<AppNotification[]>(NOTIFICATIONS_QUERY_KEY, (old) =>
        old?.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      )

      return { previous }
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await apiClient.patch('/notifications/read-all')
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
      const previous = queryClient.getQueryData<AppNotification[]>(NOTIFICATIONS_QUERY_KEY)

      queryClient.setQueryData<AppNotification[]>(NOTIFICATIONS_QUERY_KEY, (old) =>
        old?.map((n) => ({ ...n, isRead: true })),
      )

      return { previous }
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
    },
  })
}
