import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, ArrowLeft, Search, CheckCircle2, Clock, Loader2, TrendingUp } from "lucide-react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge, getRoleVariant } from "@/components/Common/Badge";
import { useAllUsersWithStats } from "@/hooks/useUserStats";
import { useAuth } from "@/contexts/AuthContext";
import { UserWithStats } from "@/types";
import { ROLE_LABELS } from "@/utils/constants";

export default function AdminUsers() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch all users with stats
    const { data: allUsersWithStats = [], isLoading, error } = useAllUsersWithStats();

    // Check if user is admin
    if (user?.role !== "ADMIN") {
        return (
            <Layout>
                <div className="p-6">
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
                        <h2 className="text-lg font-semibold text-destructive mb-2">Access Denied</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            Only administrators can access this page.
                        </p>
                        <Button onClick={() => navigate("/dashboard")} variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    // Show error if there's an issue
    if (error) {
        return (
            <Layout>
                <div className="p-6">
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
                        <h2 className="text-lg font-semibold text-destructive mb-2">Error Loading Users</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            {error instanceof Error ? error.message : 'Failed to load users'}
                        </p>
                        <Button onClick={() => navigate("/dashboard")} variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    // Filter users based on search
    const filteredUsers = searchQuery
        ? allUsersWithStats.filter(
            (user) =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.role.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : allUsersWithStats;

    // Calculate aggregate stats
    const aggregateStats = {
        totalUsers: allUsersWithStats.length,
        totalTasks: allUsersWithStats.reduce((sum, u) => sum + u.stats.totalTasks, 0),
        completedTasks: allUsersWithStats.reduce((sum, u) => sum + u.stats.completedTasks, 0),
        pendingTasks: allUsersWithStats.reduce((sum, u) => sum + u.stats.pendingTasks, 0),
        inProgressTasks: allUsersWithStats.reduce((sum, u) => sum + u.stats.inProgressTasks, 0),
    };

    const completionRate = aggregateStats.totalTasks > 0
        ? Math.round((aggregateStats.completedTasks / aggregateStats.totalTasks) * 100)
        : 0;

    return (
        <Layout>
            <Header
                title="User Management"
                description="View and manage all users and their task statistics"
                breadcrumbs={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Users" },
                ]}
                actions={
                    <Button onClick={() => navigate("/dashboard")} variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                }
            />

            <div className="p-6 space-y-6">
                {/* Stats Overview - Minimal */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatsCard
                        label="Users"
                        value={isLoading ? "-" : aggregateStats.totalUsers}
                        icon={Users}
                    />
                    <StatsCard
                        label="Tasks"
                        value={isLoading ? "-" : aggregateStats.totalTasks}
                        icon={Clock}
                    />
                    <StatsCard
                        label="Done"
                        value={isLoading ? "-" : aggregateStats.completedTasks}
                        icon={CheckCircle2}
                    />
                    <StatsCard
                        label="Rate"
                        value={isLoading ? "-" : `${completionRate}%`}
                        icon={TrendingUp}
                    />
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search users..."
                        className="pl-10"
                    />
                </div>

                {/* Users Table */}
                <div className="rounded-lg border bg-card overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Users className="h-10 w-10 text-muted-foreground/50 mb-3" />
                            <p className="text-sm text-muted-foreground">
                                {searchQuery ? "No users match your search" : "No users found"}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                                            Name
                                        </th>
                                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                                            Role
                                        </th>
                                        <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                                            Rooms
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
                                        <UserRow key={user.id} user={user} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

function StatsCard({ 
    label, 
    value, 
    icon: Icon
}: { 
    label: string; 
    value: string | number; 
    icon: React.ElementType;
}) {
    return (
        <div className="rounded-lg border bg-card/50 backdrop-blur-sm p-3">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-xl font-semibold text-foreground mt-1">
                        {value}
                    </p>
                </div>
                <Icon className="h-5 w-5 text-primary/30" />
            </div>
        </div>
    );
}

function UserRow({ user }: { user: UserWithStats }) {
    const completionRate = user.stats.totalTasks > 0
        ? Math.round((user.stats.completedTasks / user.stats.totalTasks) * 100)
        : 0;

    return (
        <tr className="border-b hover:bg-muted/30 transition-colors">
            {/* User Info */}
            <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                </div>
            </td>

            {/* Role */}
            <td className="px-4 py-4 hidden sm:table-cell">
                <Badge variant={getRoleVariant(user.role)} size="sm">
                    {ROLE_LABELS[user.role] || user.role}
                </Badge>
            </td>

            {/* Rooms */}
            <td className="px-4 py-4 hidden md:table-cell">
                <div className="flex flex-wrap gap-1">
                    {user.rooms && user.rooms.length > 0 ? (
                        user.rooms.map((room) => (
                            <span
                                key={room.id}
                                className="inline-flex items-center px-2 py-1 rounded text-xs bg-primary/10 text-primary font-medium"
                            >
                                {room.name}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                    )}
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
                    <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
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
