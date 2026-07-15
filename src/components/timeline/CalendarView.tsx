import { useMemo } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  parseISO
} from "date-fns"
import { id as localeId } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { type TaskEvent } from "@/types/task.types"

const WEEKDAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]

const EVENT_COLORS: Record<string, string> = {
  created: "bg-blue-500",
  edited: "bg-slate-400",
  status_changed: "bg-orange-500",
  deleted: "bg-red-500",
}

interface CalendarViewProps {
  currentDate: Date
  onDateChange: (date: Date) => void
  selectedDay: Date | null
  onSelectDay: (day: Date | null) => void
  events: TaskEvent[]
}

export function CalendarView({
  currentDate,
  onDateChange,
  selectedDay,
  onSelectDay,
  events,
}: CalendarViewProps) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDayOfWeek = getDay(monthStart)

  const eventsByDay = useMemo(() => {
    const map = new Map<string, TaskEvent[]>()
    for (const event of events) {
      if (!event.createdAt) continue
      const date = parseISO(event.createdAt)
      const key = format(date, "yyyy-MM-dd")
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(event)
    }
    return map
  }, [events])

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          onClick={() => onDateChange(subMonths(currentDate, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="font-semibold text-slate-700">
          {format(currentDate, "MMMM yyyy", { locale: localeId })}
        </h3>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          onClick={() => onDateChange(addMonths(currentDate, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="py-1 text-center text-xs font-medium text-slate-400"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-10" />
        ))}
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd")
          const dayEvents = eventsByDay.get(key) ?? []
          const isSelected = selectedDay && isSameDay(day, selectedDay)
          const today = isToday(day)

          const uniqueEventTypes = [...new Set(dayEvents.map((e) => e.type))]

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDay(isSelected ? null : day)} // toggle selection
              className={`
                relative flex h-10 flex-col items-center justify-center gap-0.5 rounded-lg text-xs font-medium transition-all
                ${
                  isSelected
                    ? "bg-orange-100 text-orange-700 ring-1 ring-orange-400"
                    : today
                      ? "bg-orange-50 text-orange-600 ring-1 ring-orange-200"
                      : "text-slate-600 hover:bg-slate-50"
                }
              `}
            >
              <span>{format(day, "d")}</span>
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5">
                  {uniqueEventTypes.slice(0, 3).map((type) => (
                    <span
                      key={type}
                      className={`h-1.5 w-1.5 rounded-full ${EVENT_COLORS[type] || EVENT_COLORS.edited}`}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
