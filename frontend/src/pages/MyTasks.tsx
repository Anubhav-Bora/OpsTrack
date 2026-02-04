import { useState, useMemo } from "react";
import { Search, Link2 } from "lucide-react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Layout/Header";
import { TaskList } from "@/components/Task/TaskList";
import { TaskModal } from "@/components/Task/TaskModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToastNotification } from "@/components/Common/Toast";
import { useMyTasks } from "@/hooks/useMyTasks";
import { useUpdateTaskStatus, useSubmitTask } from "@/hooks/useTaskStatus";
import { useTaskDependencies } from "@/hooks/useTaskDependencies";
import { useTasks } from "@/hooks/useTasks";
import { Task, TaskStatus } from "@/types";
import { TASK_STATUS_LABELS } from "@/utils/constants";

// Helper component to show task dependencies info
function TaskDependencyDisplay({ task, allTasks }: { task: Task; allTasks: Task[] }) {
  const { data: dependencies = [] } = useTaskDependencies(task.id);
  
  if (dependencies.length === 0) return null;

  const incompleteDeps = dependencies.filter(dep => {
    const depTask = allTasks?.find(t => t.id === String(dep.dependsOnTaskId));
    return depTask?.status !== "APPROVED";
  });

  // Get dependency task names
  const depTaskNames = incompleteDeps.map(dep => {
    const depTask = allTasks?.find(t => t.id === String(dep.dependsOnTaskId));
    return depTask?.title || `Task ${dep.dependsOnTaskId}`;
  });

  if (incompleteDeps.length === 0) {
    return (
      <div className="flex items-center gap-1.5 text-success text-xs">
        <Link2 className="h-3.5 w-3.5" />
        <span>Dependencies complete</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-warning text-xs">
      <Link2 className="h-3.5 w-3.5" />
      <span className="truncate" title={`Blocked by: ${depTaskNames.join(', ')}`}>
        Blocked by: {depTaskNames.slice(0, 2).join(', ')}{depTaskNames.length > 2 ? ` +${depTaskNames.length - 2} more` : ''}
      </span>
    </div>
  );
}

// Helper component to check if task can be started
function TaskStartButton({ task, allTasks, onStart }: { 
  task: Task; 
  allTasks: Task[];
  onStart: (task: Task) => void; 
}) {
  const { data: dependencies = [] } = useTaskDependencies(task.id);
  
  const allDependenciesCompleted = dependencies.length === 0 || dependencies.every(dep => {
    const depTask = allTasks?.find(t => t.id === String(dep.dependsOnTaskId));
    return depTask?.status === "APPROVED";
  });

  return (
    <Button 
      size="sm" 
      variant="outline"
      onClick={() => onStart(task)}
      disabled={!allDependenciesCompleted}
      title={!allDependenciesCompleted ? "Cannot start: pending dependencies must be approved first" : "Start working on this task"}
    >
      Start
    </Button>
  );
}

// Helper component to check if task can be submitted
function TaskSubmitButton({ task, allTasks, onSubmit }: { 
  task: Task; 
  allTasks: Task[];
  onSubmit: (task: Task) => void; 
}) {
  const { data: dependencies = [] } = useTaskDependencies(task.id);
  
  const allDependenciesCompleted = dependencies.length === 0 || dependencies.every(dep => {
    const depTask = allTasks?.find(t => t.id === String(dep.dependsOnTaskId));
    return depTask?.status === "APPROVED";
  });

  const canSubmit = allDependenciesCompleted;

  return (
    <Button 
      size="sm" 
      onClick={() => onSubmit(task)}
      disabled={!canSubmit}
      title={!canSubmit ? "Cannot submit: pending dependencies must be approved first" : "Submit for approval"}
    >
      Submit
    </Button>
  );
}

export default function MyTasks() {
  const { addToast } = useToastNotification();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");

  // Load user's tasks and all tasks for dependency checking
  const { data: tasks = [], isLoading } = useMyTasks();
  const { data: allTasks = [] } = useTasks();
  const { mutate: updateStatus } = useUpdateTaskStatus();
  const { mutate: submitTask } = useSubmitTask();

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateStatus({ taskId, status }, {
      onSuccess: () => {
        setSelectedTask(null);
        addToast("success", "Task updated", `Task status changed to ${TASK_STATUS_LABELS[status]}.`);
      },
      onError: (error) => {
        addToast("error", "Failed to update task", error instanceof Error ? error.message : "Please try again.");
      },
    });
  };

  // Quick action buttons for task cards
  const handleQuickSubmit = (task: Task) => {
    submitTask({ taskId: task.id }, {
      onSuccess: () => {
        addToast("success", "Task submitted", "Task has been submitted for approval.");
      },
      onError: (error) => {
        addToast("error", "Failed to submit task", error instanceof Error ? error.message : "Please try again.");
      },
    });
  };

  const handleQuickStart = (task: Task) => {
    handleStatusChange(task.id, "IN_PROGRESS");
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  // Task counts by status
  const statusCounts = useMemo(() => {
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
              className={`rounded-lg border p-4 text-left transition-all ${statusFilter === item.filter
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
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                      <TaskDependencyDisplay task={task} allTasks={allTasks} />
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2">
                    {task.status === "PENDING" && (
                      <TaskStartButton 
                        task={task}
                        allTasks={allTasks}
                        onStart={handleQuickStart}
                      />
                    )}
                    {(task.status === "PENDING" ||
                      task.status === "IN_PROGRESS" ||
                      task.status === "REJECTED") && (
                        <TaskSubmitButton 
                          task={task}
                          allTasks={allTasks}
                          onSubmit={handleQuickSubmit}
                        />
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
          allTasks={allTasks}
        />
      )}
    </Layout>
  );
}
