import { FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Note } from "./AddNoteDialog";

interface NotesPanelProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

const NotesPanel = ({ notes, onDelete }: NotesPanelProps) => {
  if (notes.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <h2 className="font-display text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        Notes ({notes.length})
      </h2>
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {notes.map((note) => (
          <div key={note.id} className="p-3 rounded-lg bg-muted/50 border border-border space-y-1">
            <div className="flex items-start justify-between">
              <h4 className="text-sm font-medium text-card-foreground">{note.title}</h4>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => onDelete(note.id)}>
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{note.content}</p>
            <p className="text-[10px] text-muted-foreground/60">{note.createdAt.toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesPanel;
