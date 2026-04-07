import { useState } from "react";
import { Focus, Clock, Target } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface GoalOption {
  id: string;
  title: string;
}

interface StartFocusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goals: GoalOption[];
  onStart: (goalId: string, goalTitle: string, durationMinutes: number) => void;
}

const PRESET_DURATIONS = [15, 25, 30, 45, 60, 90, 120];

const StartFocusDialog = ({ open, onOpenChange, goals, onStart }: StartFocusDialogProps) => {
  const [selectedGoalId, setSelectedGoalId] = useState("");
  const [duration, setDuration] = useState(25);
  const [useCustom, setUseCustom] = useState(false);

  const handleStart = () => {
    const goal = goals.find((g) => g.id === selectedGoalId);
    if (!goal) return;
    onStart(goal.id, goal.title, duration);
    onOpenChange(false);
    setSelectedGoalId("");
    setDuration(25);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Focus className="h-5 w-5 text-accent" />
            Start Focus Mode
          </DialogTitle>
          <DialogDescription>
            Choose a goal to focus on and set your timer duration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Goal Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              Select Goal
            </Label>
            <Select value={selectedGoalId} onValueChange={setSelectedGoalId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a goal to focus on..." />
              </SelectTrigger>
              <SelectContent>
                {goals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Duration: {duration} minutes
            </Label>

            {!useCustom ? (
              <div className="flex flex-wrap gap-2">
                {PRESET_DURATIONS.map((d) => (
                  <Button
                    key={d}
                    variant={duration === d ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDuration(d)}
                  >
                    {d}m
                  </Button>
                ))}
                <Button variant="ghost" size="sm" onClick={() => setUseCustom(true)}>
                  Custom
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Slider
                  value={[duration]}
                  onValueChange={([v]) => setDuration(v)}
                  min={5}
                  max={180}
                  step={5}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5 min</span>
                  <span>3 hours</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setUseCustom(false)}>
                  Presets
                </Button>
              </div>
            )}
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleStart}
            disabled={!selectedGoalId}
          >
            <Focus className="mr-2 h-4 w-4" />
            Start Focus — {duration} min
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartFocusDialog;
