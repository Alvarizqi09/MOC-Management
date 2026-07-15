import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { ArrowLeft, Calendar, Activity, AlignLeft, MessageSquare, Pencil, Trash2 } from 'lucide-react'
import { useTask, useDeleteTask } from '@/hooks/useTasks'
import { PRIORITY_CONFIG } from '@/types/task.types'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { TaskEditModal } from '@/components/task/TaskEditModal'
import { AlertDialog } from '@/components/ui/AlertDialog'

const TABS = [
  { id: 'info', label: 'Info Task', icon: AlignLeft },
  { id: 'activity', label: 'Aktivitas', icon: Activity },
  { id: 'comments', label: 'Komentar', icon: MessageSquare },
] as const

type TabId = typeof TABS[number]['id']

const STATUS_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  todo: { label: 'To Do', bg: 'bg-purple-100', text: 'text-purple-700' },
  in_progress: { label: 'In Progress', bg: 'bg-blue-100', text: 'text-blue-700' },
  done: { label: 'Done', bg: 'bg-green-100', text: 'text-green-700' },
}

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: task, isLoading, isError } = useTask(id)
  const deleteTask = useDeleteTask()
  
  const [activeTab, setActiveTab] = useState<TabId>('info')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex h-full flex-col gap-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  if (isError || !task) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Task tidak ditemukan</h2>
        <p className="text-sm text-slate-500 mb-6">Task yang Anda cari mungkin sudah dihapus atau tidak tersedia.</p>
        <Button onClick={() => navigate('/board')}>Kembali ke Board</Button>
      </div>
    )
  }

  const priority = task.priority ? PRIORITY_CONFIG[task.priority] : null
  const status = STATUS_LABELS[task.status]

  return (
    <div className="flex h-full flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-100 bg-white px-6 md:px-10 py-8 pb-0">
        <div className="flex items-start gap-5 mb-8">
          <button
            onClick={() => navigate('/board')}
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 hover:shadow-sm border border-slate-200/60"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200 shadow-sm">
                {task.ticketId}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${status.bg} ${status.text}`}>
                {status.label}
              </span>
              {priority && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${priority.className}`}>
                  {priority.label}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight break-words">
              {task.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
             <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
              >
                <Pencil className="h-4 w-4" />
                <span className="hidden sm:inline">Edit Task</span>
              </button>
              <button
                onClick={() => setIsDeleteDialogOpen(true)}
                className="flex items-center justify-center p-2 text-slate-400 bg-white border border-slate-200 rounded-lg shadow-sm hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-colors"
                aria-label="Hapus Task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 pb-4 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-10">
        {activeTab === 'info' && (
          <div className="w-full space-y-10">
            <section>
              <h3 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
                <AlignLeft className="h-4 w-4 text-orange-500" />
                Deskripsi
              </h3>
              <div className="rounded-xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-900/5">
                {task.description ? (
                  <p className="whitespace-pre-wrap text-[15px] text-slate-700 leading-relaxed">
                    {task.description}
                  </p>
                ) : (
                  <p className="text-sm italic text-slate-400">Belum ada deskripsi.</p>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
                <Calendar className="h-4 w-4 text-blue-500" />
                Jadwal & Waktu
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="rounded-xl bg-white p-5 md:p-6 shadow-sm ring-1 ring-slate-900/5 flex items-start gap-4 transition-shadow hover:shadow-md">
                   <div className="p-2.5 bg-slate-50 rounded-lg shrink-0 border border-slate-100">
                     <Calendar className="h-5 w-5 text-slate-400" />
                   </div>
                   <div>
                     <p className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Dibuat pada</p>
                     <p className="text-sm font-semibold text-slate-900">
                       {format(parseISO(task.createdAt), 'd MMMM yyyy, HH:mm', { locale: localeId })}
                     </p>
                   </div>
                </div>
                <div className="rounded-xl bg-white p-5 md:p-6 shadow-sm ring-1 ring-slate-900/5 flex items-start gap-4 transition-shadow hover:shadow-md">
                   <div className="p-2.5 bg-orange-50 rounded-lg shrink-0 border border-orange-100">
                     <Calendar className="h-5 w-5 text-orange-500" />
                   </div>
                   <div>
                     <p className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Tenggat Waktu</p>
                     <p className="text-sm font-semibold text-slate-900">
                       {task.dueDate ? format(parseISO(task.dueDate), 'd MMMM yyyy', { locale: localeId }) : '-'}
                     </p>
                   </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="flex flex-col items-center justify-center py-16 text-center w-full rounded-xl bg-white border border-slate-200 border-dashed">
            <Activity className="h-8 w-8 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-900">Belum ada aktivitas</p>
            <p className="text-xs text-slate-500 mt-1">Jejak aktivitas task ini akan muncul di sini.</p>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="flex flex-col items-center justify-center py-16 text-center w-full rounded-xl bg-white border border-slate-200 border-dashed">
            <MessageSquare className="h-8 w-8 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-900">Belum ada komentar</p>
            <p className="text-xs text-slate-500 mt-1">Diskusikan task ini dengan tim Anda.</p>
          </div>
        )}
      </div>
      
      {task && (
        <>
          <TaskEditModal
            task={task}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
          />
          <AlertDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={() => {
              deleteTask.mutate(task.id, {
                onSuccess: () => {
                  setIsDeleteDialogOpen(false)
                  navigate('/board')
                }
              })
            }}
            title="Hapus Task"
            description={
              <>
                Apakah Anda yakin ingin menghapus task <strong>{task.title}</strong>? Aksi ini tidak dapat dibatalkan.
              </>
            }
            isLoading={deleteTask.isPending}
          />
        </>
      )}
    </div>
  )
}
