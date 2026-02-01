import { LucideIcon, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center animate-fade-in",
        className
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-purple-500/20 blur-xl" />
        <div className="relative rounded-3xl bg-gradient-to-br from-primary/10 to-purple-500/10 p-6">
          <Icon className="h-10 w-10 text-primary" />
        </div>
      </div>
      <h3 className="mt-6 text-xl font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
