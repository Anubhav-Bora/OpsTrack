import * as React from "react";
import { X, Calendar, User as UserIcon, Clock, FileText } from "lucide-react";
import { Task, TaskStatus, RoomMember } from "@/types";
import { Badge, getStatusVariant, getRoleVariant } from "@/components/Common/Badge";
import { TASK_STATUS_LABELS, ROLE_LABELS } from "@/utils/constants";
import { useAuth, isAdminOrLeaderInRoom } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { TaskDependencies } from "./TaskDependencies";

interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (taskId: string, status: TaskStatus, note?: string) => void;
  onAssign?: (taskId: string, userId: string) => void;
  roomMembers?: RoomMember[];
  allTasks?: Task[];
}

export function TaskModal({ task, isOpen, onClose, onStatusChange, roomMembers, allTasks = [] }: TaskModalProps) {
  const { user } = useAuth();
  const [rejectionNote, setRejectionNote] = React.useState("");
  const [showRejectForm, setShowRejectForm] = React.useState(false);

  // Get room members from props
  const members = roomMembers || [];

  // Check if user is admin/leader in this task's room
  const canApproveInRoom = user ? isAdminOrLeaderInRoom(user.id, members) : false;

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isAssignedToMe = task.assigneeId === user?.id;
  const canSubmit = isAssignedToMe && (task.status === "PENDING" || task.status === "IN_PROGRESS" || task.status === "REJECTED");
  const canApprove = canApproveInRoom && task.status === "SUBMITTED";
  const canStartProgress = isAssignedToMe && task.status === "PENDING";

  const handleReject = () => {
    if (onStatusChange && rejectionNote.trim()) {
      onStatusChange(task.id, "REJECTED", rejectionNote);
      setShowRejectForm(false);
      setRejectionNote("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 rounded-xl bg-card border shadow-elevated animate-scale-in max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b p-6">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant={getStatusVariant(task.status)}>
                {TASK_STATUS_LABELS[task.status]}
              </Badge>
              {task.dueDate && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Due {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <h2 className="text-xl font-semibold text-foreground">{task.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Description
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {task.description || "No description provided."}
            </p>
          </div>

          {/* Assignee */}
          {task.assignee && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Assignee
              </h3>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  {task.assignee.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{task.assignee.name}</p>
                  <p className="text-sm text-muted-foreground">{task.assignee.email}</p>
                </div>
                <Badge variant={getRoleVariant(task.assignee.role)} className="ml-auto">
                  {ROLE_LABELS[task.assignee.role]}
                </Badge>
              </div>
            </div>
          )}

          {/* Task Dependencies Component */}
          <TaskDependencies
            task={task}
            availableTasks={allTasks}
            isEditable={canApproveInRoom}
          />

          {/* Rejection note */}
          {task.status === "REJECTED" && task.rejectionNote && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <h3 className="text-sm font-medium text-destructive mb-1">Rejection Note</h3>
              <p className="text-sm text-muted-foreground">{task.rejectionNote}</p>
            </div>
          )}

          {/* Reject form */}
          {showRejectForm && (
            <div className="rounded-lg border p-4 space-y-3">
              <h3 className="text-sm font-medium text-foreground">Rejection Note</h3>
              <textarea
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowRejectForm(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={!rejectionNote.trim()}
                >
                  Confirm Rejection
                </Button>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Activity
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Created on {new Date(task.createdAt).toLocaleDateString()}
              </p>
              {task.submittedAt && (
                <p className="text-muted-foreground">
                  Submitted on {new Date(task.submittedAt).toLocaleDateString()}
                </p>
              )}
              {task.approvedAt && (
                <p className="text-success">
                  Approved on {new Date(task.approvedAt).toLocaleDateString()}
                </p>
              )}
              {task.rejectedAt && (
                <p className="text-destructive">
                  Rejected on {new Date(task.rejectedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {onStatusChange && (
          <div className="border-t p-4 bg-secondary/30">
            <div className="flex justify-end gap-3">
              {canStartProgress && (
                <Button
                  variant="outline"
                  onClick={() => onStatusChange(task.id, "IN_PROGRESS")}
                >
                  Start Progress
                </Button>
              )}
              {canSubmit && (
                <Button onClick={() => onStatusChange(task.id, "SUBMITTED")}>
                  Submit for Approval
                </Button>
              )}
              {canApprove && !showRejectForm && (
                <>
                  <Button
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setShowRejectForm(true)}
                  >
                    Reject
                  </Button>
                  <Button
                    className="bg-success hover:bg-success/90"
                    onClick={() => onStatusChange(task.id, "APPROVED")}
                  >
                    Approve
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
