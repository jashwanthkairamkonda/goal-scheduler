import { useState } from "react";
import { Target, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import Header from "@/components/layout/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import GoalCard from "@/components/dashboard/GoalCard";
import WeeklySchedule from "@/components/dashboard/WeeklySchedule";
import QuickActions from "@/components/dashboard/QuickActions";
import OverallProgress from "@/components/dashboard/OverallProgress";
import EditGoalDialog, { GoalData } from "@/components/dashboard/EditGoalDialog";
import StartFocusDialog from "@/components/dashboard/StartFocusDialog";
import FocusOverlay from "@/components/dashboard/FocusOverlay";
import FocusCompletionDialog from "@/components/dashboard/FocusCompletionDialog";
import FocusSessionsLog from "@/components/dashboard/FocusSessionsLog";
import ScheduleTaskDialog, { ScheduledEvent } from "@/components/dashboard/ScheduleTaskDialog";
import AddNoteDialog, { Note } from "@/components/dashboard/AddNoteDialog";
import NotesPanel from "@/components/dashboard/NotesPanel";
import { useFocusMode } from "@/hooks/useFocusMode";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const initialGoals: GoalData[] = [
  {
    id: "1", title: "Complete Dissertation Chapter 3",
    description: "Finish writing and reviewing the methodology section with supporting data analysis",
    progress: 0, deadline: "Jan 20, 2026", category: "Dissertation", priority: "high",
    tasks: [
      { id: "1", title: "Draft introduction section", completed: false },
      { id: "2", title: "Complete literature review", completed: false },
      { id: "3", title: "Write methodology framework", completed: false },
      { id: "4", title: "Add data visualizations", completed: false },
      { id: "5", title: "Peer review and revisions", completed: false },
    ],
  },
  {
    id: "2", title: "Submit Grant Proposal",
    description: "Prepare and submit the research grant application for the upcoming funding cycle",
    progress: 0, deadline: "Jan 31, 2026", category: "Funding", priority: "high",
    tasks: [
      { id: "6", title: "Outline proposal structure", completed: false },
      { id: "7", title: "Draft budget section", completed: false },
      { id: "8", title: "Write project narrative", completed: false },
      { id: "9", title: "Gather supporting documents", completed: false },
    ],
  },
  {
    id: "3", title: "Publish Research Paper",
    description: "Finalize and submit research paper to peer-reviewed journal",
    progress: 0, deadline: "Feb 15, 2026", category: "Publication", priority: "medium",
    tasks: [
      { id: "10", title: "Complete final draft", completed: false },
      { id: "11", title: "Address reviewer comments", completed: false },
      { id: "12", title: "Format for journal", completed: false },
      { id: "13", title: "Submit and track status", completed: false },
    ],
  },
  {
    id: "4", title: "Conference Presentation",
    description: "Prepare slides and practice for the upcoming academic conference",
    progress: 0, deadline: "Mar 10, 2026", category: "Conference", priority: "low",
    tasks: [
      { id: "14", title: "Create slide deck", completed: false },
      { id: "15", title: "Add research findings", completed: false },
      { id: "16", title: "Practice presentation", completed: false },
      { id: "17", title: "Prepare Q&A responses", completed: false },
    ],
  },
];

const Index = () => {
  const [goals, setGoals] = useState<GoalData[]>(initialGoals);
  const [editingGoal, setEditingGoal] = useState<GoalData | null>(null);
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);
  const [isFocusDialogOpen, setIsFocusDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [scheduledEvents, setScheduledEvents] = useState<ScheduledEvent[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const { toast } = useToast();
  const focus = useFocusMode();

  // Derived stats
  const allTasks = goals.flatMap((g) => g.tasks);
  const completedTaskCount = allTasks.filter((t) => t.completed).length;
  const totalTaskCount = allTasks.length;
  const overallProgress = totalTaskCount > 0 ? Math.round((completedTaskCount / totalTaskCount) * 100) : 0;
  const highPriorityCount = goals.filter((g) => g.priority === "high").length;
  const totalFocusMinutes = focus.sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const focusHours = Math.floor(totalFocusMinutes / 60);
  const focusDisplay = totalFocusMinutes < 60 ? `${totalFocusMinutes}m` : `${focusHours}h ${totalFocusMinutes % 60}m`;

  const handleEdit = (id: string) => {
    const goal = goals.find((g) => g.id === id);
    if (goal) setEditingGoal(goal);
  };

  const handleSaveEdit = (updatedGoal: GoalData) => {
    setGoals((prev) => prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)));
    setEditingGoal(null);
    toast({ title: "Goal updated", description: `"${updatedGoal.title}" has been updated successfully.` });
  };

  const handleDelete = (id: string) => setDeletingGoalId(id);

  const handleToggleTask = (goalId: string, taskId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedTasks = g.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
        const completedCount = updatedTasks.filter((t) => t.completed).length;
        const progress = updatedTasks.length > 0 ? Math.round((completedCount / updatedTasks.length) * 100) : 0;
        return { ...g, tasks: updatedTasks, progress };
      })
    );
  };

  const handleAddTask = (goalId: string, taskTitle: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const newTask = { id: crypto.randomUUID(), title: taskTitle, completed: false };
        const updatedTasks = [...g.tasks, newTask];
        const completedCount = updatedTasks.filter((t) => t.completed).length;
        const progress = updatedTasks.length > 0 ? Math.round((completedCount / updatedTasks.length) * 100) : 0;
        return { ...g, tasks: updatedTasks, progress };
      })
    );
  };

  const confirmDelete = () => {
    if (deletingGoalId) {
      const goal = goals.find((g) => g.id === deletingGoalId);
      setGoals((prev) => prev.filter((g) => g.id !== deletingGoalId));
      setDeletingGoalId(null);
      toast({ title: "Goal deleted", description: goal ? `"${goal.title}" has been deleted.` : "Goal has been deleted.", variant: "destructive" });
    }
  };

  const handleStartFocus = (goalId: string, goalTitle: string, durationMinutes: number) => {
    focus.startFocus(goalId, goalTitle, durationMinutes);
    toast({ title: "Focus Mode Started", description: `Focusing on "${goalTitle}" for ${durationMinutes} minutes.` });
  };

  const handleEndFocus = () => {
    const lastGoalTitle = focus.goalTitle;
    const elapsed = Math.round((focus.totalSeconds - focus.remainingSeconds) / 60);
    focus.endFocus();
    toast({ title: "Focus Mode Ended", description: `You focused on "${lastGoalTitle}" for ${elapsed} minutes.` });
  };

  const handleScheduleEvent = (event: ScheduledEvent) => {
    setScheduledEvents((prev) => [...prev, event]);
    toast({ title: "Task Scheduled", description: `"${event.title}" added to your schedule.` });
  };

  const handleAddNote = (note: Note) => {
    setNotes((prev) => [...prev, note]);
    toast({ title: "Note Added", description: `"${note.title}" has been saved.` });
  };

  const lastSession = focus.sessions[focus.sessions.length - 1];
  const showCompletionDialog = focus.justCompleted && !showCompletion;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {focus.isActive && (
        <FocusOverlay
          goalTitle={focus.goalTitle}
          remainingSeconds={focus.remainingSeconds}
          totalSeconds={focus.totalSeconds}
          onEnd={handleEndFocus}
        />
      )}

      <main className="container py-8">
        {/* Welcome */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Welcome back, Dr. Scholar</h1>
          <p className="text-muted-foreground">
            You have {goals.length} active goals and {totalTaskCount - completedTaskCount} tasks remaining. Let's make progress!
          </p>
        </div>

        {/* Stats */}
        <div id="stats-section" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard title="Active Goals" value={goals.length} subtitle={`${highPriorityCount} high priority`} icon={Target} trend="neutral" className="animate-slide-up" />
          <StatsCard title="Tasks Completed" value={completedTaskCount} subtitle={`of ${totalTaskCount} total`} icon={CheckCircle2} trend={completedTaskCount > 0 ? "up" : "neutral"} className="animate-slide-up [animation-delay:100ms]" />
          <StatsCard title="Focus Time" value={focusDisplay} subtitle={`${focus.sessions.length} sessions`} icon={Clock} trend={focus.sessions.length > 0 ? "up" : "neutral"} className="animate-slide-up [animation-delay:200ms]" />
          <StatsCard title="Productivity" value={`${overallProgress}%`} subtitle="overall completion" icon={TrendingUp} trend={overallProgress > 0 ? "up" : "neutral"} className="animate-slide-up [animation-delay:300ms]" />
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div id="goals-section" className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-foreground">Your Goals</h2>
              <span className="text-sm text-muted-foreground">{goals.length} goals • {highPriorityCount} high priority</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {goals.map((goal, index) => (
                <div key={goal.id} className="animate-slide-up" style={{ animationDelay: `${(index + 4) * 100}ms` }}>
                  <GoalCard {...goal} onEdit={handleEdit} onDelete={handleDelete} onToggleTask={handleToggleTask} onAddTask={handleAddTask} />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <OverallProgress
              activeGoals={goals.length}
              completedTasks={completedTaskCount}
              totalTasks={totalTaskCount}
              overallProgress={overallProgress}
            />
            <QuickActions
              onNewGoal={(goal) => {
                const newGoal: GoalData = {
                  id: crypto.randomUUID(),
                  title: goal.title,
                  description: goal.description,
                  progress: 0,
                  deadline: goal.deadline ? goal.deadline.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No deadline",
                  category: goal.category || "Other",
                  priority: goal.priority,
                  tasks: [],
                };
                setGoals((prev) => [...prev, newGoal]);
              }}
              onStartFocus={() => setIsFocusDialogOpen(true)}
              onScheduleTask={() => setIsScheduleDialogOpen(true)}
              onAddNote={() => setIsNoteDialogOpen(true)}
            />
            <FocusSessionsLog sessions={focus.sessions} />
            <NotesPanel notes={notes} onDelete={(id) => setNotes((prev) => prev.filter((n) => n.id !== id))} />
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="mt-8 animate-slide-up [animation-delay:800ms]">
          <WeeklySchedule extraEvents={scheduledEvents} onAddEvent={() => setIsScheduleDialogOpen(true)} />
        </div>
      </main>

      {/* Dialogs */}
      <StartFocusDialog open={isFocusDialogOpen} onOpenChange={setIsFocusDialogOpen} goals={goals.map((g) => ({ id: g.id, title: g.title }))} onStart={handleStartFocus} />
      <ScheduleTaskDialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen} onSubmit={handleScheduleEvent} />
      <AddNoteDialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen} goals={goals.map((g) => ({ id: g.id, title: g.title }))} onSubmit={handleAddNote} />

      {showCompletionDialog && lastSession && (
        <FocusCompletionDialog open onOpenChange={() => setShowCompletion(true)} goalTitle={lastSession.goalTitle} durationMinutes={lastSession.durationMinutes} />
      )}

      {editingGoal && (
        <EditGoalDialog goal={editingGoal} open={!!editingGoal} onOpenChange={(open) => !open && setEditingGoal(null)} onSave={handleSaveEdit} />
      )}

      <AlertDialog open={!!deletingGoalId} onOpenChange={(open) => !open && setDeletingGoalId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the goal and all its associated tasks.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
