import { useState, useMemo, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Search } from "lucide-react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Layout/Header";
import { TaskModal } from "@/components/Task/TaskModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge, getStatusVariant } from "@/components/Common/Badge";
import { EmptyState } from "@/components/Common/EmptyState";
import { useToastNotification } from "@/components/Common/Toast";
import { useAuth, isAdminOrLeaderInRoom } from "@/contexts/AuthContext";
import { Task, TaskStatus } from "@/types";
import { TASK_STATUS_LABELS } from "@/utils/constants";

export default function Approvals() {
  const { user } = useAuth();
  const { addToast } = useToastNotification();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load submitted tasks only from rooms where user is admin/leader
  useEffect(() => {
    const loadTasks = async () => {
      await new Promise((r) => setTimeout(r, 500));

      if (!user) {
        setTasks([]);
        setIsLoading(false);
        return;
      }

      // TODO: Fetch tasks that need approval from API
      setTasks([]);
      setIsLoading(false);
    };
    loadTasks();

    // Polling
    const interval = setInterval(loadTasks, 5000);
    return () => clearInterval(interval);
  }, [user]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignee?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const handleStatusChange = (taskId: string, status: TaskStatus, note?: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setSelectedTask(null);

    if (status === "APPROVED") {
      addToast("success", "Task approved", "The task has been approved successfully.");
    } else if (status === "REJECTED") {
      addToast("info", "Task rejected", "The task has been sent back for revision.");
    }
  };

  const handleQuickApprove = (task: Task) => {
    handleStatusChange(task.id, "APPROVED");
  };

  const handleQuickReject = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <Layout>
      <Header
        title="Approvals"
        description="Review and approve submitted tasks"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-warning/10 p-3">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{tasks.length}</p>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by task or assignee..."
            className="pl-10"
          />
        </div>

        {/* Approvals List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-lg border bg-card p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-5 w-1/3 bg-muted rounded" />
                  <div className="h-4 w-2/3 bg-muted rounded" />
                  <div className="h-4 w-1/4 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            icon={CheckCircle}
            title="All caught up!"
            description={
              searchQuery
                ? "No tasks match your search."
                : "There are no tasks waiting for your approval."
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border bg-card p-6 shadow-card transition-all hover:shadow-soft"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Task info */}
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={getStatusVariant(task.status)}>
                        {TASK_STATUS_LABELS[task.status]}
                      </Badge>
                      {task.submittedAt && (
                        <span className="text-sm text-muted-foreground">
                          Submitted{" "}
                          {new Date(task.submittedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    {task.assignee && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-2xs font-medium text-primary-foreground">
                          {task.assignee.name.charAt(0)}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {task.assignee.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          • {MOCK_ROOMS.find((r) => r.id === task.roomId)?.name || "Unknown Room"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                    <Button
                      onClick={() => handleQuickApprove(task)}
                      className="bg-success hover:bg-success/90"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleQuickReject(task)}
                      className="text-destructive hover:text-destructive"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Modal for rejection with note */}
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
