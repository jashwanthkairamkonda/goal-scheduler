import { Focus, X, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FocusOverlayProps {
  goalTitle: string;
  remainingSeconds: number;
  totalSeconds: number;
  onEnd: () => void;
}

const FocusOverlay = ({ goalTitle, remainingSeconds, totalSeconds, onEnd }: FocusOverlayProps) => {
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md animate-fade-in">
      {/* Subtle animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Stay Focused message */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Focus className="h-5 w-5 text-accent" />
          <span className="text-sm font-medium uppercase tracking-widest">Stay Focused</span>
        </div>

        {/* Circular timer */}
        <div className="relative flex items-center justify-center">
          <svg width="280" height="280" className="-rotate-90">
            <circle
              cx="140"
              cy="140"
              r="120"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="6"
            />
            <circle
              cx="140"
              cy="140"
              r="120"
              fill="none"
              stroke="hsl(var(--accent))"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-display text-5xl font-bold text-foreground tabular-nums">
              {hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`}
            </span>
            <span className="text-sm text-muted-foreground mt-1">remaining</span>
          </div>
        </div>

        {/* Current goal */}
        <div className="text-center space-y-1 max-w-md">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Currently working on</p>
          <h2 className="font-display text-xl font-semibold text-foreground">{goalTitle}</h2>
        </div>

        {/* Progress bar */}
        <div className="w-64 space-y-1">
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-center text-muted-foreground">{Math.round(progress)}% complete</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4">
          <Button variant="outline" size="sm" onClick={onEnd} className="gap-2">
            <X className="h-4 w-4" />
            End Focus Mode
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FocusOverlay;
