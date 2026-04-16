import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ScheduleEvent {
  id: string;
  title: string;
  time: string;
  category: string;
  color: "primary" | "accent" | "success" | "muted";
}

export interface DaySchedule {
  day: string;
  date: number;
  fullDate: Date;
  isToday?: boolean;
  events: ScheduleEvent[];
}

const colorStyles = {
  primary: "bg-primary/10 border-primary/30 text-primary",
  accent: "bg-secondary/20 border-secondary/40 text-secondary-foreground",
  success: "bg-success/10 border-success/30 text-success",
  muted: "bg-muted border-border text-muted-foreground",
};

const categoryColorMap: Record<string, "primary" | "accent" | "success" | "muted"> = {
  Research: "primary",
  Writing: "success",
  Meeting: "accent",
  Review: "muted",
  Planning: "muted",
  Teaching: "accent",
  Other: "muted",
};

interface WeeklyScheduleProps {
  extraEvents?: { id: string; title: string; date: Date; time: string; category: string }[];
  onAddEvent?: () => void;
}

function getWeekDays(): DaySchedule[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  const days: DaySchedule[] = [];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push({
      day: dayNames[i],
      date: d.getDate(),
      fullDate: new Date(d),
      isToday: d.toDateString() === today.toDateString(),
      events: [],
    });
  }
  return days;
}

const WeeklySchedule = ({ extraEvents = [], onAddEvent }: WeeklyScheduleProps) => {
  const weekDays = getWeekDays();

  // Merge extra events into the week
  extraEvents.forEach((ev) => {
    const evDate = new Date(ev.date);
    const day = weekDays.find((d) => d.fullDate.toDateString() === evDate.toDateString());
    if (day) {
      day.events.push({
        id: ev.id,
        title: ev.title,
        time: ev.time,
        category: ev.category,
        color: categoryColorMap[ev.category] || "muted",
      });
    }
  });

  const monthName = weekDays[0].fullDate.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <div id="schedule-section" className="rounded-xl border border-border bg-card p-6 shadow-card">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-card-foreground">
          Weekly Schedule
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{monthName}</span>
          {onAddEvent && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={onAddEvent}>
              <Plus className="h-3.5 w-3.5" />
              Add
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div key={day.day} className="space-y-2">
            <div className={cn(
              "text-center py-2 rounded-lg transition-colors",
              day.isToday ? "gradient-hero text-primary-foreground" : "bg-muted"
            )}>
              <p className="text-xs font-medium uppercase tracking-wider opacity-80">{day.day}</p>
              <p className="text-lg font-semibold">{day.date}</p>
            </div>

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
