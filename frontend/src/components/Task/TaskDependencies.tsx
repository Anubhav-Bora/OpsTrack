import * as React from "react";
import { AlertCircle, Link2, Trash2, Plus } from "lucide-react";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { useTaskDependencies, useTaskDependents, useAddTaskDependency, useRemoveTaskDependency } from "@/hooks/useTaskDependencies";
import { LoadingSpinner } from "@/components/Common/LoadingSpinner";

interface TaskDependenciesProps {
    task: Task;
    availableTasks: Task[];
    isEditable?: boolean;
}

export function TaskDependencies({ task, availableTasks, isEditable = false }: TaskDependenciesProps) {
    const { data: dependencies, isLoading: depsLoading } = useTaskDependencies(task.id);
    const { data: dependents, isLoading: deptsLoading } = useTaskDependents(task.id);
    const addDependency = useAddTaskDependency();
    const removeDependency = useRemoveTaskDependency();
    const [selectedDep, setSelectedDep] = React.useState("");

    if (depsLoading || deptsLoading) {
        return <LoadingSpinner />;
    }

    const hasDependencies = (dependencies?.length ?? 0) > 0;
    const hasDependents = (dependents?.length ?? 0) > 0;

    if (!hasDependencies && !hasDependents && !isEditable) {
        return null;
    }

    return (
        <div className="space-y-4">
            {/* Dependencies (tasks this task depends on) */}
            {hasDependencies && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Link2 className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-semibold text-sm text-foreground">Depends On</h4>
                    </div>
                    <div className="space-y-2 pl-6">
                        {dependencies?.map((dep) => {
                            const depTask = availableTasks.find(t => t.id === String(dep.dependsOnTaskId));
                            return (
                                <div key={dep.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-secondary/50 border border-secondary">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {depTask?.title || `Task ${dep.dependsOnTaskId}`}
                                        </p>
                                        {depTask?.status && (
                                            <p className="text-xs text-muted-foreground">{depTask.status}</p>
                                        )}
                                    </div>
                                    {isEditable && (
                                        <button
                                            onClick={() => removeDependency.mutate({ taskId: task.id, dependsOnTaskId: String(dep.dependsOnTaskId) })}
                                            disabled={removeDependency.isPending}
                                            className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Dependents (tasks that depend on this task) */}
            {hasDependents && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-warning" />
                        <h4 className="font-semibold text-sm text-foreground">Blocking</h4>
                    </div>
                    <div className="space-y-2 pl-6">
                        {dependents?.map((dep) => {
                            const depTask = availableTasks.find(t => t.id === String(dep.taskId));
                            return (
                                <div key={dep.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-warning/5 border border-warning/20">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {depTask?.title || `Task ${dep.taskId}`}
                                        </p>
                                        {depTask?.status && (
                                            <p className="text-xs text-muted-foreground">{depTask.status}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Add dependency */}
            {isEditable && (
                <div className="space-y-2 pt-2 border-t">
                    <h4 className="font-semibold text-sm text-foreground">Add Dependency</h4>
                    <div className="flex gap-2">
                        <select
                            value={selectedDep}
                            onChange={(e) => setSelectedDep(e.target.value)}
                            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="">Select task to depend on</option>
                            {availableTasks
                                .filter(t => t.id !== task.id && !dependencies?.some(d => String(d.dependsOnTaskId) === t.id))
                                .map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.title}
                                    </option>
                                ))}
                        </select>
                        <Button
                            size="sm"
                            onClick={() => {
                                if (selectedDep) {
                                    addDependency.mutate({ taskId: task.id, dependsOnTaskId: selectedDep });
                                    setSelectedDep("");
                                }
                            }}
                            disabled={!selectedDep || addDependency.isPending}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
