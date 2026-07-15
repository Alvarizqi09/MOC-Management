import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiClient } from '@/lib/axios-instance'
import type {
  AuthResponse,
  CreateTaskInput,
  Task,
  TaskEvent,
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

export const EVENTS_QUERY_KEY = ['events'] as const

export function useEvents() {
  return useQuery({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get<TaskEvent[]>('/events')
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
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY })
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY)
      
      const optimisticTask: Task = {
        id: `temp-${Date.now()}`,
        ticketId: 'TASK-...',
        title: input.title,
        description: input.description,
        status: input.status ?? 'todo',
        priority: input.priority,
        dueDate: input.dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old) => {
        return old ? [...old, optimisticTask] : [optimisticTask]
      })

      return { previousTasks }
    },
    onSuccess: () => {
      toast.success('Task berhasil dibuat')
    },
    onError: (error: Error, _variables, context: { previousTasks?: Task[] } | undefined) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks)
      }
      toast.error(error.message || 'Gagal membuat task')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
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
    onMutate: async ({ id, updates }) => {
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
    onSuccess: () => {
      toast.success('Task berhasil diperbarui')
    },
    onError: (error: Error, _variables, context: { previousTasks?: Task[] } | undefined) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks)
      }
      toast.error(error.message || 'Gagal memperbarui task')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
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
