import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiClient } from '@/lib/axios-instance'
import { TASKS_QUERY_KEY } from '@/hooks/useTasks'
import type { Task, UpdateTaskInput } from '@/types/task.types'

interface OptimisticContext {
  previousTasks: Task[] | undefined
}

export function useOptimisticTaskUpdate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string
      updates: UpdateTaskInput
    }) => {
      const { data } = await apiClient.patch<Task>(`/tasks/${id}`, updates)
      return data
    },
    onMutate: async ({ id, updates }): Promise<OptimisticContext> => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY })

      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY)

      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old) =>
        old?.map((task) =>
          task.id === id
            ? { ...task, ...updates, updatedAt: new Date().toISOString() }
            : task,
        ),
      )

      return { previousTasks }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks)
      }
      toast.error('Gagal memperbarui task — posisi dikembalikan')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
    },
  })
}

export function useOptimisticBulkUpdate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      ids,
      updates,
    }: {
      ids: string[]
      updates: UpdateTaskInput
    }) => {
      const results = await Promise.all(
        ids.map(async (id) => {
          const { data } = await apiClient.patch<Task>(`/tasks/${id}`, updates)
          return data
        }),
      )
      return results
    },
    onMutate: async ({ ids, updates }): Promise<OptimisticContext> => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY })

      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY)
      const idSet = new Set(ids)

      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old) =>
        old?.map((task) =>
          idSet.has(task.id)
            ? { ...task, ...updates, updatedAt: new Date().toISOString() }
            : task,
        ),
      )

      return { previousTasks }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks)
      }
      toast.error('Gagal memperbarui task — perubahan dikembalikan')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
    },
  })
}

export function useOptimisticBulkDelete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => apiClient.delete(`/tasks/${id}`)))
      return ids
    },
    onMutate: async (ids): Promise<OptimisticContext> => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY })

      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY)
      const idSet = new Set(ids)

      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old) =>
        old?.filter((task) => !idSet.has(task.id)),
      )

      return { previousTasks }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks)
      }
      toast.error('Gagal menghapus task — data dikembalikan')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
    },
  })
}
