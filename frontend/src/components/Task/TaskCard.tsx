import { Calendar, MoreHorizontal, Clock, AlertCircle, ChevronRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "@/types";
import { Badge, getStatusVariant } from "@/components/Common/Badge";
import { TASK_STATUS_LABELS } from "@/utils/constants";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onMenuClick?: () => void;
  showRoom?: boolean;
  className?: string;
}

export function TaskCard({ task, onClick, onMenuClick, className }: TaskCardProps) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() &&
    task.status !== 'APPROVED' && task.status !== 'REJECTED';

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative rounded-xl border bg-card p-5 cursor-pointer overflow-hidden",
        "transition-all duration-300 ease-out smooth-transition",
        "hover:shadow-elevated hover:border-primary/40 hover:-translate-y-0.5",
        isOverdue && "border-destructive/30 bg-destructive/5",
        className
      )}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Status indicator line */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300",
        task.status === "APPROVED" && "bg-success",
        task.status === "REJECTED" && "bg-destructive",
        task.status === "SUBMITTED" && "bg-primary",
        task.status === "IN_PROGRESS" && "bg-info",
        task.status === "PENDING" && "bg-warning",
      )} />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 pl-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary smooth-transition">
              {task.title}
            </h3>
            {isOverdue && (
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 animate-pulse" />
            )}
          </div>
          {task.description && (
            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant={getStatusVariant(task.status)} size="sm">
            {TASK_STATUS_LABELS[task.status]}
          </Badge>
          {onMenuClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMenuClick();
              }}
              className="rounded-lg p-1.5 text-muted-foreground opacity-0 smooth-transition hover:bg-secondary group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pl-2">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {task.assignee && (
            <div className="flex items-center gap-2 hover-lift">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-xs font-semibold text-primary">
                {task.assignee.name.charAt(0)}
              </div>
              <span className="truncate max-w-[120px] font-medium">{task.assignee.name}</span>
            </div>
          )}
          {task.dueDate && (
            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg smooth-transition",
              isOverdue ? "bg-destructive/10 text-destructive" : "bg-secondary/50"
            )}>
              {isOverdue ? <Clock className="h-3.5 w-3.5" /> : <Calendar className="h-3.5 w-3.5" />}
              <span className="font-medium">
                {new Date(task.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}
          {task.status === "REJECTED" && task.rejectionNote && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive">
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="font-medium text-xs">Has rejection note</span>
            </div>
          )}
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 smooth-transition" />
      </div>
    </div>
  );
}

export function TaskCardCompact({ task, onClick }: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between gap-4 rounded-xl border bg-card p-4",
        "transition-all duration-200 cursor-pointer smooth-transition",
        "hover:shadow-elevated hover:border-primary/20 hover:-translate-y-0.5",
        task.status === "REJECTED" && "border-destructive/30 bg-destructive/5"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-sm font-bold text-primary">
          {task.title.charAt(0)}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary smooth-transition">
            {task.title}
          </h4>
          {task.assignee && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">{task.assignee.name}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {task.status === "REJECTED" && task.rejectionNote && (
          <MessageCircle className="h-4 w-4 text-destructive" title="Has rejection note" />
        )}
        <Badge variant={getStatusVariant(task.status)} size="sm">
          {TASK_STATUS_LABELS[task.status]}
        </Badge>
      </div>
    </div>
  );
}
