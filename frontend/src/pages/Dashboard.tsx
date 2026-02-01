import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ListTodo, Clock, CheckCircle, AlertTriangle, Sparkles, TrendingUp } from "lucide-react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Layout/Header";
import { RoomCard, RoomCardSkeleton } from "@/components/Room/RoomCard";
import { RoomForm } from "@/components/Room/RoomForm";
import { Button } from "@/components/ui/button";
import { useAuth, useIsAdminOrLeader } from "@/contexts/AuthContext";
import { useToastNotification } from "@/components/Common/Toast";
import { EmptyState } from "@/components/Common/EmptyState";
import { MOCK_ROOMS, MOCK_TASKS, calculateDashboardStats } from "@/data/mockData";
import { Room, CreateRoomInput, DashboardStats } from "@/types";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdminOrLeader = useIsAdminOrLeader();
  const { addToast } = useToastNotification();
  
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showCreateRoom, setShowCreateRoom] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);

  // Load data
  React.useEffect(() => {
    const loadData = async () => {
      await new Promise((r) => setTimeout(r, 800));
      setRooms(MOCK_ROOMS);
      setStats(calculateDashboardStats(MOCK_TASKS, user?.id));
      setIsLoading(false);
    };
    loadData();

    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const handleCreateRoom = async (data: CreateRoomInput) => {
    setIsCreating(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const newRoom: Room = {
        id: `room-${Date.now()}`,
        name: data.name,
        description: data.description,
        membersCount: 1,
        tasksCount: 0,
        completedTasksCount: 0,
        createdAt: new Date().toISOString(),
        createdBy: user?.id || "",
      };
      setRooms((prev) => [newRoom, ...prev]);
      setShowCreateRoom(false);
      addToast("success", "Room created", `"${data.name}" has been created successfully.`);
    } catch (error) {
      addToast("error", "Failed to create room", "Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const statCards = [
    {
      label: "Total Tasks",
      value: stats?.totalTasks || 0,
      icon: ListTodo,
      gradient: "from-primary/20 via-primary/10 to-transparent",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
      trend: "+12%",
    },
    {
      label: "In Progress",
      value: stats?.inProgressTasks || 0,
      icon: Clock,
      gradient: "from-info/20 via-info/10 to-transparent",
      iconBg: "bg-info/15",
      iconColor: "text-info",
      trend: "+5%",
    },
    {
      label: "Completed",
      value: stats?.completedTasks || 0,
      icon: CheckCircle,
      gradient: "from-success/20 via-success/10 to-transparent",
      iconBg: "bg-success/15",
      iconColor: "text-success",
      trend: "+18%",
    },
    {
      label: "Pending Approvals",
      value: stats?.pendingApprovals || 0,
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
            <Button 
              onClick={() => setShowCreateRoom(true)}
              className="gradient-primary border-0 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Room
            </Button>
          )
        }
      />

      <div className="p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
          {statCards
            .filter((s) => !s.hidden)
            .map((stat, index) => (
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
    </Layout>
  );
}
