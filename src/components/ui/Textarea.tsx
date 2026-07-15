import { forwardRef, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}
      <textarea
        ref={ref}
        id={id}
        className={`resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''} ${className}`}
        {...props}
      />
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  ),
)

Textarea.displayName = 'Textarea'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  children: ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, className = '', children, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}
      <select
        ref={ref}
        id={id}
        className={`rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${error ? 'border-red-300' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  ),
)

Select.displayName = 'Select'
