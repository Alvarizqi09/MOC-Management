import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { ArrowLeft, Calendar, Activity, AlignLeft, MessageSquare } from 'lucide-react'
import { useTask } from '@/hooks/useTasks'
import { PRIORITY_CONFIG } from '@/types/task.types'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'

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
  
  const [activeTab, setActiveTab] = useState<TabId>('info')

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
      <div className="border-b border-slate-100 px-6 py-6 pb-0">
        <div className="flex items-start gap-4 mb-6">
          <button
            onClick={() => navigate('/board')}
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="font-mono text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {task.ticketId}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                {status.label}
              </span>
              {priority && (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priority.className}`}>
                  {priority.label}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight break-words">
              {task.title}
            </h1>
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
      <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
        {activeTab === 'info' && (
          <div className="max-w-3xl space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
              <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                <AlignLeft className="h-4 w-4 text-slate-400" />
                Deskripsi
              </h3>
              {task.description ? (
                <p className="whitespace-pre-wrap text-sm text-slate-600 leading-relaxed">
                  {task.description}
                </p>
              ) : (
                <p className="text-sm italic text-slate-400">Belum ada deskripsi.</p>
              )}
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
              <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                Jadwal & Waktu
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-400 mb-1">Dibuat pada</p>
                  <p className="text-sm text-slate-900">
                    {format(parseISO(task.createdAt), 'd MMMM yyyy, HH:mm', { locale: localeId })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 mb-1">Tenggat Waktu (Due Date)</p>
                  <p className="text-sm text-slate-900">
                    {task.dueDate ? format(parseISO(task.dueDate), 'd MMMM yyyy', { locale: localeId }) : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="flex flex-col items-center justify-center py-16 text-center max-w-3xl rounded-xl bg-white border border-slate-200 border-dashed">
            <Activity className="h-8 w-8 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-900">Belum ada aktivitas</p>
            <p className="text-xs text-slate-500 mt-1">Jejak aktivitas task ini akan muncul di sini.</p>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="flex flex-col items-center justify-center py-16 text-center max-w-3xl rounded-xl bg-white border border-slate-200 border-dashed">
            <MessageSquare className="h-8 w-8 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-900">Belum ada komentar</p>
            <p className="text-xs text-slate-500 mt-1">Diskusikan task ini dengan tim Anda.</p>
          </div>
        )}
      </div>
    </div>
  )
}
