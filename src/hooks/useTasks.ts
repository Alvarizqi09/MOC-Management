import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiClient } from '@/lib/axios-instance'
import type {
  AuthResponse,
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from '@/types/task.types'
import type { LoginFormValues } from '@/lib/validators/task'

export const TASKS_QUERY_KEY = ['tasks'] as const

export function useTasks() {
  return useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get<Task[]>('/tasks')
      return data
    },
  })
}

export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: [...TASKS_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) throw new Error('ID is required')
      const { data } = await apiClient.get<Task>(`/tasks/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginFormValues) => {
      const { data } = await apiClient.post<AuthResponse>(
        '/auth/login',
        credentials,
      )
      return data
    },
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      const { data } = await apiClient.post<Task>('/tasks', input)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
      toast.success('Task berhasil dibuat')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal membuat task')
    },
  })
}

export function useUpdateTask() {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal memperbarui task')
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/tasks/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
      toast.success('Task berhasil dihapus')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menghapus task')
    },
  })
}

export function useBulkUpdateTasks() {
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
    onSuccess: (_, { ids }) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
      toast.success(`${ids.length} task berhasil diperbarui`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal memperbarui task secara bulk')
    },
  })
}

export function useBulkDeleteTasks() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => apiClient.delete(`/tasks/${id}`)))
      return ids
    },
    onSuccess: (ids) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
      toast.success(`${ids.length} task berhasil dihapus`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menghapus task secara bulk')
    },
  })
}
