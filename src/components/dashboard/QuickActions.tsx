import { useState } from "react";
import { Target, Calendar, FileText, Focus } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewGoalDialog, { NewGoalData } from "./NewGoalDialog";
import VoiceCommandButton from "./VoiceCommandButton";
import { toast } from "@/hooks/use-toast";

interface QuickActionsProps {
  onNewGoal?: (goal: NewGoalData) => void;
  onStartFocus?: () => void;
}

const QuickActions = ({ onNewGoal, onStartFocus }: QuickActionsProps) => {
  const [isNewGoalOpen, setIsNewGoalOpen] = useState(false);

  const handleNewGoal = (goal: NewGoalData) => {
    onNewGoal?.(goal);
    toast({
      title: "Goal Created",
      description: `"${goal.title}" has been added to your goals.`,
    });
  };

  const handleVoiceGoal = (parsed: {
    title: string;
    description: string;
    deadline: string | null;
    category: string;
    priority: "high" | "medium" | "low";
  }) => {
    onNewGoal?.({
      title: parsed.title,
      description: parsed.description,
      deadline: parsed.deadline ? new Date(parsed.deadline) : undefined,
      category: parsed.category,
      priority: parsed.priority,
    });
  };

  const actions = [
    { icon: Target, label: "New Goal", variant: "accent" as const, onClick: () => setIsNewGoalOpen(true) },
    { icon: Focus, label: "Focus Mode", variant: "default" as const, onClick: () => onStartFocus?.() },
    { icon: Calendar, label: "Schedule Task", variant: "outline" as const, onClick: () => {} },
    { icon: FileText, label: "Add Note", variant: "outline" as const, onClick: () => {} },
  ];

  return (
    <>
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold text-card-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              className="h-auto py-4 flex-col gap-2"
              onClick={action.onClick}
            >
              <action.icon className="h-5 w-5" />
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
          <VoiceCommandButton
            onGoalParsed={handleVoiceGoal}
            onFocusParsed={(data) => onStartFocus?.()}
          />
        </div>
      </div>

      <NewGoalDialog
        open={isNewGoalOpen}
        onOpenChange={setIsNewGoalOpen}
        onSubmit={handleNewGoal}
      />
    </>
  );
};

export default QuickActions;
