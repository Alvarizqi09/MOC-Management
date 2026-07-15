import { useState, useMemo } from 'react'
import {
  format,
  isSameDay,
  parseISO,
  isSameMonth
} from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { CalendarDays } from 'lucide-react'
import { PRIORITY_CONFIG, type Task } from '@/types/task.types'
import { CalendarView } from './CalendarView'

interface TimelineViewProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export function TimelineView({ tasks, onTaskClick }: TimelineViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const tasksWithDueDate = useMemo(
    () =>
      tasks
        .filter((t) => t.dueDate)
        .sort(
          (a, b) =>
            parseISO(a.dueDate!).getTime() - parseISO(b.dueDate!).getTime(),
        ),
    [tasks],
  )

  const filteredTasks = useMemo(() => {
    return tasksWithDueDate.filter((task) => {
      const date = parseISO(task.dueDate!)
      
      // If a specific day is selected, only show tasks for that day
      if (selectedDay) {
        return isSameDay(date, selectedDay)
      }
      
      // Otherwise, show all tasks in the current month
      return isSameMonth(date, currentDate)
    })
  }, [tasksWithDueDate, currentDate, selectedDay])

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <CalendarView
          currentDate={currentDate}
          onDateChange={(d) => {
            setCurrentDate(d)
            setSelectedDay(null)
          }}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          tasks={tasksWithDueDate}
        />
      </div>
      
      <div className="lg:col-span-3">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <CalendarDays className="mb-3 h-10 w-10 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">
              {selectedDay 
                ? `Tidak ada task pada ${format(selectedDay, 'd MMM yyyy', { locale: localeId })}`
                : 'Tidak ada task di bulan ini'}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Pilih tanggal lain di kalender
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
            <h3 className="mb-6 font-semibold text-slate-700">
              {selectedDay 
                ? `Task pada ${format(selectedDay, 'd MMMM yyyy', { locale: localeId })}`
                : `Task Bulan ${format(currentDate, 'MMMM yyyy', { locale: localeId })}`}
            </h3>
            
            <div className="relative border-l-2 border-orange-200 pl-6 space-y-4">
              {filteredTasks.map((task) => {
                const dueDate = parseISO(task.dueDate!)
                const priority = task.priority
                  ? PRIORITY_CONFIG[task.priority]
                  : null

                return (
                  <div
                    key={task.id}
                    className="relative"
                  >
                    <span className="absolute -left-[31px] top-3 h-3 w-3 rounded-full border-2 border-white bg-gradient-to-br from-red-500 to-orange-400 shadow-sm" />
                    <button
                      type="button"
                      onClick={() => onTaskClick(task)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-left shadow-sm transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-orange-200 hover:bg-white hover:shadow-md"
                    >
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400">
                          {task.ticketId}
                        </span>
                        {priority ? (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${priority.className}`}
                          >
                            {priority.label}
                          </span>
                        ) : null}
                        <span
                          className={`ml-auto text-xs font-medium ${
                            task.status === 'done'
                              ? 'text-emerald-600'
                              : isSameDay(dueDate, new Date())
                                ? 'text-orange-600'
                                : 'text-slate-500'
                          }`}
                        >
                          {format(dueDate, 'EEEE, d MMM', { locale: localeId })}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-slate-900">
                        {task.title}
                      </h4>
                      {task.description ? (
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {task.description}
                        </p>
                      ) : null}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
