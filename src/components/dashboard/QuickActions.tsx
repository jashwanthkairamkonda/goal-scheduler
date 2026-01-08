import { Plus, Target, Calendar, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const QuickActions = () => {
  const actions = [
    { icon: Target, label: "New Goal", variant: "accent" as const },
    { icon: Calendar, label: "Schedule Task", variant: "default" as const },
    { icon: FileText, label: "Add Note", variant: "outline" as const },
    { icon: Clock, label: "Start Timer", variant: "outline" as const },
  ];

  return (
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
          >
            <action.icon className="h-5 w-5" />
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
