import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface GoalData {
  id: string;
  title: string;
  description: string;
  deadline: string;
  category: string;
  priority: "high" | "medium" | "low";
  progress: number;
  tasks: Task[];
}

interface EditGoalDialogProps {
  goal: GoalData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (goal: GoalData) => void;
}

const categories = [
  "Dissertation",
  "Publication",
  "Funding",
  "Conference",
  "Teaching",
  "Research",
  "Other",
];

const EditGoalDialog = ({ goal, open, onOpenChange, onSave }: EditGoalDialogProps) => {
  const [title, setTitle] = useState(goal.title);
  const [description, setDescription] = useState(goal.description);
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [category, setCategory] = useState(goal.category);
  const [priority, setPriority] = useState<"high" | "medium" | "low">(goal.priority);

  useEffect(() => {
    setTitle(goal.title);
    setDescription(goal.description);
    setCategory(goal.category);
    setPriority(goal.priority);
    // Parse the deadline string to Date
    const parsedDate = new Date(goal.deadline);
    setDeadline(isNaN(parsedDate.getTime()) ? undefined : parsedDate);
  }, [goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !deadline || !category) {
      return;
    }

    onSave({
      ...goal,
      title,
      description,
      deadline: format(deadline, "MMM d, yyyy"),
      category,
      priority,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Edit Goal</DialogTitle>
          <DialogDescription>
            Update your academic goal details below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              placeholder="e.g., Complete Dissertation Chapter 3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              placeholder="Describe your goal in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !deadline && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "MMM d, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <RadioGroup
              value={priority}
              onValueChange={(value: "high" | "medium" | "low") => setPriority(value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="edit-high" />
                <Label htmlFor="edit-high" className="text-destructive font-medium cursor-pointer">
                  High
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="edit-medium" />
                <Label htmlFor="edit-medium" className="text-secondary-foreground font-medium cursor-pointer">
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="edit-low" />
                <Label htmlFor="edit-low" className="text-muted-foreground font-medium cursor-pointer">
                  Low
                </Label>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditGoalDialog;
