import { Task, TaskStatus } from "@/types";
import { TaskCard, TaskCardCompact } from "./TaskCard";
import { EmptyState } from "@/components/Common/EmptyState";
import { TaskCardSkeleton } from "@/components/Common/LoadingSpinner";
import { ListTodo } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  onTaskClick?: (task: Task) => void;
  variant?: "default" | "compact";
  emptyMessage?: string;
  emptyDescription?: string;
  allTasks?: Task[];
}

export function TaskList({
  tasks,
  isLoading,
  onTaskClick,
  variant = "default",
  emptyMessage = "No tasks found",
  emptyDescription = "Create your first task to get started.",
  allTasks,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={ListTodo}
        title={emptyMessage}
        description={emptyDescription}
      />
    );
  }

  if (variant === "compact") {
    return (
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCardCompact
            key={task.id}
            task={task}
            onClick={() => onTaskClick?.(task)}
            allTasks={allTasks}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onClick={() => onTaskClick?.(task)} 
          allTasks={allTasks}
        />
      ))}
    </div>
  );
}
