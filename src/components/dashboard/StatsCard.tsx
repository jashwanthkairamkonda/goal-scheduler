import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

const StatsCard = ({ title, value, subtitle, icon: Icon, trend, className }: StatsCardProps) => {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-elevated",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold tracking-tight text-card-foreground">{value}</p>
          {subtitle && (
            <p className={cn(
              "text-sm",
              trend === "up" && "text-success",
              trend === "down" && "text-destructive",
              !trend && "text-muted-foreground"
            )}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-1 w-full gradient-accent opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
};

export default StatsCard;
