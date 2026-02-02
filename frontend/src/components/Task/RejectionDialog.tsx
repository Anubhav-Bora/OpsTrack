import * as React from "react";
import { Button } from "@/components/ui/button";

interface RejectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
  taskTitle: string;
}

export function RejectionDialog({ isOpen, onClose, onConfirm, taskTitle }: RejectionDialogProps) {
  const [rejectionNote, setRejectionNote] = React.useState("");

  const handleConfirm = () => {
    onConfirm(rejectionNote.trim());
    setRejectionNote("");
  };

  const handleCancel = () => {
    setRejectionNote("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm pointer-events-auto" onClick={handleCancel} />

      {/* Dialog */}
      <div className="relative bg-card rounded-lg border shadow-elevated max-w-md mx-4 pointer-events-auto overflow-hidden">
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Reject Task</h2>
            <p className="text-sm text-muted-foreground">
              "{taskTitle}"
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="rejection-note" className="text-sm font-medium text-foreground">
              Rejection Note <span className="text-muted-foreground text-xs">(optional)</span>
            </label>
            <textarea
              id="rejection-note"
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              placeholder="Provide a reason for rejection..."
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[120px] resize-none"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
            >
              Reject Task
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
