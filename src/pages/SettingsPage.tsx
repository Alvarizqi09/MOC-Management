import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/store/useThemeStore'

export function SettingsPage() {
  const { theme, setTheme } = useThemeStore()

  return (
    <div className="flex h-full flex-col overflow-y-auto px-6 md:px-10 py-8">
      <div className="mb-8 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Manage your preferences and account.</p>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-6">Appearance</h3>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Theme</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Choose dark or light theme</p>
              </div>
              
              <div className="flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    theme === 'light'
                      ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-600/20'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <Sun className="h-4 w-4" />
                  Light
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Trigger TS Server update
