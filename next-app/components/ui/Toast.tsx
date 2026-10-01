'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { cx } from './a11y';

export type ToastTone = 'info' | 'success' | 'warning' | 'error';

export interface ToastInput {
  title: string;
  description?: string;
  tone?: ToastTone;
  /** Durasi tampil (ms). Default 4000. */
  duration?: number;
}

interface ToastRecord extends Required<Omit<ToastInput, 'description'>> {
  id: number;
  description?: string;
}

interface ToastContextValue {
  toast: (input: ToastInput) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TONE_ICON: Record<ToastTone, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  error: AlertCircle,
};

/**
 * Sistem toast sederhana via context.
 * Bungkus subtree dengan <ToastProvider>, lalu panggil useToast().toast(...).
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      idRef.current += 1;
      const record: ToastRecord = {
        id: idRef.current,
        title: input.title,
        description: input.description,
        tone: input.tone ?? 'info',
        duration: input.duration ?? 4000,
      };
      setToasts((current) => [...current.slice(-2), record]);
      window.setTimeout(() => dismiss(record.id), record.duration);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useToast harus dipakai di dalam <ToastProvider>.');
  return value;
}

function ToastViewport({ toasts, onDismiss }: { toasts: ToastRecord[]; onDismiss: (id: number) => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || toasts.length === 0) return null;

  return createPortal(
    <div className="sk-toasts" aria-live="polite" aria-atomic="false">
      {toasts.map((item) => {
        const Icon = TONE_ICON[item.tone];
        return (
          <div key={item.id} role="status" className={cx('sk-toast', `sk-toast-${item.tone}`)}>
            <span className="sk-toast-icon" aria-hidden="true">
              <Icon size={20} />
            </span>
            <div className="sk-toast-body">
              <p className="sk-toast-title">{item.title}</p>
              {item.description && <p className="sk-toast-desc">{item.description}</p>}
            </div>
            <button
              type="button"
              className="sk-toast-close"
              aria-label="Tutup notifikasi"
              onClick={() => onDismiss(item.id)}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>,
    document.body,
  );
}
