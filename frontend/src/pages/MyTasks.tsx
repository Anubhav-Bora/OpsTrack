import * as React from "react";
import { Search, Filter } from "lucide-react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Layout/Header";
import { TaskList } from "@/components/Task/TaskList";
import { TaskModal } from "@/components/Task/TaskModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToastNotification } from "@/components/Common/Toast";
import { MOCK_TASKS } from "@/data/mockData";
import { Task, TaskStatus } from "@/types";
import { TASK_STATUS_LABELS } from "@/utils/constants";

export default function MyTasks() {
  const { user } = useAuth();
  const { addToast } = useToastNotification();

  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<TaskStatus | "ALL">("ALL");

  // Load user's tasks
  React.useEffect(() => {
    const loadTasks = async () => {
      await new Promise((r) => setTimeout(r, 500));
      // Filter tasks assigned to current user
      const userTasks = MOCK_TASKS.filter((t) => t.assigneeId === user?.id);
      setTasks(userTasks);
      setIsLoading(false);
    };
    loadTasks();

    // Polling
    const interval = setInterval(loadTasks, 5000);
    return () => clearInterval(interval);
  }, [user?.id]);

  // Filter tasks
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  const handleStatusChange = (taskId: string, status: TaskStatus, note?: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updates: Partial<Task> = {
            status,
            updatedAt: new Date().toISOString(),
          };
          if (status === "SUBMITTED") updates.submittedAt = new Date().toISOString();
          if (status === "IN_PROGRESS") {
            // Clear rejection if resubmitting
            updates.rejectedAt = undefined;
            updates.rejectionNote = undefined;
          }
          return { ...task, ...updates };
        }
        return task;
      })
    );

    setSelectedTask(null);
    addToast("success", "Task updated", `Task status changed to ${TASK_STATUS_LABELS[status]}.`);
  };

  // Quick action buttons for task cards
  const handleQuickSubmit = (task: Task) => {
    handleStatusChange(task.id, "SUBMITTED");
  };

  const handleQuickStart = (task: Task) => {
    handleStatusChange(task.id, "IN_PROGRESS");
  };

  const statuses: (TaskStatus | "ALL")[] = [
    "ALL",
    "PENDING",
    "IN_PROGRESS",
    "SUBMITTED",
    "APPROVED",
    "REJECTED",
  ];

  // Task counts by status
  const statusCounts = React.useMemo(() => {
    return {
      all: tasks.length,
      pending: tasks.filter((t) => t.status === "PENDING").length,
      inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      submitted: tasks.filter((t) => t.status === "SUBMITTED").length,
      approved: tasks.filter((t) => t.status === "APPROVED").length,
      rejected: tasks.filter((t) => t.status === "REJECTED").length,
    };
  }, [tasks]);

  return (
    <Layout>
      <Header
        title="My Tasks"
        description="Tasks assigned to you across all rooms"
      />

      <div className="p-6 space-y-6">
        {/* Status Summary */}
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "All", count: statusCounts.all, filter: "ALL" as const },
            { label: "Pending", count: statusCounts.pending, filter: "PENDING" as const },
            { label: "In Progress", count: statusCounts.inProgress, filter: "IN_PROGRESS" as const },
            { label: "Submitted", count: statusCounts.submitted, filter: "SUBMITTED" as const },
            { label: "Approved", count: statusCounts.approved, filter: "APPROVED" as const },
            { label: "Rejected", count: statusCounts.rejected, filter: "REJECTED" as const },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setStatusFilter(item.filter)}
              className={`rounded-lg border p-4 text-left transition-all ${
                statusFilter === item.filter
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/50"
              }`}
            >
              <p className="text-2xl font-semibold text-foreground">{item.count}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your tasks..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Tasks List with Actions */}
        <div className="space-y-3">
          {isLoading ? (
            <TaskList tasks={[]} isLoading />
          ) : filteredTasks.length === 0 ? (
            <TaskList
              tasks={[]}
              emptyMessage="No tasks found"
              emptyDescription={
                searchQuery || statusFilter !== "ALL"
                  ? "Try adjusting your filters."
                  : "You don't have any tasks assigned yet."
              }
            />
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-lg border bg-card p-4 shadow-card transition-all hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <h3 className="font-medium text-foreground hover:text-primary transition-colors">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="capitalize">
                        Status: {TASK_STATUS_LABELS[task.status]}
                      </span>
                      {task.dueDate && (
                        <span>
                          Due:{" "}
                          {new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2">
                    {task.status === "PENDING" && (
                      <Button size="sm" variant="outline" onClick={() => handleQuickStart(task)}>
                        Start
                      </Button>
                    )}
                    {(task.status === "PENDING" ||
                      task.status === "IN_PROGRESS" ||
                      task.status === "REJECTED") && (
                      <Button size="sm" onClick={() => handleQuickSubmit(task)}>
                        Submit
                      </Button>
                    )}
                    {task.status === "SUBMITTED" && (
                      <span className="text-sm text-muted-foreground">Awaiting approval</span>
                    )}
                    {task.status === "APPROVED" && (
                      <span className="text-sm text-success">✓ Completed</span>
                    )}
                  </div>
                </div>

                {/* Rejection note */}
                {task.status === "REJECTED" && task.rejectionNote && (
                  <div className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                    <p className="text-sm font-medium text-destructive">Rejection Note:</p>
                    <p className="text-sm text-muted-foreground">{task.rejectionNote}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </Layout>
  );
}
