import { Users, CheckCircle, ListTodo, ArrowUpRight, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import { Room } from "@/types";

interface RoomCardProps {
  room: Room;
  onClick?: () => void;
  className?: string;
}

export function RoomCard({ room, onClick, className }: RoomCardProps) {
  const completionRate = room.tasksCount > 0
    ? Math.round((room.completedTasksCount / room.tasksCount) * 100)
    : 0;

  const getProgressColor = () => {
    if (completionRate >= 80) return "from-success to-emerald-400";
    if (completionRate >= 50) return "from-info to-cyan-400";
    if (completionRate >= 25) return "from-warning to-amber-400";
    return "from-primary to-purple-400";
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative rounded-2xl border bg-card p-6 cursor-pointer overflow-hidden",
        "transition-all duration-300 ease-out",
        "hover:shadow-elevated hover:-translate-y-1 hover:border-primary/30",
        className
      )}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Arrow indicator */}
      <div className="absolute top-4 right-4 p-2 rounded-xl bg-secondary/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-primary group-hover:text-white">
        <ArrowUpRight className="h-4 w-4" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary group-hover:from-primary group-hover:to-purple-500 group-hover:text-white transition-all duration-300">
            <Folder className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {room.name}
            </h3>
            {room.description && (
              <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                {room.description}
              </p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground font-medium">Progress</span>
            <span className="font-semibold text-foreground">{completionRate}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-secondary/80 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out",
                getProgressColor()
              )}
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium text-foreground">{room.membersCount}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50">
            <ListTodo className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium text-foreground">{room.tasksCount}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10">
            <CheckCircle className="h-3.5 w-3.5 text-success" />
            <span className="font-medium text-success">{room.completedTasksCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RoomCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-6 overflow-hidden">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-2/3 skeleton rounded-lg" />
          <div className="h-4 w-full skeleton rounded-lg" />
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <div className="flex justify-between">
          <div className="h-4 w-16 skeleton rounded" />
          <div className="h-4 w-8 skeleton rounded" />
        </div>
        <div className="h-2.5 w-full skeleton rounded-full" />
      </div>
      <div className="mt-5 flex gap-4">
        <div className="h-8 w-16 skeleton rounded-lg" />
        <div className="h-8 w-16 skeleton rounded-lg" />
        <div className="h-8 w-16 skeleton rounded-lg" />
      </div>
    </div>
  );
}
