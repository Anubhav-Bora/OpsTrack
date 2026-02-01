import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { TaskStatus, UserRole } from "@/types";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary border border-primary/20",
        secondary: "bg-secondary text-secondary-foreground border border-border",
        destructive: "bg-destructive/10 text-destructive border border-destructive/20",
        success: "bg-success/10 text-success border border-success/20",
        warning: "bg-warning/10 text-warning border border-warning/20",
        info: "bg-info/10 text-info border border-info/20",
        outline: "text-foreground border border-border",
        // Status variants
        pending: "bg-status-pending-bg text-status-pending border border-status-pending/20",
        "in-progress": "bg-status-in-progress-bg text-status-in-progress border border-status-in-progress/20",
        submitted: "bg-status-submitted-bg text-status-submitted border border-status-submitted/20",
        approved: "bg-status-approved-bg text-status-approved border border-status-approved/20",
        rejected: "bg-status-rejected-bg text-status-rejected border border-status-rejected/20",
        // Role variants
        admin: "bg-destructive/10 text-destructive border border-destructive/20",
        leader: "bg-primary/10 text-primary border border-primary/20",
        member: "bg-secondary text-secondary-foreground border border-border",
      },
      size: {
        default: "text-xs px-2.5 py-0.5",
        sm: "text-2xs px-2 py-0.5",
        lg: "text-sm px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

// Helper function to get badge variant from task status
function getStatusVariant(status: TaskStatus): VariantProps<typeof badgeVariants>["variant"] {
  const statusMap: Record<TaskStatus, VariantProps<typeof badgeVariants>["variant"]> = {
    PENDING: "pending",
    IN_PROGRESS: "in-progress",
    SUBMITTED: "submitted",
    APPROVED: "approved",
    REJECTED: "rejected",
  };
  return statusMap[status];
}

// Helper function to get badge variant from user role
function getRoleVariant(role: UserRole): VariantProps<typeof badgeVariants>["variant"] {
  const roleMap: Record<UserRole, VariantProps<typeof badgeVariants>["variant"]> = {
    ADMIN: "admin",
    LEADER: "leader",
    MEMBER: "member",
  };
  return roleMap[role];
}

export { Badge, badgeVariants, getStatusVariant, getRoleVariant };
