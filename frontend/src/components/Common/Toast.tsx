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
  success: "bg-gradient-to-br from-success to-success/80 border border-success/40 text-white shadow-lg shadow-success/25",
  error: "bg-gradient-to-br from-destructive to-destructive/80 border border-destructive/40 text-white shadow-lg shadow-destructive/25",
  warning: "bg-gradient-to-br from-warning to-warning/80 border border-warning/40 text-white shadow-lg shadow-warning/25",
  info: "bg-gradient-to-br from-info to-info/80 border border-info/40 text-white shadow-lg shadow-info/25",
};

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const Icon = icons[toast.type];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 animate-slide-in-right min-w-[320px] max-w-md backdrop-blur-md smooth-transition",
        styles[toast.type]
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5 text-white animate-bounce-in" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-semibold">{toast.title}</p>
        {toast.message && (
          <p className="mt-1 text-sm leading-relaxed text-white/95">{toast.message}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 rounded p-1 smooth-transition text-white/60 hover:text-white hover:bg-white/20"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
