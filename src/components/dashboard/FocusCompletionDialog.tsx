import { CheckCircle2, Clock, Target } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FocusCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalTitle: string;
  durationMinutes: number;
}

const FocusCompletionDialog = ({ open, onOpenChange, goalTitle, durationMinutes }: FocusCompletionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm text-center">
        <DialogHeader className="items-center">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <DialogTitle className="font-display text-xl">Focus Session Complete!</DialogTitle>
          <DialogDescription>Great work staying focused. Keep up the momentum!</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>{goalTitle}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{durationMinutes} min</span>
            </div>
          </div>
        </div>

        <Button className="w-full" onClick={() => onOpenChange(false)}>
          Done
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FocusCompletionDialog;
