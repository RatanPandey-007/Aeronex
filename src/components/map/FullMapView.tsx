import React from 'react';
import { ArrowLeft, Maximize2, ShieldAlert, Radio, Compass, X } from 'lucide-react';
import { OperationsMap } from './OperationsMap';
import { DisasterAlert } from '../../types/alert';

export interface FullMapViewProps {
  isOpen: boolean;
  alert: DisasterAlert | null;
  onBackToIntelligence: () => void;
  onClose: () => void;
}

export const FullMapView: React.FC<FullMapViewProps> = ({
  isOpen,
  alert,
  onBackToIntelligence,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#070B12] flex flex-col animate-in fade-in duration-200">
      {/* Top Tactical Command Header */}
      <header className="h-16 px-6 bg-[#0D131D] border-b border-white/10 flex items-center justify-between shrink-0 font-mono">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToIntelligence}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-[#38BDF8] border border-[#38BDF8]/30 text-xs font-bold transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO INTELLIGENCE SHEET</span>
          </button>

          <div className="h-6 w-px bg-white/10" />

          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF3B4E] animate-pulse" />
              <span className="text-sm font-black text-[#F8FAFC]">FULL TACTICAL GEOSPATIAL MAP</span>
              {alert && (
                <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                  FOCUSED: {alert.title}
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#94A3B8]">
              COORDINATES: 11.5365°N, 76.1265°E • CENTIMETER RTK FIX • MESH LINK ACTIVE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE FLIGHT ENVELOPE</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Close Map Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Fullscreen Map Container */}
      <div className="flex-1 w-full h-full relative p-4 bg-[#070B12]">
        <OperationsMap heightClass="h-full" focusAlertId={alert?.id} />
      </div>
    </div>
  );
};
