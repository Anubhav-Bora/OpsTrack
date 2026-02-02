import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ListTodo, Clock, CheckCircle, AlertTriangle, Sparkles, TrendingUp, Users } from "lucide-react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Layout/Header";
import { RoomCard, RoomCardSkeleton } from "@/components/Room/RoomCard";
import { RoomForm } from "@/components/Room/RoomForm";
import { UserStatsModal } from "@/components/Common/UserStatsModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { EmptyState } from "@/components/Common/EmptyState";
import { useRooms, useCreateRoom } from "@/hooks/useRooms";
import { useAllUsersWithStats } from "@/hooks/useUserStats";
import { CreateRoomInput } from "@/types";
import { useAppSelector } from "@/store/hooks";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showUserStats, setShowUserStats] = useState(false);

  // Get user from AuthContext (which is synced with localStorage)
  const authContext = useAuth();
  const user = authContext.user;
  const isAdminOrLeader = user?.role === "ADMIN";

  // Fetch rooms with polling
  const { data: rooms = [], isLoading } = useRooms();
  const { mutate: createRoom, isPending: isCreating } = useCreateRoom();
  
  // Fetch all users with stats (for admin)
  const { data: allUsersWithStats = [], isLoading: isLoadingUsers } = useAllUsersWithStats();

  const handleCreateRoom = (data: CreateRoomInput) => {
    createRoom(data, {
      onSuccess: () => {
        setShowCreateRoom(false);
        toast({
          title: "Room created",
          description: `"${data.name}" has been created successfully.`,
        });
      },
      onError: () => {
        toast({
          title: "Failed to create room",
          description: "Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  // Calculate stats from rooms
  const stats = {
    totalTasks: rooms.reduce((sum, room) => sum + room.tasksCount, 0),
    completedTasks: rooms.reduce((sum, room) => sum + room.completedTasksCount, 0),
    inProgressTasks: rooms.reduce((sum, room) => sum + (room.tasksCount - room.completedTasksCount), 0),
    pendingApprovals: 0, // Will be fetched from API if needed
  };

  const statCards = [
    {
      label: "Total Tasks",
      value: stats.totalTasks,
      icon: ListTodo,
      gradient: "from-primary/20 via-primary/10 to-transparent",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
      trend: "+12%",
    },
    {
      label: "In Progress",
      value: stats.inProgressTasks,
      icon: Clock,
      gradient: "from-info/20 via-info/10 to-transparent",
      iconBg: "bg-info/15",
      iconColor: "text-info",
      trend: "+5%",
    },
    {
      label: "Completed",
      value: stats.completedTasks,
      icon: CheckCircle,
      gradient: "from-success/20 via-success/10 to-transparent",
      iconBg: "bg-success/15",
      iconColor: "text-success",
      trend: "+18%",
    },
    {
      label: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: AlertTriangle,
      gradient: "from-warning/20 via-warning/10 to-transparent",
      iconBg: "bg-warning/15",
      iconColor: "text-warning",
      trend: "-3%",
      hidden: !isAdminOrLeader,
    },
  ];

  return (
    <Layout>
      <Header
        title={
          <span className="flex items-center gap-2">
            Welcome back, {user?.name?.split(" ")[0] || "User"}
            <Sparkles className="h-5 w-5 text-warning animate-pulse" />
          </span>
        }
        description="Here's an overview of your workspace"
        actions={
          isAdminOrLeader && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowUserStats(true)}
              >
                <Users className="h-4 w-4 mr-2" />
                View All Users
              </Button>
              <Button
                onClick={() => setShowCreateRoom(true)}
                className="gradient-primary border-0 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Room
              </Button>
            </div>
          )
        }
      />

      <div className="p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
          {statCards
            .filter((s) => !s.hidden)
            .map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  "group relative rounded-2xl border bg-card p-6 shadow-card overflow-hidden",
                  "transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 hover:border-primary/20"
                )}
              >
                {/* Gradient background */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-50",
                  stat.gradient
                )} />

                <div className="relative flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-4xl font-bold tracking-tight text-foreground">
                      {isLoading ? (
                        <span className="inline-block w-12 h-10 skeleton rounded" />
                      ) : (
                        stat.value
                      )}
                    </p>
                    {!isLoading && (
                      <div className="flex items-center gap-1 text-xs font-medium text-success">
                        <TrendingUp className="h-3 w-3" />
                        {stat.trend} this week
                      </div>
                    )}
                  </div>
                  <div className={cn(
                    "rounded-2xl p-3.5 transition-transform duration-300 group-hover:scale-110",
                    stat.iconBg
                  )}>
                    <stat.icon className={cn("h-6 w-6", stat.iconColor)} />
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Rooms Section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Your Rooms</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {rooms.length} active {rooms.length === 1 ? 'project' : 'projects'}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <RoomCardSkeleton key={i} />
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <EmptyState
              title="No rooms yet"
              description="Create your first room to start organizing your projects."
              action={
                isAdminOrLeader && (
                  <Button
                    onClick={() => setShowCreateRoom(true)}
                    className="gradient-primary border-0"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Room
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onClick={() => navigate(`/room/${room.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Room Modal */}
      <RoomForm
        isOpen={showCreateRoom}
        onClose={() => setShowCreateRoom(false)}
        onSubmit={handleCreateRoom}
        isLoading={isCreating}
      />

      {/* User Stats Modal (for Admin) */}
      {isAdminOrLeader && (
        <UserStatsModal
          isOpen={showUserStats}
          onClose={() => setShowUserStats(false)}
          users={allUsersWithStats}
          isLoading={isLoadingUsers}
          title="All Users"
          subtitle="View all users and their task statistics"
        />
      )}
    </Layout>
  );
}
