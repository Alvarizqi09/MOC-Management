import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { signupSchema, type SignupFormValues } from '@/lib/validators/task'
import { useAuthStore } from '@/store/useAuthStore'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import logoImage from '@/assets/logo.png'
import fallbackImage from '@/assets/fallback.png'
import { apiClient } from '@/lib/axios-instance'

export function SignupPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (values: SignupFormValues) => {
    try {
      const response = await apiClient.post('/auth/signup', {
        username: values.username,
        password: values.password,
      })
      const { token } = response.data
      
      login(token, values.username)
      toast.success(`Akun berhasil dibuat! Selamat datang, ${values.username}.`)
      navigate('/board', { replace: true })
    } catch {
      toast.error('Gagal membuat akun, silakan coba lagi.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="flex flex-col items-center">
          <img src={logoImage} alt="TaskFlow" className="h-16 w-auto object-contain mb-4 dark:hidden" />
          <img src={fallbackImage} alt="TaskFlow" className="h-16 w-auto object-contain mb-4 hidden dark:block" />
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            TaskFlow Manager
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Daftar akun baru
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-800 p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50">
          <h2 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">Sign Up</h2>

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
              type="password"
              label="Password"
              placeholder="Minimal 6 karakter"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              id="confirmPassword"
              type="password"
              label="Konfirmasi Password"
              placeholder="Masukkan ulang password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              className="mt-2 w-full"
              size="lg"
              isLoading={isSubmitting}
            >
              Daftar
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-semibold text-orange-600 hover:text-orange-500">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
