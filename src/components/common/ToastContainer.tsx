import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { useMission } from '../../context/MissionContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast, setActiveTab } = useMission();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none font-mono">
      {toasts.map((toast) => {
        const isCritical = toast.type === 'critical';
        const isWarning = toast.type === 'warning';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-2xl bg-[#111925]/95 backdrop-blur-md transition-all duration-200 ${
              isCritical
                ? 'border-[#FF3B4E]/40 ring-1 ring-[#FF3B4E]/30 text-rose-100'
                : isWarning
                ? 'border-[#FF9F1C]/40 ring-1 ring-[#FF9F1C]/30 text-amber-100'
                : isSuccess
                ? 'border-[#22C55E]/40 ring-1 ring-[#22C55E]/30 text-emerald-100'
                : 'border-white/10 text-slate-100'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isCritical && <AlertCircle className="w-5 h-5 text-[#FF3B4E] animate-pulse" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-[#FF9F1C]" />}
              {isSuccess && <CheckCircle className="w-5 h-5 text-[#22C55E]" />}
              {!isCritical && !isWarning && !isSuccess && <Info className="w-5 h-5 text-[#38BDF8]" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-bold text-white tracking-tight">{toast.title}</h4>
                <span className="text-[10px] text-slate-400">{toast.timestamp}</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-snug">{toast.message}</p>
              
              {isCritical && (
                <button
                  onClick={() => {
                    setActiveTab('alert-center');
                    dismissToast(toast.id);
                  }}
                  className="mt-2 text-[11px] font-bold text-[#FF3B4E] hover:underline flex items-center gap-1"
                >
                  View in Alert Center →
                </button>
              )}
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 shrink-0 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
