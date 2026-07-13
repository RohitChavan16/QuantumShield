import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextType {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...options, id, type: options.type || 'info', duration: options.duration || 5000 }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
          <AnimatePresence>
            {toasts.map((t) => (
              <ToastCard key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

function ToastCard({ toast, onRemove }: { toast: ToastItem, onRemove: () => void }) {
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(onRemove, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, onRemove]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-accent" />,
    error: <AlertCircle className="h-5 w-5 text-critical" />,
    info: <Info className="h-5 w-5 text-info" />,
  };

  const borders = {
    success: 'border-accent/50',
    error: 'border-critical/50',
    info: 'border-info/50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={cn("bg-surface border shadow-lg rounded-card p-4 flex items-start gap-3 relative overflow-hidden", borders[toast.type || 'info'])}
    >
      <div className="shrink-0">{icons[toast.type || 'info']}</div>
      <div className="flex-1 pr-6">
        <h4 className="text-sm font-semibold text-text-primary">{toast.title}</h4>
        {toast.description && <p className="text-sm text-text-secondary mt-1">{toast.description}</p>}
      </div>
      <button
        onClick={onRemove}
        className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
