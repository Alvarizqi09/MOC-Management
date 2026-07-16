import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, 'Username wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
})

export type SignupFormValues = z.infer<typeof signupSchema>

export const taskSchema = z.object({
  title: z.string().min(1, 'Judul task wajib diisi').max(120, 'Judul maksimal 120 karakter'),
  description: z.string().max(500, 'Deskripsi maksimal 500 karakter').optional(),
  status: z.enum(['todo', 'in_progress', 'done'], { required_error: 'Status wajib dipilih' }),
  priority: z.enum(['', 'low', 'medium', 'high']).optional(),
  dueDate: z.string().min(1, 'Due date wajib diisi'),
})

export type TaskFormValues = z.infer<typeof taskSchema>

export function parseTaskFormValues(values: TaskFormValues) {
  const priority =
    values.priority === 'low' ||
    values.priority === 'medium' ||
    values.priority === 'high'
      ? values.priority
      : undefined

  return {
    title: values.title,
    description: values.description || undefined,
    status: values.status,
    priority,
    dueDate: values.dueDate,
  }
}
