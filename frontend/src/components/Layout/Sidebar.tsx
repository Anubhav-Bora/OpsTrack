import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  CheckSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Badge, getRoleVariant } from "@/components/Common/Badge";
import { ROLE_LABELS } from "@/utils/constants";
import { useSubmittedTasks } from "@/hooks/useApprovals";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: ListTodo, label: "My Tasks", path: "/my-tasks" },
  { icon: CheckSquare, label: "Approvals", path: "/approvals", requiresApprovalAccess: true },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { data: submittedTasks = [] } = useSubmittedTasks();

  const hasApprovalAccess = React.useMemo(() => {
    if (!user) return false;
    // User has approval access if they are ADMIN
    return user.role === "ADMIN";
  }, [user]);

  const filteredNavItems = navItems.filter(
    (item) => !item.requiresApprovalAccess || hasApprovalAccess
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 border-r border-sidebar-border",
        isCollapsed ? "w-[72px]" : "w-72"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-[72px] items-center justify-between border-b border-sidebar-border px-4">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="rounded-xl gradient-primary p-2.5 shadow-lg shadow-primary/30">
                <Boxes className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-sidebar-foreground text-lg">Workspace</span>
                <div className="flex items-center gap-1 text-xs text-sidebar-muted">
                  <Sparkles className="h-3 w-3 text-warning" />
                  Pro Plan
                </div>
              </div>
            </div>
          )}
          <button
            onClick={onToggle}
            className={cn(
              "rounded-xl p-2 text-sidebar-muted transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              isCollapsed && "mx-auto"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 p-3">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const pendingCount = item.path === "/approvals" ? submittedTasks.length : 0;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary/20 to-purple-500/10 text-sidebar-foreground shadow-sm"
                    : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  isCollapsed && "justify-center px-3"
                )}
              >
                <div className={cn(
                  "relative rounded-lg p-1.5 transition-all duration-200",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-sidebar-accent text-sidebar-muted group-hover:bg-sidebar-primary/20 group-hover:text-sidebar-foreground"
                )}>
                  <item.icon className="h-4 w-4" />
                  {pendingCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-destructive text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {pendingCount > 9 ? "9+" : pendingCount}
                    </div>
                  )}
                </div>
                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1">
                    <span>{item.label}</span>
                    {pendingCount > 0 && (
                      <Badge className="bg-destructive text-white text-xs">
                        {pendingCount}
                      </Badge>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-3 space-y-2">
          {!isCollapsed && user && (
            <div className="rounded-xl bg-gradient-to-br from-sidebar-accent to-sidebar-accent/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary text-sm font-bold text-white shadow-lg shadow-primary/30">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-sidebar-foreground">
                    {user.name}
                  </p>
                  <Badge
                    variant={getRoleVariant(user.role)}
                    size="sm"
                    className="mt-1"
                  >
                    {ROLE_LABELS[user.role]}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={toggleTheme}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-sidebar-muted transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              isCollapsed && "justify-center px-3"
            )}
          >
            <div className="rounded-lg bg-sidebar-accent p-1.5">
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </div>
            {!isCollapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          <button
            onClick={logout}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-sidebar-muted transition-all duration-200 hover:bg-destructive/10 hover:text-destructive",
              isCollapsed && "justify-center px-3"
            )}
          >
            <div className="rounded-lg bg-sidebar-accent p-1.5">
              <LogOut className="h-4 w-4" />
            </div>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
