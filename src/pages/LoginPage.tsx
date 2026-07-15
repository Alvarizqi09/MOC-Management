import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { loginSchema, type LoginFormValues } from '@/lib/validators/task'
import { useLogin } from '@/hooks/useTasks'
import { useAuthStore } from '@/store/useAuthStore'
import { getErrorMessage } from '@/lib/utils/axios-error'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { MOCK_CREDENTIALS } from '@/lib/mock-api/auth.mock'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const loginMutation = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        login(data.token, data.user.username)
        toast.success(`Selamat datang, ${data.user.username}!`)
        navigate('/', { replace: true })
      },
      onError: (error) => {
        toast.error(getErrorMessage(error, 'Login gagal'))
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50/30 to-red-50/20 p-4">
      <div className="animate-zoom-in w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-xl font-bold text-white shadow-lg">
            TF
          </div>
          <h1 className="text-2xl font-bold text-slate-900">TaskFlow Manager</h1>
          <p className="mt-1 text-sm text-slate-500">
            Master Online Community Management
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">Masuk</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              id="username"
              label="Username"
              placeholder="Masukkan username"
              autoComplete="username"
              error={errors.username?.message}
              {...register('username')}
            />

            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Masukkan password"
              autoComplete="current-password"
              error={errors.password?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              {...register('password')}
            />

            <Button
              type="submit"
              className="mt-2 w-full"
              size="lg"
              isLoading={loginMutation.isPending}
            >
              Login
            </Button>
          </form>

          <div className="mt-6 rounded-lg bg-slate-50 p-3 text-center text-xs text-slate-500">
            Demo:{' '}
            <code className="font-mono text-slate-700">
              {MOCK_CREDENTIALS.username}
            </code>{' '}
            /{' '}
            <code className="font-mono text-slate-700">
              {MOCK_CREDENTIALS.password}
            </code>
          </div>

          <div className="mt-4 text-center text-sm text-slate-600">
            Belum punya akun?{' '}
            <Link to="/signup" className="font-semibold text-orange-600 hover:text-orange-500">
              Daftar di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
