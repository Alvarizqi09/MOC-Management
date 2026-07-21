import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode
  error?: string
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, rightIcon, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          ref={ref}
          id={id}
          className={`w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-orange-400 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/30 ${error ? 'border-red-300 dark:border-red-500/50 focus:border-red-400 dark:focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30' : ''} ${rightIcon ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-0 top-0 flex h-full items-center justify-center pr-3">
            {rightIcon}
          </div>
        )}
      </div>
      {error ? <p className="text-xs text-red-500 dark:text-red-400">{error}</p> : null}
    </div>
  ),
)

Input.displayName = 'Input'
