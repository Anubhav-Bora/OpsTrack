import * as React from "react";
import { X, Users, CheckCircle, Clock, AlertTriangle, XCircle, Send, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, getRoleVariant } from "@/components/Common/Badge";
import { UserWithStats } from "@/types";
import { ROLE_LABELS } from "@/utils/constants";
import { cn } from "@/lib/utils";

interface UserStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserWithStats[];
  isLoading?: boolean;
  title: string;
  subtitle?: string;
}

export function UserStatsModal({ isOpen, onClose, users, isLoading, title, subtitle }: UserStatsModalProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter users based on search
  const filteredUsers = React.useMemo(() => {
    if (!searchQuery) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm pointer-events-auto" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4 rounded-xl bg-card border shadow-elevated animate-scale-in max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{title}</h2>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email, or role..."
            className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-lg border bg-card p-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/3 bg-muted rounded" />
                      <div className="h-3 w-1/4 bg-muted rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground">No users found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try adjusting your search." : "No users available."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <UserStatsCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-secondary/30">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {users.length} users
            </p>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserStatsCard({ user }: { user: UserWithStats }) {
  const stats = [
    { label: "Total", value: user.stats.totalTasks, icon: ListTodo, color: "text-foreground" },
    { label: "Pending", value: user.stats.pendingTasks, icon: Clock, color: "text-warning" },
    { label: "In Progress", value: user.stats.inProgressTasks, icon: AlertTriangle, color: "text-info" },
    { label: "Submitted", value: user.stats.submittedTasks, icon: Send, color: "text-primary" },
    { label: "Completed", value: user.stats.completedTasks, icon: CheckCircle, color: "text-success" },
    { label: "Rejected", value: user.stats.rejectedTasks, icon: XCircle, color: "text-destructive" },
  ];

  const completionRate = user.stats.totalTasks > 0
    ? Math.round((user.stats.completedTasks / user.stats.totalTasks) * 100)
    : 0;

  return (
    <div className="rounded-xl border bg-card p-4 transition-all hover:shadow-soft">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* User Info */}
        <div className="flex items-center gap-4 lg:w-1/3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-lg font-bold text-primary">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">{user.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{user.email || "No email"}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getRoleVariant(user.role)} size="sm">
                {ROLE_LABELS[user.role] || user.role}
              </Badge>
              {user.roomRole && (
                <Badge variant={user.roomRole === "LEADER" || user.roomRole === "ADMIN" ? "warning" : "default"} size="sm">
                  {user.roomRole}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 grid grid-cols-3 lg:grid-cols-6 gap-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center p-2 rounded-lg bg-secondary/50"
            >
              <stat.icon className={cn("h-4 w-4 mb-1", stat.color)} />
              <span className="text-lg font-semibold text-foreground">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Completion Rate */}
        <div className="lg:w-24 flex flex-col items-center justify-center p-3 rounded-lg bg-success/10">
          <span className="text-2xl font-bold text-success">{completionRate}%</span>
          <span className="text-xs text-muted-foreground">Completed</span>
        </div>
      </div>

      {/* Rooms (for admin view) */}
      {user.rooms && user.rooms.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-muted-foreground mb-2">Rooms:</p>
          <div className="flex flex-wrap gap-2">
            {user.rooms.map((room) => (
              <span
                key={room.id}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-xs"
              >
                {room.name}
                <Badge variant={room.role === "LEADER" || room.role === "ADMIN" ? "warning" : "default"} size="sm">
                  {room.role}
                </Badge>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
