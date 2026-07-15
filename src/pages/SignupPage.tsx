import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { signupSchema, type SignupFormValues } from '@/lib/validators/task'
import { useAuthStore } from '@/store/useAuthStore'
import { generateMockToken } from '@/lib/mock-api/auth.mock'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

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
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    // Simulate successful signup and login
    const token = generateMockToken()
    login(token, values.username)
    toast.success(`Akun berhasil dibuat! Selamat datang, ${values.username}.`)
    navigate('/board', { replace: true })
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
            Daftar akun baru
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">Sign Up</h2>

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

          <div className="mt-6 text-center text-sm text-slate-600">
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
