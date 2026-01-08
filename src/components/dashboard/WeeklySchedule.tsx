import { cn } from "@/lib/utils";

interface ScheduleEvent {
  id: string;
  title: string;
  time: string;
  category: string;
  color: "primary" | "accent" | "success" | "muted";
}

interface DaySchedule {
  day: string;
  date: number;
  isToday?: boolean;
  events: ScheduleEvent[];
}

const colorStyles = {
  primary: "bg-primary/10 border-primary/30 text-primary",
  accent: "bg-secondary/20 border-secondary/40 text-secondary-foreground",
  success: "bg-success/10 border-success/30 text-success",
  muted: "bg-muted border-border text-muted-foreground",
};

const weekData: DaySchedule[] = [
  {
    day: "Mon",
    date: 6,
    events: [
      { id: "1", title: "Literature Review", time: "9:00 AM", category: "Research", color: "primary" },
      { id: "2", title: "Team Meeting", time: "2:00 PM", category: "Meeting", color: "accent" },
    ],
  },
  {
    day: "Tue",
    date: 7,
    isToday: true,
    events: [
      { id: "3", title: "Data Analysis", time: "10:00 AM", category: "Research", color: "primary" },
      { id: "4", title: "Write Chapter 3", time: "3:00 PM", category: "Writing", color: "success" },
    ],
  },
  {
    day: "Wed",
    date: 8,
    events: [
      { id: "5", title: "Supervisor Meeting", time: "11:00 AM", category: "Meeting", color: "accent" },
    ],
  },
  {
    day: "Thu",
    date: 9,
    events: [
      { id: "6", title: "Peer Review", time: "9:00 AM", category: "Review", color: "muted" },
      { id: "7", title: "Grant Proposal", time: "2:00 PM", category: "Writing", color: "success" },
    ],
  },
  {
    day: "Fri",
    date: 10,
    events: [
      { id: "8", title: "Lab Work", time: "10:00 AM", category: "Research", color: "primary" },
    ],
  },
  {
    day: "Sat",
    date: 11,
    events: [],
  },
  {
    day: "Sun",
    date: 12,
    events: [
      { id: "9", title: "Weekly Planning", time: "6:00 PM", category: "Planning", color: "muted" },
    ],
  },
];

const WeeklySchedule = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-card-foreground">
          Weekly Schedule
        </h2>
        <span className="text-sm text-muted-foreground">January 2026</span>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekData.map((day) => (
          <div key={day.day} className="space-y-2">
            {/* Day Header */}
            <div className={cn(
              "text-center py-2 rounded-lg transition-colors",
              day.isToday ? "gradient-hero text-primary-foreground" : "bg-muted"
            )}>
              <p className="text-xs font-medium uppercase tracking-wider opacity-80">
                {day.day}
              </p>
              <p className="text-lg font-semibold">{day.date}</p>
            </div>

            {/* Events */}
            <div className="space-y-1.5 min-h-[120px]">
              {day.events.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    "p-2 rounded-md border text-xs cursor-pointer transition-all hover:scale-[1.02]",
                    colorStyles[event.color]
                  )}
                >
                  <p className="font-medium line-clamp-1">{event.title}</p>
                  <p className="opacity-70 mt-0.5">{event.time}</p>
                </div>
              ))}
              {day.events.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Free</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklySchedule;
