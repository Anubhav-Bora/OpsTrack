import * as React from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, message }]);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToastNotification() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToastNotification must be used within a ToastProvider");
  }
  return context;
}

function ToastContainer() {
  const { toasts, removeToast } = useToastNotification();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onClose={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  );
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  success: "bg-success border-success/80 text-white shadow-lg shadow-success/30",
  error: "bg-destructive border-destructive/80 text-white shadow-lg shadow-destructive/30",
  warning: "bg-warning border-warning/80 text-white shadow-lg shadow-warning/30",
  info: "bg-info border-info/80 text-white shadow-lg shadow-info/30",
};

const iconStyles = {
  success: "text-white",
  error: "text-white",
  warning: "text-white",
  info: "text-white",
};

const textStyles = {
  success: "text-white font-semibold",
  error: "text-white font-semibold",
  warning: "text-white font-semibold",
  info: "text-white font-semibold",
};

const messageStyles = {
  success: "text-white/95",
  error: "text-white/95",
  warning: "text-white/95",
  info: "text-white/95",
};

const closeButtonStyles = {
  success: "text-white/70 hover:text-white hover:bg-white/20",
  error: "text-white/70 hover:text-white hover:bg-white/20",
  warning: "text-white/70 hover:text-white hover:bg-white/20",
  info: "text-white/70 hover:text-white hover:bg-white/20",
};

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const Icon = icons[toast.type];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 animate-slide-in min-w-[320px] max-w-md backdrop-blur-sm",
        styles[toast.type]
      )}
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", iconStyles[toast.type])} />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm", textStyles[toast.type])}>{toast.title}</p>
        {toast.message && (
          <p className={cn("mt-1 text-sm leading-relaxed", messageStyles[toast.type])}>{toast.message}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className={cn("flex-shrink-0 rounded p-1 transition-colors", closeButtonStyles[toast.type])}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
