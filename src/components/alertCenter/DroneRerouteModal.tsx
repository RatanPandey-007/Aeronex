import React from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, ShieldAlert, Cpu, X } from 'lucide-react';
import { useMission } from '../../context/MissionContext';

export const DroneRerouteModal: React.FC = () => {
  const { 
    isRerouteModalOpen, 
    setIsRerouteModalOpen, 
    alerts, 
    acceptRerouteRecommendation,
  } = useMission();

  if (!isRerouteModalOpen) return null;

  const criticalFloodAlert = alerts.find(a => a.id === 'ALT-2026-0814-01');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-mono">
      <div className="bg-[#0D131D] rounded-2xl max-w-2xl w-full border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="bg-[#111925] text-white p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF3B4E]/20 border border-[#FF3B4E] flex items-center justify-center text-[#FF3B4E]">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#FF3B4E] bg-[#FF3B4E]/20 px-2 py-0.5 rounded border border-[#FF3B4E]/30">
                  CRITICAL HAZARD INTERSECTION
                </span>
                <span className="text-xs text-slate-400">MISSION-04 RISK ASSESSMENT</span>
              </div>
              <h2 className="text-base font-black text-[#F8FAFC] mt-1">
                AERONEX Autonomous Risk Mitigator
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsRerouteModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Intelligence Logic Pipeline Display */}
        <div className="bg-[#070B12] border-b border-white/5 p-4">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            INTELLIGENCE WORKFLOW PIPELINE
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="bg-[#FF3B4E]/20 text-[#FF3B4E] px-2 py-0.5 rounded border border-[#FF3B4E]/30 font-bold">ALERT INGESTED</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="bg-[#FF9F1C]/20 text-[#FF9F1C] px-2 py-0.5 rounded border border-[#FF9F1C]/30 font-bold">POLYGON INTERSECT</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="bg-[#38BDF8]/20 text-[#38BDF8] px-2 py-0.5 rounded border border-[#38BDF8]/30 font-bold">RISK ASSESSED</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="bg-[#22C55E]/20 text-[#22C55E] px-2 py-0.5 rounded border border-[#22C55E]/30 font-bold">OPTIMAL CORRIDOR</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {/* Comparison Cards: Current Corridor vs Recommended Corridor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Route (High Risk) */}
            <div className="p-4 rounded-xl border border-[#FF3B4E]/30 bg-[#FF3B4E]/10">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-[#FF3B4E]">CURRENT FLIGHT CORRIDOR</span>
                <span className="px-2 py-0.5 bg-[#FF3B4E]/30 text-[#FF3B4E] font-bold rounded text-[10px]">
                  RISK: HIGH
                </span>
              </div>
              <ul className="space-y-2 text-xs text-rose-200">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#FF3B4E] font-bold">•</span>
                  <span>Intersects 4.8 km² expanding flood surge</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#FF3B4E] font-bold">•</span>
                  <span>Turbulent crosswinds & spray (54 km/h)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#FF3B4E] font-bold">•</span>
                  <span>Estimated Battery Drain: +14%</span>
                </li>
              </ul>
            </div>

            {/* Recommended Route (Clearance) */}
            <div className="p-4 rounded-xl border border-[#22C55E]/30 bg-[#22C55E]/10">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-[#22C55E]">AERONEX RECOMMENDATION</span>
                <span className="px-2 py-0.5 bg-[#22C55E]/30 text-[#22C55E] font-bold rounded text-[10px]">
                  RISK: LOW
                </span>
              </div>
              <ul className="space-y-2 text-xs text-emerald-200">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#22C55E] font-bold">•</span>
                  <span>Shift Corridor: 1.8 km East along ridge</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#22C55E] font-bold">•</span>
                  <span>Full 650m terrain buffer from water line</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#22C55E] font-bold">•</span>
                  <span>Maintains FLIR coverage of Survivor S-01</span>
                </li>
              </ul>
            </div>
          </div>

          {/* AI Advisory Callout */}
          <div className="bg-[#111925] border border-white/10 text-slate-200 p-4 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between text-[#38BDF8] font-bold">
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#38BDF8]" />
                AERONEX AI FLIGHT PLANNER ADVISORY
              </span>
              <span className="text-[#22C55E]">CONFIDENCE: 98.2%</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              &quot;Shift Mission-04 search corridor 1.8 km East along higher contour ridge to circumvent flash flood surge. New flight path avoids low-altitude gorge turbulence and maintains thermal scanning over Sector 4 bamboo groves.&quot;
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setIsRerouteModalOpen(false)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-xs font-semibold transition-colors"
            >
              REVIEW MANUALLY LATER
            </button>

            <button
              onClick={() => {
                if (criticalFloodAlert) {
                  acceptRerouteRecommendation(criticalFloodAlert.id);
                }
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#22C55E] hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>ACCEPT & REROUTE MISSION-04</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
