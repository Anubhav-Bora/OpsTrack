import * as React from "react";
import { X, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserWithStats } from "@/types";

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
      <div className="relative w-full max-w-3xl mx-4 rounded-xl bg-card border shadow-elevated max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
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
            placeholder="Search users..."
            className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "No users match your search" : "No users available"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                      User
                    </th>
                    <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                      Tasks
                    </th>
                    <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                      Done
                    </th>
                    <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <UserTableRow key={user.id} user={user} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-muted/30 flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            {filteredUsers.length} of {users.length} members
          </p>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function UserTableRow({ user }: { user: UserWithStats }) {
  const completionRate = user.stats.totalTasks > 0
    ? Math.round((user.stats.completedTasks / user.stats.totalTasks) * 100)
    : 0;

  return (
    <tr className="border-b hover:bg-muted/30 transition-colors">
      {/* User Info */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground text-sm truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
      </td>

      {/* Tasks */}
      <td className="px-4 py-4 text-center">
        <span className="font-medium text-sm">{user.stats.totalTasks}</span>
      </td>

      {/* Completed */}
      <td className="px-4 py-4 text-center">
        <span className="inline-flex items-center gap-1.5 font-medium text-sm">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          {user.stats.completedTasks}
        </span>
      </td>

      {/* Progress Bar */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-emerald-600 dark:bg-emerald-400 transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <span className="text-xs font-medium text-muted-foreground min-w-[2rem]">
            {completionRate}%
          </span>
        </div>
      </td>
    </tr>
  );
}
