"use client";

import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useRef,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; type: ToastType; title: string; message?: string };

type Action =
  | { kind: "add"; toast: Toast }
  | { kind: "remove"; id: number };

function reducer(state: Toast[], action: Action): Toast[] {
  switch (action.kind) {
    case "add":
      return [...state, action.toast];
    case "remove":
      return state.filter((t) => t.id !== action.id);
  }
}

interface ToastContextValue {
  toast: (t: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

const icons = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
} as const;

const accents = {
  success: "text-emerald-400",
  error: "text-rose-400",
  info: "text-cyan",
} as const;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, []);
  const counter = useRef(0);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = ++counter.current;
    dispatch({ kind: "add", toast: { ...t, id } });
    window.setTimeout(() => dispatch({ kind: "remove", id }), 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(92vw,380px)] flex-col gap-2"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const Icon = icons[t.type];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="glass-strong pointer-events-auto flex items-start gap-3 p-4 shadow-panel"
                role="status"
              >
                <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", accents[t.type])} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">{t.title}</p>
                  {t.message && (
                    <p className="mt-0.5 text-xs text-slate-300">{t.message}</p>
                  )}
                </div>
                <button
                  onClick={() => dispatch({ kind: "remove", id: t.id })}
                  className="rounded-md p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
