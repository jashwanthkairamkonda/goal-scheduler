import { Target, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import Header from "@/components/layout/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import GoalCard from "@/components/dashboard/GoalCard";
import WeeklySchedule from "@/components/dashboard/WeeklySchedule";
import QuickActions from "@/components/dashboard/QuickActions";
import OverallProgress from "@/components/dashboard/OverallProgress";

const sampleGoals = [
  {
    title: "Complete Dissertation Chapter 3",
    description: "Finish writing and reviewing the methodology section with supporting data analysis",
    progress: 65,
    deadline: "Jan 20, 2026",
    category: "Dissertation",
    priority: "high" as const,
    tasks: [
      { id: "1", title: "Draft introduction section", completed: true },
      { id: "2", title: "Complete literature review", completed: true },
      { id: "3", title: "Write methodology framework", completed: false },
      { id: "4", title: "Add data visualizations", completed: false },
      { id: "5", title: "Peer review and revisions", completed: false },
    ],
  },
  {
    title: "Submit Grant Proposal",
    description: "Prepare and submit the research grant application for the upcoming funding cycle",
    progress: 40,
    deadline: "Jan 31, 2026",
    category: "Funding",
    priority: "high" as const,
    tasks: [
      { id: "6", title: "Outline proposal structure", completed: true },
      { id: "7", title: "Draft budget section", completed: true },
      { id: "8", title: "Write project narrative", completed: false },
      { id: "9", title: "Gather supporting documents", completed: false },
    ],
  },
  {
    title: "Publish Research Paper",
    description: "Finalize and submit research paper to peer-reviewed journal",
    progress: 80,
    deadline: "Feb 15, 2026",
    category: "Publication",
    priority: "medium" as const,
    tasks: [
      { id: "10", title: "Complete final draft", completed: true },
      { id: "11", title: "Address reviewer comments", completed: true },
      { id: "12", title: "Format for journal", completed: true },
      { id: "13", title: "Submit and track status", completed: false },
    ],
  },
  {
    title: "Conference Presentation",
    description: "Prepare slides and practice for the upcoming academic conference",
    progress: 25,
    deadline: "Mar 10, 2026",
    category: "Conference",
    priority: "low" as const,
    tasks: [
      { id: "14", title: "Create slide deck", completed: true },
      { id: "15", title: "Add research findings", completed: false },
      { id: "16", title: "Practice presentation", completed: false },
      { id: "17", title: "Prepare Q&A responses", completed: false },
    ],
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Welcome back, Dr. Scholar
          </h1>
          <p className="text-muted-foreground">
            You have 4 active goals and 3 tasks due this week. Let's make progress!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Active Goals"
            value={4}
            subtitle="2 high priority"
            icon={Target}
            trend="neutral"
            className="animate-slide-up"
          />
          <StatsCard
            title="Tasks Completed"
            value={28}
            subtitle="+8 this week"
            icon={CheckCircle2}
            trend="up"
            className="animate-slide-up [animation-delay:100ms]"
          />
          <StatsCard
            title="Hours Logged"
            value="42h"
            subtitle="Avg 6h/day"
            icon={Clock}
            trend="up"
            className="animate-slide-up [animation-delay:200ms]"
          />
          <StatsCard
            title="Productivity"
            value="92%"
            subtitle="+5% vs last week"
            icon={TrendingUp}
            trend="up"
            className="animate-slide-up [animation-delay:300ms]"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Goals Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Your Goals
              </h2>
              <span className="text-sm text-muted-foreground">
                4 goals • 2 high priority
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {sampleGoals.map((goal, index) => (
                <div 
                  key={goal.title} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${(index + 4) * 100}ms` }}
                >
                  <GoalCard {...goal} />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <OverallProgress />
            <QuickActions />
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="mt-8 animate-slide-up [animation-delay:800ms]">
          <WeeklySchedule />
        </div>
      </main>
    </div>
  );
};

export default Index;
