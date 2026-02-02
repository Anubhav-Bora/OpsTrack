import * as React from "react";
import { X, Calendar, User as UserIcon, Clock, FileText, Edit2 } from "lucide-react";
import { Task, TaskStatus, RoomMember } from "@/types";
import { Badge, getStatusVariant, getRoleVariant } from "@/components/Common/Badge";
import { TASK_STATUS_LABELS, ROLE_LABELS } from "@/utils/constants";
import { useAuth, isAdminOrLeaderInRoom } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { TaskDependencies } from "./TaskDependencies";
import { EditTaskModal } from "./EditTaskModal";
import { RejectionDialog } from "./RejectionDialog";

interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (taskId: string, status: TaskStatus, note?: string) => void;
  onAssign?: (taskId: string, userId: string) => void;
  onEdit?: (taskId: string, title: string, description?: string, requiredRole?: string, dueDate?: string, assigneeId?: string) => void;
  onDelete?: (taskId: string) => void;
  roomMembers?: RoomMember[];
  allTasks?: Task[];
  canEdit?: boolean;
}

export function TaskModal({ task, isOpen, onClose, onStatusChange, onEdit, onDelete, roomMembers, allTasks = [], canEdit: canEditProp = false }: TaskModalProps) {
  const { user } = useAuth();
  const [showRejectionDialog, setShowRejectionDialog] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  // Get room members from props
  const members = roomMembers || [];

  // Check if user is admin/leader in this task's room (fallback calculation)
  const canApproveInRoom = user ? isAdminOrLeaderInRoom(user.id, members) : false;
  // Use passed prop if available, otherwise calculate from members
  const canEdit = canEditProp || canApproveInRoom;

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

  const handleReject = (rejectionNote: string) => {
    if (onStatusChange) {
      onStatusChange(task.id, "REJECTED", rejectionNote || undefined);
      setShowRejectionDialog(false);
    }
  };

  const handleEditSave = (title: string, description?: string, requiredRole?: string, dueDate?: string, assigneeId?: string) => {
    if (onEdit) {
      onEdit(task.id, title, description, requiredRole, dueDate, assigneeId);
      setShowEditModal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm pointer-events-auto" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 rounded-xl bg-card border shadow-elevated animate-scale-in max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto">
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
          <div className="flex items-center gap-2">
            {canEdit && (
              <button
                onClick={() => setShowEditModal(true)}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                title="Edit task"
              >
                <Edit2 className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
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
        <div className="border-t p-4 bg-secondary/30 flex justify-between items-center gap-3">
          <div>
            {canEdit && onDelete && (
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Task
              </Button>
            )}
          </div>
          <div className="flex justify-end gap-3">
            {canStartProgress && onStatusChange && (
              <Button
                variant="outline"
                onClick={() => onStatusChange?.(task.id, "IN_PROGRESS")}
              >
                Start Progress
              </Button>
            )}
            {canSubmit && onStatusChange && (
              <Button onClick={() => onStatusChange?.(task.id, "SUBMITTED")}>
                Submit for Approval
              </Button>
            )}
            {canApprove && (
              <>
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setShowRejectionDialog(true)}
                >
                  Reject
                </Button>
                {onStatusChange && (
                  <Button
                    className="bg-success hover:bg-success/90"
                    onClick={() => onStatusChange?.(task.id, "APPROVED")}
                  >
                    Approve
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Task Modal */}
      <EditTaskModal
        task={task}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditSave}
        roomMembers={members}
      />

      {/* Rejection Dialog */}
      <RejectionDialog
        isOpen={showRejectionDialog}
        onClose={() => setShowRejectionDialog(false)}
        onConfirm={handleReject}
        taskTitle={task.title}
      />

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm pointer-events-auto" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-card rounded-lg border p-6 shadow-elevated max-w-sm mx-4 pointer-events-auto">
            <h3 className="text-lg font-semibold text-foreground mb-2">Delete Task</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDeleteConfirm(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete?.(task.id);
                  setShowDeleteConfirm(false);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
