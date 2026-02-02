import * as React from "react";
import { X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface RejectTaskModalProps {
    taskTitle: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (note?: string) => void;
    isLoading?: boolean;
}

export function RejectTaskModal({
    taskTitle,
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
}: RejectTaskModalProps) {
    const [rejectionNote, setRejectionNote] = React.useState("");

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

    const handleConfirm = () => {
        onConfirm(rejectionNote.trim() || undefined);
        setRejectionNote("");
    };

    const handleClose = () => {
        setRejectionNote("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={handleClose} />

            {/* Modal */}
            <div className="relative w-full max-w-md mx-4 rounded-xl bg-card border shadow-elevated animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-6 bg-gradient-to-r from-destructive/5 to-transparent">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">Reject Task</h2>
                        <p className="text-sm text-muted-foreground mt-1">"{taskTitle}"</p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="rejection-note" className="text-sm font-medium">
                            Rejection Note <span className="text-muted-foreground text-xs">(optional)</span>
                        </Label>
                        <Textarea
                            id="rejection-note"
                            value={rejectionNote}
                            onChange={(e) => setRejectionNote(e.target.value)}
                            placeholder="Provide a reason for rejection..."
                            disabled={isLoading}
                            rows={5}
                            className="resize-none"
                            autoFocus
                        />
                        <p className="text-xs text-muted-foreground">
                            {rejectionNote.length}/500 characters
                        </p>
                    </div>

                    <div className="rounded-lg border border-warning/20 bg-warning/5 p-3 flex gap-2">
                        <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground">
                            The task will be sent back to the assignee for revision.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t p-4 bg-secondary/30 flex justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? "Rejecting..." : "Confirm Rejection"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
