import ProgressRing from "./ProgressRing";
import { TrendingUp, Award, Target } from "lucide-react";

interface OverallProgressProps {
  activeGoals: number;
  completedTasks: number;
  totalTasks: number;
  overallProgress: number;
}

const OverallProgress = ({ activeGoals, completedTasks, totalTasks, overallProgress }: OverallProgressProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <h2 className="font-display text-lg font-semibold text-card-foreground mb-6">
        Overall Progress
      </h2>
      
      <div className="flex flex-col items-center space-y-6">
        <ProgressRing progress={overallProgress} size={140} strokeWidth={10} />
        
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm text-card-foreground">Active Goals</span>
            </div>
            <span className="font-semibold text-card-foreground">{activeGoals}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-secondary" />
              <span className="text-sm text-card-foreground">Tasks Done</span>
            </div>
            <span className="font-semibold text-card-foreground">{completedTasks}/{totalTasks}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm text-card-foreground">Completion</span>
            </div>
            <span className="font-semibold text-success">{overallProgress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallProgress;
