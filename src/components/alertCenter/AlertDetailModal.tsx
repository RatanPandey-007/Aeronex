import React from 'react';
import { 
  X, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Users, 
  Wind, 
  CloudRain, 
  Radio, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert,
  Maximize2,
  Compass,
  Layers
} from 'lucide-react';
import { DisasterAlert } from '../../types/alert';
import { SeverityBadge } from '../common/Badge';
import { useMission } from '../../context/MissionContext';
import { OperationsMap } from '../map/OperationsMap';

export interface AlertDetailModalProps {
  alert: DisasterAlert | null;
  onClose: () => void;
  onOpenFullMap: () => void;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({ 
  alert, 
  onClose, 
  onOpenFullMap 
}) => {
  const { acceptRerouteRecommendation, setIsRerouteModalOpen } = useMission();

  if (!alert) return null;

  const isCritical = alert.severity === 'CRITICAL';
  const hasImpact = Boolean(alert.missionImpact);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      {/* Primary Intelligence Sheet Container: Strict max-w-[1100px], max-h-[90vh], overflow-hidden */}
      <div className="bg-[#0D131D] rounded-2xl max-w-[1100px] w-full max-h-[90vh] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
        {/* Intelligence Sheet Header */}
        <header className="p-5 sm:p-6 bg-[#111925] border-b border-white/10 flex items-start justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <SeverityBadge severity={alert.severity} />
              <span className="text-xs font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/20">
                {alert.id}
              </span>
              <span className="text-xs font-mono text-slate-400">
                FEED: {alert.sourceAgency}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#F8FAFC]">
              {alert.title}
            </h2>

            <div className="flex items-center gap-2 text-xs text-[#94A3B8] font-mono">
              <MapPin className="w-3.5 h-3.5 text-[#FF3B4E]" />
              <span>{alert.regionName}, {alert.state}</span>
              <span>•</span>
              <span>ISSUED: {alert.issuedAt}</span>
              <span>•</span>
              <span>WINDOW: {alert.expectedDurationHours} HOURS</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
            title="Close Sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Scrollable Intelligence Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Top Embedded Map Preview Container (Strictly contained, 300px, border-radius 16px) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Compass className="w-4 h-4 text-[#38BDF8]" />
                <span className="font-bold">TACTICAL GEOGRAPHIC PREVIEW</span>
                <span className="text-slate-500">| Strictly contained preview</span>
              </div>

              {/* [ OPEN FULL MAP ] Button */}
              <button
                onClick={onOpenFullMap}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30 font-bold transition-colors shadow-sm"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>OPEN FULL MAP</span>
              </button>
            </div>

            {/* Embedded Map Window: Strictly height 300px, overflow-hidden, rounded-2xl */}
            <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#070B12] shadow-inner relative">
              <OperationsMap heightClass="h-[300px]" focusAlertId={alert.id} />
            </div>
          </div>

          {/* Quick Metrics KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#111925] border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase block">Hazard Area</span>
              <span className="text-base font-bold text-[#F8FAFC] mt-0.5 block">{alert.affectedAreaKm2} km²</span>
              <span className="text-[10px] text-slate-500 block">Polygon Perimeter</span>
            </div>

            <div className="p-3 rounded-xl bg-[#111925] border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase block">Population At Risk</span>
              <span className="text-base font-bold text-[#FF9F1C] mt-0.5 block">{alert.populationAtRisk.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 block">Census Vulnerability</span>
            </div>

            <div className="p-3 rounded-xl bg-[#111925] border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase block">Precipitation Rate</span>
              <span className="text-base font-bold text-[#38BDF8] mt-0.5 block">{alert.weatherConditions.rainfallMmHr} mm/hr</span>
              <span className="text-[10px] text-slate-500 block">Doppler Radar Sensor</span>
            </div>

            <div className="p-3 rounded-xl bg-[#111925] border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase block">Wind Shear Gusts</span>
              <span className="text-base font-bold text-amber-400 mt-0.5 block">{alert.weatherConditions.windGustKmh} km/h</span>
              <span className="text-[10px] text-slate-500 block">Ceiling Impact: 60m</span>
            </div>
          </div>

          {/* ⭐ MISSION IMPACT & AERONEX INTELLIGENCE REROUTE ADVISORY */}
          {hasImpact && alert.missionImpact ? (
            <div className="p-5 rounded-2xl border border-[#FF3B4E]/40 bg-[#151E2B] shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FF3B4E]/20 border border-[#FF3B4E] flex items-center justify-center text-[#FF3B4E]">
                    <ShieldAlert className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#FF3B4E] uppercase tracking-wider block">
                      MISSION IMPACT DETECTED
                    </span>
                    <h3 className="text-sm font-bold text-[#F8FAFC]">
                      {alert.missionImpact.affectedMissionId} ({alert.missionImpact.affectedDroneId}) Collision Corridor
                    </h3>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#FF3B4E]/20 text-[#FF3B4E] border border-[#FF3B4E]/30">
                  RISK LEVEL: {alert.missionImpact.riskLevel}
                </span>
              </div>

              <p className="text-xs font-mono text-slate-300 leading-relaxed">
                {alert.missionImpact.impactDescription}
              </p>

              {/* Reroute Recommendation Box */}
              <div className="p-4 rounded-xl bg-[#0D131D] border border-white/10 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-[#38BDF8] font-bold">
                  <span>AERONEX INTELLIGENCE ADVISORY:</span>
                  <span className="text-emerald-400 font-bold">FEASIBILITY: 100%</span>
                </div>

                <p className="text-[#F8FAFC] text-sm font-bold">
                  &quot;{alert.missionImpact.recommendedAction}&quot;
                </p>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[11px] text-slate-400">
                  <div>
                    <span>Corridor Conflict:</span>{' '}
                    <strong className="text-white">{alert.missionImpact.corridorIntersectionKm2} km²</strong>
                  </div>
                  <div>
                    <span>Battery Delta:</span>{' '}
                    <strong className="text-amber-400">+{alert.missionImpact.batteryImpactPercent}% Drain</strong>
                  </div>
                  <div>
                    <span>Terrain Buffer:</span>{' '}
                    <strong className="text-emerald-400">650m East Clearance</strong>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-1">
                <button
                  onClick={() => setIsRerouteModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-mono font-semibold transition-colors"
                >
                  REVIEW CORRIDOR SPLINE
                </button>

                <button
                  onClick={() => {
                    acceptRerouteRecommendation(alert.id);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#22C55E] hover:bg-emerald-600 text-white text-xs font-mono font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ACCEPT & REROUTE MISSION-04</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#111925] border border-white/5 text-xs font-mono text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>All active drone corridors remain safely clear of this hazard perimeter.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="p-4 bg-[#111925] border-t border-white/10 flex items-center justify-between shrink-0 font-mono text-xs">
          <span className="text-slate-500">
            AERONEX DISASTER INTELLIGENCE PROTOCOL V2.4
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold transition-colors"
          >
            Close Sheet
          </button>
        </footer>
      </div>
    </div>
  );
};
