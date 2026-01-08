import { Calendar, Clock, CheckCircle2, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface GoalCardProps {
  title: string;
  description: string;
  progress: number;
  deadline: string;
  category: string;
  tasks: Task[];
  priority: "high" | "medium" | "low";
}

const priorityStyles = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-secondary/20 text-secondary-foreground border-secondary/30",
  low: "bg-muted text-muted-foreground border-border",
};

const GoalCard = ({ title, description, progress, deadline, category, tasks, priority }: GoalCardProps) => {
  const completedTasks = tasks.filter(t => t.completed).length;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-elevated animate-fade-in">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-semibold text-card-foreground line-clamp-1">
                {title}
              </h3>
              <Badge variant="outline" className={cn("text-xs", priorityStyles[priority])}>
                {priority}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-card-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Tasks Preview */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Tasks ({completedTasks}/{tasks.length})
          </p>
          <div className="space-y-1.5">
            {tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-center gap-2 text-sm">
                {task.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
                <span className={cn(
                  "line-clamp-1",
                  task.completed && "text-muted-foreground line-through"
                )}>
                  {task.title}
                </span>
              </div>
            ))}
            {tasks.length > 3 && (
              <p className="text-xs text-muted-foreground pl-6">
                +{tasks.length - 3} more tasks
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{deadline}</span>
          </div>
        </div>
      </div>

      {/* Hover accent */}
      <div className="absolute top-0 left-0 h-full w-1 gradient-accent opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
};

export default GoalCard;
