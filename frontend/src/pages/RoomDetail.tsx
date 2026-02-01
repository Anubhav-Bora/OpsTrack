import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Users, ListTodo, BarChart3, Search, Filter } from "lucide-react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Layout/Header";
import { TaskList } from "@/components/Task/TaskList";
import { TaskModal } from "@/components/Task/TaskModal";
import { TaskForm } from "@/components/Task/TaskForm";
import { MembersList } from "@/components/Room/MembersList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, useRoomRole } from "@/contexts/AuthContext";
import { useToastNotification } from "@/components/Common/Toast";
import { Room, Task, RoomMember, TaskStatus, CreateTaskInput } from "@/types";
import { TASK_STATUS_LABELS } from "@/utils/constants";

export default function RoomDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToastNotification();

  const [room, setRoom] = useState<Room | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");

  // Get room-specific permissions
  const { isRoomAdminOrLeader, isRoomAdmin } = useRoomRole(members);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      await new Promise((r) => setTimeout(r, 500));

      // TODO: Fetch room data from API
      navigate("/dashboard");
      addToast("error", "Room not found", "The room you're looking for doesn't exist.");
      return;
    };
    loadData();
  }, [roomId, navigate, addToast]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
          if (status === "APPROVED") updates.approvedAt = new Date().toISOString();
          if (status === "REJECTED") {
            updates.rejectedAt = new Date().toISOString();
            updates.rejectionNote = note;
          }
          return { ...task, ...updates };
        }
        return task;
      })
    );

    setSelectedTask(null);
    addToast("success", "Task updated", `Task status changed to ${TASK_STATUS_LABELS[status]}.`);
  };

  const handleCreateTask = async (data: CreateTaskInput) => {
    setIsCreatingTask(true);
    try {
      await new Promise((r) => setTimeout(r, 500));

      const assignee = data.assigneeId
        ? MOCK_USERS.find((u) => u.id === data.assigneeId)
        : undefined;

      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: data.title,
        description: data.description,
        status: "PENDING",
        assigneeId: data.assigneeId,
        assignee,
        roomId: roomId || "",
        dueDate: data.dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setTasks((prev) => [newTask, ...prev]);
      setShowCreateTask(false);
      addToast("success", "Task created", `"${data.title}" has been created.`);
    } catch (error) {
      addToast("error", "Failed to create task", "Please try again.");
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handlePromoteMember = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: "LEADER" } : m))
    );
    addToast("success", "Member promoted", "Member has been promoted to Leader.");
  };

  const handleDemoteMember = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: "MEMBER" } : m))
    );
    addToast("success", "Member demoted", "Leader has been demoted to Member.");
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    addToast("success", "Member removed", "Member has been removed from the room.");
  };

  if (isLoading || !room) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/3 bg-muted rounded" />
            <div className="h-4 w-1/4 bg-muted rounded" />
          </div>
        </div>
      </Layout>
    );
  }

  const statuses: (TaskStatus | "ALL")[] = ["ALL", "PENDING", "IN_PROGRESS", "SUBMITTED", "APPROVED", "REJECTED"];
  const memberUsers = members.map((m) => m.user);

  return (
    <Layout>
      <Header
        title={room.name}
        description={room.description}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: room.name },
        ]}
        actions={
          isRoomAdminOrLeader && (
            <Button onClick={() => setShowCreateTask(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          )
        }
      />

      <div className="p-6">
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tasks" className="gap-2">
              <ListTodo className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="members" className="gap-2">
              <Users className="h-4 w-4" />
              Members ({members.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "ALL")}
                  className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "ALL" ? "All Status" : TASK_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Task List */}
            <TaskList
              tasks={filteredTasks}
              onTaskClick={setSelectedTask}
              emptyMessage="No tasks found"
              emptyDescription={
                searchQuery || statusFilter !== "ALL"
                  ? "Try adjusting your filters."
                  : "Create your first task to get started."
              }
            />
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members">
            <MembersList
              members={members}
              onPromote={isRoomAdmin ? handlePromoteMember : undefined}
              onDemote={isRoomAdmin ? handleDemoteMember : undefined}
              onRemove={isRoomAdmin ? handleRemoveMember : undefined}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Total Tasks", value: tasks.length, color: "text-primary" },
                { label: "Pending", value: tasks.filter((t) => t.status === "PENDING").length, color: "text-warning" },
                { label: "In Progress", value: tasks.filter((t) => t.status === "IN_PROGRESS").length, color: "text-info" },
                { label: "Completed", value: tasks.filter((t) => t.status === "APPROVED").length, color: "text-success" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border bg-card p-6">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`mt-1 text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Progress breakdown */}
            <div className="mt-6 rounded-xl border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Task Distribution</h3>
              <div className="space-y-3">
                {statuses.filter((s) => s !== "ALL").map((status) => {
                  const count = tasks.filter((t) => t.status === status).length;
                  const percentage = tasks.length > 0 ? (count / tasks.length) * 100 : 0;
                  return (
                    <div key={status} className="flex items-center gap-4">
                      <span className="w-24 text-sm text-muted-foreground">
                        {TASK_STATUS_LABELS[status]}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-12 text-sm font-medium text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
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

      {/* Create Task Modal */}
      <TaskForm
        isOpen={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        onSubmit={handleCreateTask}
        members={memberUsers}
        isLoading={isCreatingTask}
      />
    </Layout>
  );
}
