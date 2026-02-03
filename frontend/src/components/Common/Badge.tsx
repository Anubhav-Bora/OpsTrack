import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { TaskStatus, UserRole, RoomRole } from "@/types";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary/15 text-primary border border-primary/30 hover:bg-primary/20",
        secondary: "bg-secondary text-secondary-foreground border border-border",
        destructive: "bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/20",
        success: "bg-success/15 text-success border border-success/30 hover:bg-success/20",
        warning: "bg-warning/15 text-warning border border-warning/30 hover:bg-warning/20",
        info: "bg-info/15 text-info border border-info/30 hover:bg-info/20",
        outline: "text-foreground border border-border",
        // Status variants - Modern gradient style
        pending: "bg-gradient-to-r from-warning/20 to-warning/10 text-warning border border-warning/30 font-semibold",
        "in-progress": "bg-gradient-to-r from-info/20 to-info/10 text-info border border-info/30 font-semibold",
        submitted: "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/30 font-semibold",
        approved: "bg-gradient-to-r from-success/20 to-success/10 text-success border border-success/30 font-semibold",
        rejected: "bg-gradient-to-r from-destructive/20 to-destructive/10 text-destructive border border-destructive/30 font-semibold",
        // Role variants
        admin: "bg-destructive/15 text-destructive border border-destructive/30",
        leader: "bg-primary/15 text-primary border border-primary/30",
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
  VariantProps<typeof badgeVariants> { }

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
    BLOCKED: "warning",
  };
  return statusMap[status];
}

// Helper function to get badge variant from user role
function getRoleVariant(role: UserRole): VariantProps<typeof badgeVariants>["variant"] {
  const roleMap: Record<UserRole, VariantProps<typeof badgeVariants>["variant"]> = {
    ADMIN: "admin",
    BACKEND: "default",
    FRONTEND: "info",
    DEVOPS: "warning",
    CYBERSECURITY: "destructive",
  };
  return roleMap[role];
}

// Helper function to get badge variant from room role
function getRoomRoleVariant(role: RoomRole): VariantProps<typeof badgeVariants>["variant"] {
  const roleMap: Record<RoomRole, VariantProps<typeof badgeVariants>["variant"]> = {
    ADMIN: "admin",
    LEADER: "leader",
    MEMBER: "member",
  };
  return roleMap[role];
}

export { Badge, badgeVariants, getStatusVariant, getRoleVariant, getRoomRoleVariant };
