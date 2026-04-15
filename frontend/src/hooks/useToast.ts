import { useState, useCallback } from 'react';

export type ToastVariant = 'success' | 'warning' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

export function useToast(durationMs = 3500) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, durationMs);
  }, [durationMs]);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, show, dismiss };
}
