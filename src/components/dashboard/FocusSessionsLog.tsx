import { Clock, Target, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { FocusSession } from "@/hooks/useFocusMode";

interface FocusSessionsLogProps {
  sessions: FocusSession[];
}

const FocusSessionsLog = ({ sessions }: FocusSessionsLogProps) => {
  const recentSessions = [...sessions].reverse().slice(0, 5);

  if (recentSessions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold text-card-foreground mb-3">
          Focus Sessions
        </h2>
        <p className="text-sm text-muted-foreground">No focus sessions yet. Start one to see your history!</p>
      </div>
    );
  }

  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const completedCount = sessions.filter((s) => s.completed).length;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <h2 className="font-display text-lg font-semibold text-card-foreground mb-1">
        Focus Sessions
      </h2>
      <p className="text-xs text-muted-foreground mb-4">
        {totalMinutes} min total · {completedCount}/{sessions.length} completed
      </p>

      <div className="space-y-3">
        {recentSessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center gap-3 rounded-lg border border-border p-3"
          >
            {session.completed ? (
              <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground truncate">
                {session.goalTitle}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{session.durationMinutes} min</span>
                <span>·</span>
                <span>
                  {new Date(session.startTime).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
            <Badge variant={session.completed ? "secondary" : "outline"} className="text-xs">
              {session.completed ? "Done" : "Ended"}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FocusSessionsLog;
