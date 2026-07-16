import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Command } from 'cmdk'
import { Dialog } from '@base-ui/react/dialog'
import { Search, LayoutDashboard, CalendarDays, Settings, Ticket, Hash } from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'

const STATUS_LABELS: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
}

const STATUS_CLASSES: Record<string, string> = {
  todo: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  in_progress: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  done: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
}

interface CommandSearchModalProps {
  externalOpen?: boolean
  onExternalOpenChange?: (open: boolean) => void
}

export function CommandSearchModal({ externalOpen, onExternalOpenChange }: CommandSearchModalProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = externalOpen !== undefined
  const open = isControlled ? externalOpen : internalOpen

  const setOpen = useCallback(
    (val: boolean) => {
      if (isControlled) {
        onExternalOpenChange?.(val)
      } else {
        setInternalOpen(val)
      }
    },
    [isControlled, onExternalOpenChange],
  )

  const navigate = useNavigate()
  const { data: tasks = [] } = useTasks()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, setOpen])

  const handleNavigate = useCallback(
    (path: string) => {
      setOpen(false)
      navigate(path)
    },
    [navigate, setOpen],
  )

  return (
    <Dialog.Root open={open} onOpenChange={(val) => setOpen(val)}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs" />

        <Dialog.Popup
          className="fixed top-[25%] left-1/2 z-50 w-full max-w-lg -translate-x-1/2 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
        >
          <Command>
            <div className="flex items-center border-b border-slate-200 dark:border-slate-700/50 px-4">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <Command.Input
                placeholder="Search tasks by ticket ID, title, or description..."
                className="flex-1 bg-transparent py-3.5 px-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
              />
              <kbd className="hidden sm:flex items-center gap-0.5 rounded bg-slate-100 dark:bg-slate-700/50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>

            <Command.List className="max-h-72 overflow-y-auto p-2">
              <Command.Empty className="flex flex-col items-center justify-center py-8 text-center">
                <Search className="h-8 w-8 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No results found</p>
              </Command.Empty>

              <Command.Group heading="Tasks">
                {tasks.slice(0, 12).map((task) => (
                  <Command.Item
                    key={task.id}
                    value={`${task.ticketId} ${task.title}`}
                    onSelect={() => handleNavigate(`/board/task/${task.id}`)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 aria-selected:bg-orange-50 dark:aria-selected:bg-orange-900/30 aria-selected:text-orange-700 dark:aria-selected:text-orange-300"
                  >
                    <Ticket className="h-4 w-4 shrink-0 opacity-60" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                        <Hash className="inline h-3 w-3 mr-0.5" />
                        {task.ticketId}
                      </span>
                      <span className="font-medium block truncate">{task.title}</span>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_CLASSES[task.status] ?? STATUS_CLASSES.todo}`}>
                      {STATUS_LABELS[task.status] ?? task.status}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group heading="Navigate">
                <Command.Item
                  value="Go to Board"
                  onSelect={() => handleNavigate('/board')}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 aria-selected:bg-orange-50 dark:aria-selected:bg-orange-900/30 aria-selected:text-orange-700 dark:aria-selected:text-orange-300"
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0 opacity-60" />
                  Go to Board
                </Command.Item>
                <Command.Item
                  value="Go to Timeline"
                  onSelect={() => handleNavigate('/timeline')}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 aria-selected:bg-orange-50 dark:aria-selected:bg-orange-900/30 aria-selected:text-orange-700 dark:aria-selected:text-orange-300"
                >
                  <CalendarDays className="h-4 w-4 shrink-0 opacity-60" />
                  Go to Timeline
                </Command.Item>
                <Command.Item
                  value="Go to Settings"
                  onSelect={() => handleNavigate('/settings')}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 aria-selected:bg-orange-50 dark:aria-selected:bg-orange-900/30 aria-selected:text-orange-700 dark:aria-selected:text-orange-300"
                >
                  <Settings className="h-4 w-4 shrink-0 opacity-60" />
                  Go to Settings
                </Command.Item>
              </Command.Group>
            </Command.List>

            <div className="flex items-center gap-4 border-t border-slate-200 dark:border-slate-700/50 px-4 py-2 text-[10px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-slate-100 dark:bg-slate-700/50 px-1 py-0.5 text-[10px] font-semibold">↑↓</kbd> Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-slate-100 dark:bg-slate-700/50 px-1 py-0.5 text-[10px] font-semibold">↵</kbd> Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-slate-100 dark:bg-slate-700/50 px-1 py-0.5 text-[10px] font-semibold">Esc</kbd> Close
              </span>
            </div>
          </Command>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
