import type {
  AxiosAdapter,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import {
  createTask,
  deleteTask,
  generateTicketId,
  getAllTasks,
  getTaskById,
  seedInitialTasks,
  updateTask,
} from '@/storage/db'
import {
  generateMockToken,
  isValidToken,
  validateCredentials,
} from '@/lib/mock-api/auth.mock'
import type { CreateTaskInput, Task, UpdateTaskInput } from '@/types/task.types'

const MIN_DELAY = 800
const MAX_DELAY = 1000
const MUTATION_ERROR_RATE = 0.1

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function randomDelay(): Promise<void> {
  const ms = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY)
  return delay(ms)
}

function shouldSimulateMutationError(): boolean {
  return Math.random() < MUTATION_ERROR_RATE
}

function createResponse<T>(
  config: InternalAxiosRequestConfig,
  data: T,
  status = 200,
): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: {},
    config,
  }
}

function createErrorResponse(
  config: InternalAxiosRequestConfig,
  status: number,
  message: string,
): AxiosResponse {
  const error = new Error(message) as Error & {
    response: AxiosResponse
    isAxiosError: boolean
  }
  error.response = createResponse(config, { message }, status)
  error.isAxiosError = true
  return Promise.reject(error) as unknown as AxiosResponse
}

function getAuthToken(config: InternalAxiosRequestConfig): string | null {
  const auth = config.headers?.Authorization
  if (typeof auth === 'string' && auth.startsWith('Bearer ')) {
    return auth.slice(7)
  }
  return null
}

function parseRequestBody<T>(data: unknown): T {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as T
    } catch {
      return data as T
    }
  }
  return data as T
}

function resolveRequestPath(config: InternalAxiosRequestConfig): string {
  const url = config.url ?? ''
  const base = (config.baseURL ?? '').replace(/\/$/, '')
  if (base && url.startsWith(base)) {
    return url.slice(base.length) || '/'
  }
  return url
}
function requireAuth(config: InternalAxiosRequestConfig): string | null {
  const token = getAuthToken(config)
  if (!isValidToken(token)) {
    throw createErrorResponse(config, 401, 'Unauthorized — token tidak valid')
  }
  return token
}

async function handleRequest(
  config: InternalAxiosRequestConfig,
): Promise<AxiosResponse> {
  await randomDelay()

  const method = (config.method ?? 'get').toLowerCase()
  const url = resolveRequestPath(config)

  // Auth endpoints
  if (url === '/auth/login' && method === 'post') {
    const body = parseRequestBody<{ username: string; password: string }>(
      config.data,
    )
    if (!validateCredentials(body.username, body.password)) {
      return createErrorResponse(config, 401, 'Username atau password salah')
    }
    return createResponse(config, {
      token: generateMockToken(),
      user: { username: body.username },
    })
  }

  if (url === '/auth/validate' && method === 'get') {
    requireAuth(config)
    return createResponse(config, { valid: true })
  }

  // Protected task routes
  requireAuth(config)
  seedInitialTasks()

  if (url === '/tasks' && method === 'get') {
    return createResponse(config, getAllTasks())
  }

  if (url === '/tasks' && method === 'post') {
    if (shouldSimulateMutationError()) {
      return createErrorResponse(
        config,
        500,
        'Gagal menyimpan task — simulasi error server',
      )
    }
    const input = parseRequestBody<CreateTaskInput>(config.data)
    const now = new Date().toISOString()
    const task: Task = {
      id: crypto.randomUUID(),
      ticketId: generateTicketId(),
      title: input.title,
      description: input.description,
      status: input.status ?? 'todo',
      priority: input.priority,
      dueDate: input.dueDate,
      createdAt: now,
      updatedAt: now,
    }
    createTask(task)
    return createResponse(config, task, 201)
  }

  const taskMatch = url.match(/^\/tasks\/([^/]+)$/)
  if (taskMatch) {
    const taskId = taskMatch[1]

    if (method === 'get') {
      const task = getTaskById(taskId)
      if (!task) {
        return createErrorResponse(config, 404, 'Task tidak ditemukan')
      }
      return createResponse(config, task)
    }

    if (method === 'patch') {
      if (shouldSimulateMutationError()) {
        return createErrorResponse(
          config,
          500,
          'Gagal memperbarui task — simulasi error server',
        )
      }
      const input = parseRequestBody<UpdateTaskInput>(config.data)
      const updated = updateTask(taskId, input)
      if (!updated) {
        return createErrorResponse(config, 404, 'Task tidak ditemukan')
      }
      return createResponse(config, updated)
    }

    if (method === 'delete') {
      if (shouldSimulateMutationError()) {
        return createErrorResponse(
          config,
          500,
          'Gagal menghapus task — simulasi error server',
        )
      }
      const deleted = deleteTask(taskId)
      if (!deleted) {
        return createErrorResponse(config, 404, 'Task tidak ditemukan')
      }
      return createResponse(config, { success: true })
    }
  }

  return createErrorResponse(config, 404, 'Endpoint tidak ditemukan')
}

export const mockAdapter: AxiosAdapter = (config) => {
  return handleRequest(config as InternalAxiosRequestConfig)
}
