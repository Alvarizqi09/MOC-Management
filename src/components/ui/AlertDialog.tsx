import { useEffect, type ReactNode } from 'react'

interface AlertDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: ReactNode
  cancelText?: string
  confirmText?: string
  isDestructive?: boolean
  isLoading?: boolean
}

export function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  cancelText = 'Cancel',
  confirmText = 'Delete',
  isDestructive = true,
  isLoading = false,
}: AlertDialogProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, isLoading])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200"
        onClick={() => !isLoading && onClose()}
        aria-hidden
      />
      <div
        className="relative w-full max-w-sm animate-zoom-in rounded-2xl bg-white dark:bg-slate-900 shadow-2xl dark:shadow-slate-900/50 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden"
        role="alertdialog"
        aria-modal
      >
        <div className="p-6 pb-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 p-4 px-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 flex items-center gap-2 ${
              isDestructive
                ? 'bg-red-500 hover:bg-red-600 text-red-50'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            {isLoading ? (
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : null}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
