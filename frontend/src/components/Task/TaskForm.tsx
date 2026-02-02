import * as React from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { CreateTaskInput, User, UserRole, Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ROLE_LABELS } from "@/utils/constants";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskInput) => void;
  members?: User[];
  isLoading?: boolean;
  availableTasks?: Task[];
  onAddDependency?: (dependsOnTaskId: string) => void;
  onRemoveDependency?: (dependsOnTaskId: string) => void;
  dependencies?: string[];
}

export function TaskForm({ isOpen, onClose, onSubmit, members = [], isLoading, availableTasks = [], onAddDependency, onRemoveDependency, dependencies = [] }: TaskFormProps) {
  const [formData, setFormData] = React.useState<CreateTaskInput>({
    title: "",
    description: "",
    requiredRole: "BACKEND",
    assigneeId: "",
    dueDate: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [selectedDependency, setSelectedDependency] = React.useState("");

  React.useEffect(() => {
    if (!isOpen) {
      setFormData({ title: "", description: "", requiredRole: "BACKEND", assigneeId: "", dueDate: "" });
      setErrors({});
      setSelectedDependency("");
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.requiredRole) {
      newErrors.requiredRole = "Required role is required";
    }
    if (!formData.assigneeId) {
      newErrors.assigneeId = "Assignee is required";
    }
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Filter members by required role
  const filteredMembers = React.useMemo(() => {
    if (!formData.requiredRole) return members;
    return members.filter(member => member.role === formData.requiredRole);
  }, [members, formData.requiredRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 rounded-xl bg-card border shadow-elevated animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-lg font-semibold text-foreground">Create New Task</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title"
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requiredRole">Required Role *</Label>
            <select
              id="requiredRole"
              value={formData.requiredRole || "BACKEND"}
              onChange={(e) => setFormData((prev) => ({ ...prev, requiredRole: e.target.value, assigneeId: "" }))}
              className={`w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${errors.requiredRole ? "border-destructive" : ""}`}
            >
              <option value="BACKEND">Backend</option>
              <option value="FRONTEND">Frontend</option>
              <option value="DEVOPS">DevOps</option>
              <option value="CYBERSECURITY">Cybersecurity</option>
              <option value="ADMIN">Admin</option>
            </select>
            {errors.requiredRole && (
              <p className="text-sm text-destructive">{errors.requiredRole}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee *</Label>
            <select
              id="assignee"
              value={formData.assigneeId}
              onChange={(e) => setFormData((prev) => ({ ...prev, assigneeId: e.target.value }))}
              className={`w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${errors.assigneeId ? "border-destructive" : ""}`}
            >
              <option value="">Select assignee</option>
              {filteredMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
            {filteredMembers.length === 0 && formData.requiredRole && (
              <p className="text-sm text-muted-foreground">No team members with {formData.requiredRole} role available</p>
            )}
            {errors.assigneeId && (
              <p className="text-sm text-destructive">{errors.assigneeId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
              className={errors.dueDate ? "border-destructive" : ""}
            />
            {errors.dueDate && (
              <p className="text-sm text-destructive">{errors.dueDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Dependencies</Label>
            <div className="space-y-2">
              {dependencies.length > 0 && (
                <div className="space-y-2">
                  {dependencies.map((depId) => {
                    const depTask = availableTasks.find(t => t.id === depId);
                    return (
                      <div key={depId} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-secondary/50 border border-secondary">
                        <span className="text-sm font-medium text-foreground truncate">
                          {depTask?.title || `Task ${depId}`}
                        </span>
                        {onRemoveDependency && (
                          <button
                            type="button"
                            onClick={() => onRemoveDependency(depId)}
                            className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="flex gap-2">
                <select
                  value={selectedDependency}
                  onChange={(e) => setSelectedDependency(e.target.value)}
                  className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select task to depend on</option>
                  {availableTasks
                    .filter(t => !dependencies.includes(t.id))
                    .map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.title}
                      </option>
                    ))}
                </select>
                {onAddDependency && selectedDependency && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onAddDependency(selectedDependency);
                      setSelectedDependency("");
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
