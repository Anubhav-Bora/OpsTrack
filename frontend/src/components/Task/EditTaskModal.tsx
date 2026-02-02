import * as React from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { Task, RoomMember } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EditTaskModalProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, description?: string, requiredRole?: string, dueDate?: string, assigneeId?: string) => void;
    isLoading?: boolean;
    roomMembers?: RoomMember[];
}

export function EditTaskModal({ task, isOpen, onClose, onSave, isLoading = false, roomMembers = [] }: EditTaskModalProps) {
    const [editData, setEditData] = React.useState({
        title: task.title,
        description: task.description || "",
        requiredRole: (task.requiredRole as string) || "BACKEND",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
        assigneeId: task.assigneeId || "",
    });

    const [errors, setErrors] = React.useState<Record<string, string>>({});

    // Reset form when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setEditData({
                title: task.title,
                description: task.description || "",
                requiredRole: (task.requiredRole as string) || "BACKEND",
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
                assigneeId: task.assigneeId || "",
            });
            setErrors({});
        }
    }, [isOpen, task]);

    // Handle escape key
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isLoading) onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose, isLoading]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!editData.title.trim()) {
            newErrors.title = "Title is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            onSave(editData.title, editData.description, editData.requiredRole, editData.dueDate, editData.assigneeId);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-2xl mx-4 rounded-xl bg-card border shadow-elevated animate-scale-in max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-6 bg-gradient-to-r from-primary/5 to-transparent">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Edit Task</h2>
                        <p className="text-sm text-muted-foreground mt-1">Update task details and settings</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Title Field */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-title" className="text-sm font-medium">
                            Task Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="edit-title"
                            value={editData.title}
                            onChange={(e) => {
                                setEditData({ ...editData, title: e.target.value });
                                if (errors.title) setErrors({ ...errors, title: "" });
                            }}
                            placeholder="Enter task title"
                            disabled={isLoading}
                            className={errors.title ? "border-destructive focus:ring-destructive" : ""}
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3.5 w-3.5" />
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-description" className="text-sm font-medium">
                            Description
                        </Label>
                        <Textarea
                            id="edit-description"
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            placeholder="Enter task description (optional)"
                            disabled={isLoading}
                            rows={4}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            {editData.description.length}/500 characters
                        </p>
                    </div>

                    {/* Required Role Field */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-role" className="text-sm font-medium">
                            Required Role
                        </Label>
                        <select
                            id="edit-role"
                            value={editData.requiredRole}
                            onChange={(e) => setEditData({ ...editData, requiredRole: e.target.value })}
                            disabled={isLoading}
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                        >
                            <option value="BACKEND">Backend</option>
                            <option value="FRONTEND">Frontend</option>
                            <option value="DEVOPS">DevOps</option>
                            <option value="CYBERSECURITY">Cybersecurity</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                        <p className="text-xs text-muted-foreground">
                            Only users with this role can be assigned to this task
                        </p>
                    </div>

                    {/* Assignee Field */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-assignee" className="text-sm font-medium">
                            Assignee
                        </Label>
                        <select
                            id="edit-assignee"
                            value={editData.assigneeId}
                            onChange={(e) => setEditData({ ...editData, assigneeId: e.target.value })}
                            disabled={isLoading}
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                        >
                            <option value="">Unassigned</option>
                            {roomMembers.map((member) => (
                                <option key={member.id} value={member.userId}>
                                    {member.user.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-muted-foreground">
                            Assign this task to a room member
                        </p>
                    </div>

                    {/* Due Date Field */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-duedate" className="text-sm font-medium">
                            Due Date
                        </Label>
                        <Input
                            id="edit-duedate"
                            type="date"
                            value={editData.dueDate}
                            onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                            disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                            Set a deadline for task completion
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t p-4 bg-secondary/30 flex justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="gap-2"
                    >
                        <Save className="h-4 w-4" />
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
