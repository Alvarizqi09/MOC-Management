import { useState, useMemo } from 'react'
import {
  format,
  isSameDay,
  parseISO,
  isSameMonth
} from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { CalendarDays, Activity, Pencil, Plus, Trash2 } from 'lucide-react'
import { type Task, type TaskEvent } from '@/types/task.types'
import { CalendarView } from './CalendarView'
import { useClearEvents } from '@/hooks/useTasks'
import { Button } from '@/components/ui/Button'
import { AlertDialog } from '@/components/ui/AlertDialog'

interface TimelineViewProps {
  tasks: Task[]
  events: TaskEvent[]
  onTaskClick: (task: Task) => void
}

export function TimelineView({ tasks, events, onTaskClick }: TimelineViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const clearEvents = useClearEvents()

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        const date = parseISO(event.createdAt)
        if (selectedDay) {
          return isSameDay(date, selectedDay)
        }
        return isSameMonth(date, currentDate)
      })
      .sort((a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime())
  }, [events, currentDate, selectedDay])

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'created':
        return <Plus className="h-4 w-4 text-blue-500" />
      case 'edited':
        return <Pencil className="h-4 w-4 text-slate-500" />
      case 'status_changed':
        return <Activity className="h-4 w-4 text-orange-500" />
      case 'deleted':
        return <Trash2 className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-slate-500" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'created': return 'border-blue-200 text-blue-600'
      case 'edited': return 'border-slate-200 text-slate-600'
      case 'status_changed': return 'border-orange-200 text-orange-600'
      case 'deleted': return 'border-red-200 text-red-600'
      default: return 'border-slate-200 text-slate-600'
    }
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2 lg:sticky lg:top-4">
        <CalendarView
          currentDate={currentDate}
          onDateChange={(d) => {
            setCurrentDate(d)
            setSelectedDay(null)
          }}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          events={events}
        />
      </div>
      
      <div className="lg:col-span-3">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-16 text-center">
            <CalendarDays className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {selectedDay 
                ? `Tidak ada aktivitas pada ${format(selectedDay, 'd MMM yyyy', { locale: localeId })}`
                : 'Tidak ada aktivitas di bulan ini'}
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Pilih tanggal lain di kalender
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="mb-6 flex items-center justify-between p-4 md:p-6 pb-2">
              <h3 className="font-semibold text-slate-700 dark:text-slate-300">
                {selectedDay 
                  ? `Aktivitas pada ${format(selectedDay, 'd MMMM yyyy', { locale: localeId })}`
                  : 'Semua Aktivitas Bulan Ini'}
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {filteredEvents.length} aktivitas
                </span>
                {filteredEvents.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsAlertOpen(true)}
                    disabled={clearEvents.isPending}
                    className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-500 dark:hover:text-red-400 dark:hover:bg-red-950/50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Bersihkan
                  </Button>
                )}
              </div>
            </div>
            
            <div className="p-4 md:p-6 pt-0">
              <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
              {filteredEvents.map((event) => {
                const eventDate = parseISO(event.createdAt)

                return (
                  <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      {getEventIcon(event.type)}
                    </div>
                    
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition-all hover:border-orange-200 dark:hover:border-orange-500/50 hover:shadow-md cursor-pointer" onClick={() => {
                        if (event.type !== 'deleted') {
                          const taskToOpen = tasks.find(t => t.id === event.taskId)
                          if (taskToOpen) onTaskClick(taskToOpen)
                        }
                      }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-semibold ${getEventColor(event.type).split(' ')[1]}`}>
                          {event.type === 'created' ? 'Task Created' : 
                           event.type === 'edited' ? 'Edited' : 
                           event.type === 'status_changed' ? 'Status Changed' : 'Deleted'}
                        </span>
                        <time className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                          {format(eventDate, 'MMM d - hh:mm a', { locale: localeId })}
                        </time>
                      </div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                        {event.details}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {event.taskTitle} <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px] ml-1">({event.ticketId})</span>
                      </div>
                    </div>
                  </div>
                )
              })}
              </div>
            </div>
          </div>
        )}
      </div>
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={() => {
          clearEvents.mutate(undefined, {
            onSuccess: () => setIsAlertOpen(false)
          })
        }}
        title="Bersihkan Log Aktivitas?"
        description="Apakah Anda yakin ingin menghapus semua riwayat aktivitas? Tindakan ini tidak dapat dibatalkan."
        confirmText="Bersihkan"
        cancelText="Batal"
        isLoading={clearEvents.isPending}
      />
    </div>
  )
}
