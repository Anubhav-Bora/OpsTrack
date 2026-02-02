import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Users, ListTodo, BarChart3, Search, Filter, Trash2, AlertTriangle } from "lucide-react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Layout/Header";
import { TaskList } from "@/components/Task/TaskList";
import { TaskModal } from "@/components/Task/TaskModal";
import { TaskForm } from "@/components/Task/TaskForm";
import { MembersList } from "@/components/Room/MembersList";
import { AddMemberModal } from "@/components/Room/AddMemberModal";
import { ConfirmDialog } from "@/components/Common/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, useRoomRole } from "@/contexts/AuthContext";
import { useToastNotification } from "@/components/Common/Toast";
import { useRoomDetail, useRoomTasks, useRoomMembers } from "@/hooks/useRoomDetail";
import { useCreateTask, useApproveTask, useRejectTask, useEditTask, useDeleteTask } from "@/hooks/useTasks";
import { useUpdateMemberRole, useRemoveMember } from "@/hooks/useMemberManagement";
import { useAddMember, useAllUsers } from "@/hooks/useAddMember";
import { useDeleteRoom } from "@/hooks/useRooms";
import { Room, Task, RoomMember, TaskStatus, CreateTaskInput } from "@/types";
import { TASK_STATUS_LABELS } from "@/utils/constants";

export default function RoomDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToastNotification();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch data
  const { data: room, isLoading: roomLoading } = useRoomDetail(Number(roomId));
  const { data: tasks = [], isLoading: tasksLoading } = useRoomTasks(Number(roomId));
  const { data: members = [] } = useRoomMembers(Number(roomId));
  const { data: allUsers = [] } = useAllUsers();
  const { mutate: createTask, isPending: isCreatingTask } = useCreateTask();
  const { mutate: approveTask } = useApproveTask();
  const { mutate: rejectTask } = useRejectTask();
  const { mutate: editTask } = useEditTask();
  const { mutate: deleteTask } = useDeleteTask();
  const { mutate: deleteRoom, isPending: isDeletingRoom } = useDeleteRoom();
  const { mutate: updateMemberRole } = useUpdateMemberRole();
  const { mutate: removeMember } = useRemoveMember();
  const { mutate: addMember, isPending: isAddingMember } = useAddMember();

  // Get room-specific permissions
  const { isRoomAdminOrLeader, isRoomAdmin } = useRoomRole(members);

  // Allow global admins or room admins to manage members
  const canManageMembers = user?.role === "ADMIN" || isRoomAdmin;

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
    if (status === "APPROVED") {
      approveTask({ taskId, roomId: room?.id || "" }, {
        onSuccess: () => {
          setSelectedTask(null);
          addToast("success", "Task approved", "Task has been approved successfully.");
        },
        onError: (error) => {
          addToast("error", "Failed to approve", error instanceof Error ? error.message : "Please try again.");
        },
      });
    } else if (status === "REJECTED") {
      rejectTask({ taskId, roomId: room?.id || "", rejectionNote: note }, {
        onSuccess: () => {
          setSelectedTask(null);
          addToast("success", "Task rejected", "Task has been sent back for revision.");
        },
        onError: (error) => {
          addToast("error", "Failed to reject", error instanceof Error ? error.message : "Please try again.");
        },
      });
    }
  };

  const handleEditTask = (taskId: string, title: string, description?: string, requiredRole?: string, dueDate?: string, assigneeId?: string) => {
    editTask({ taskId, title, description, requiredRole, dueDate, roomId: room?.id || "", assigneeId }, {
      onSuccess: () => {
        setSelectedTask(null);
        addToast("success", "Task updated", "Task has been updated successfully.");
      },
      onError: (error) => {
        addToast("error", "Failed to update task", error instanceof Error ? error.message : "Please try again.");
      },
    });
  };

  const handleCreateTask = (data: CreateTaskInput) => {
    createTask({ ...data, roomId: room?.id || "" }, {
      onSuccess: () => {
        setShowCreateTask(false);
        addToast("success", "Task created", `"${data.title}" has been created.`);
      },
      onError: (error) => {
        addToast("error", "Failed to create task", error instanceof Error ? error.message : "Please try again.");
      },
    });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask({ taskId, roomId: room?.id || "" }, {
      onSuccess: () => {
        setSelectedTask(null);
        addToast("success", "Task deleted", "Task has been deleted successfully.");
      },
      onError: (error) => {
        addToast("error", "Failed to delete task", error instanceof Error ? error.message : "Please try again.");
      },
    });
  };

  const handlePromoteMember = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    updateMemberRole({ userId: member.userId, roomId: room?.id || "", role: "LEADER" }, {
      onSuccess: () => {
        addToast("success", "Member promoted", "Member has been promoted to Leader.");
      },
      onError: (error) => {
        addToast("error", "Failed to promote", error instanceof Error ? error.message : "Please try again.");
      },
    });
  };

  const handleDemoteMember = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    updateMemberRole({ userId: member.userId, roomId: room?.id || "", role: "MEMBER" }, {
      onSuccess: () => {
        addToast("success", "Member demoted", "Leader has been demoted to Member.");
      },
      onError: (error) => {
        addToast("error", "Failed to demote", error instanceof Error ? error.message : "Please try again.");
      },
    });
  };

  const handleAddMembers = (userIds: string[]) => {
    const roomIdStr = room?.id.toString() || "";
    userIds.forEach((userId) => {
      addMember({ userId, roomId: roomIdStr }, {
        onSuccess: () => {
          addToast("success", "Member added", "Member has been added to the room.");
        },
        onError: (error) => {
          addToast("error", "Failed to add member", error instanceof Error ? error.message : "Please try again.");
        },
      });
    });
  };

  const handleRemoveMember = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    removeMember({ userId: member.userId, roomId: room?.id || "" }, {
      onSuccess: () => {
        addToast("success", "Member removed", "Member has been removed from the room.");
      },
      onError: (error) => {
        addToast("error", "Failed to remove", error instanceof Error ? error.message : "Please try again.");
      },
    });
  };

  const handleDeleteRoom = () => {
    if (!room) return;
    deleteRoom(room.id.toString(), {
      onSuccess: () => {
        addToast("success", "Room deleted", "Room has been deleted successfully.");
        navigate("/dashboard");
      },
      onError: (error) => {
        addToast("error", "Failed to delete room", error instanceof Error ? error.message : "Please try again.");
        setShowDeleteConfirm(false);
      },
    });
  };

  if (roomLoading || !room) {
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
          <div className="flex items-center gap-3">
            {(isRoomAdminOrLeader || user?.role === "ADMIN") && (
              <Button onClick={() => setShowCreateTask(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            )}
            {(isRoomAdminOrLeader || user?.role === "ADMIN") && (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Room
              </Button>
            )}
          </div>
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
          <TabsContent value="members" className="space-y-4">
            {canManageMembers && (
              <div className="flex justify-end">
                <Button onClick={() => setShowAddMember(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>
            )}
            <MembersList
              members={members}
              onPromote={canManageMembers ? handlePromoteMember : undefined}
              onDemote={canManageMembers ? handleDemoteMember : undefined}
              onRemove={canManageMembers ? handleRemoveMember : undefined}
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
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          roomMembers={members}
          allTasks={tasks}
          canEdit={user?.role === "ADMIN" || isRoomAdminOrLeader}
        />
      )}

      {/* Create Task Modal */}
      <TaskForm
        isOpen={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        onSubmit={handleCreateTask}
        members={memberUsers}
        isLoading={isCreatingTask}
        availableTasks={tasks}
      />

      {/* Add Member Modal */}
      <AddMemberModal
        open={showAddMember}
        onOpenChange={setShowAddMember}
        availableUsers={allUsers}
        currentMembers={members.map(m => m.userId)}
        isLoading={isAddingMember}
        onAddMembers={handleAddMembers}
      />

      {/* Delete Room Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteRoom}
        title="Delete Room?"
        description={`Are you sure you want to delete "${room?.name}"? This action cannot be undone and all tasks will be deleted.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        isLoading={isDeletingRoom}
      />
    </Layout>
  );
}
