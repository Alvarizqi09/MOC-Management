import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, rightIcon, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          ref={ref}
          id={id}
          className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''} ${rightIcon ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-0 top-0 flex h-full items-center justify-center pr-3">
            {rightIcon}
          </div>
        )}
      </div>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  ),
)

Input.displayName = 'Input'
