import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Flame, 
  Cpu, 
  Send, 
  ArrowRight 
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { Survivor } from '../../types/survivor';
import { PriorityBadge, SurvivorStatusBadge } from '../common/Badge';
import { SurvivorPacketModal } from './SurvivorPacketModal';
import { AiVerificationView } from './AiVerificationView';

export const SurvivorListView: React.FC = () => {
  const { 
    survivors, 
    selectedSurvivor, 
    setSelectedSurvivor, 
  } = useMission();

  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSurvivors = survivors.filter((s) => {
    if (priorityFilter !== 'ALL' && s.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.code.toLowerCase().includes(q) ||
        s.zone.toLowerCase().includes(q) ||
        s.mgrsGrid.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B4E] animate-ping" />
            <h1 className="text-2xl font-black tracking-tight text-[#F8FAFC]">
              SURVIVOR INTELLIGENCE CENTER
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Real-time thermal/optical detections, neural verification confidence, and triage assessment
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#0D131D] border border-white/10 text-slate-300 shadow-md font-bold">
            LOCALIZED: {survivors.length} TOTAL • 2 CRITICAL
          </div>
        </div>
      </div>

      {/* AI Verification Pipeline Strip */}
      <AiVerificationView />

      {/* Filter and Search Bar */}
      <div className="bg-[#0D131D] p-4 rounded-2xl border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search code (S-01), zone, or MGRS grid..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-mono text-white placeholder:text-slate-500 focus:outline-hidden bg-transparent"
          />
        </div>

        {/* Priority Filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-bold mr-1">PRIORITY:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'MONITOR'].map((pri) => (
            <button
              key={pri}
              onClick={() => setPriorityFilter(pri)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                priorityFilter === pri
                  ? 'bg-[#38BDF8] text-slate-950 shadow-md'
                  : 'bg-[#111925] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {pri}
            </button>
          ))}
        </div>
      </div>

      {/* Survivor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSurvivors.map((survivor) => {
          const isCritical = survivor.priority === 'CRITICAL';
          const isDispatched = survivor.status === 'RESCUE_DISPATCHED';

          return (
            <div
              key={survivor.id}
              onClick={() => setSelectedSurvivor(survivor)}
              className="bg-[#0D131D] rounded-2xl border border-white/10 hover:border-white/25 hover:bg-[#111925] transition-all cursor-pointer shadow-xl p-5 flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black font-mono px-2 py-0.5 rounded bg-[#111925] text-[#38BDF8] border border-white/10 group-hover:border-[#38BDF8]/40 transition-colors">
                      {survivor.code}
                    </span>
                    <PriorityBadge priority={survivor.priority} />
                  </div>
                  <SurvivorStatusBadge status={survivor.status} />
                </div>

                {/* Location & Time */}
                <div className="mt-3">
                  <h3 className="text-sm font-bold text-[#F8FAFC] leading-snug group-hover:text-[#38BDF8] transition-colors">
                    {survivor.zone}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{survivor.detectedAt}</span>
                    <span>•</span>
                    <span>{survivor.mgrsGrid}</span>
                  </div>
                </div>

                {/* Confidence Bar & Vitals */}
                <div className="mt-4 p-3 rounded-xl bg-[#111925] border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">AI Confidence</span>
                    <span className="font-bold text-[#F8FAFC]">{survivor.aiVerification.fusedConfidence}%</span>
                  </div>
                  <div className="w-full bg-[#070B12] rounded-full h-1.5 overflow-hidden border border-white/5">
                    <div 
                      className="bg-[#22C55E] h-1.5 rounded-full" 
                      style={{ width: `${survivor.aiVerification.fusedConfidence}%` }} 
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                    <span>Heat: <strong className="text-white">{survivor.temperatureC}°C</strong></span>
                    <span>State: <strong className="text-[#FF3B4E]">{survivor.movementStatus}</strong></span>
                  </div>
                </div>

                {/* Nearest Rescue Asset */}
                <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
                  <span>Nearest Team:</span>
                  <span className="font-bold text-white">{survivor.nearestRescueTeam.teamName} ({survivor.nearestRescueTeam.distanceKm} km)</span>
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="font-bold text-[#38BDF8] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>Open Intelligence Packet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>

                {isDispatched && (
                  <span className="text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/15 px-2 py-0.5 rounded border border-[#22C55E]/30">
                    DISPATCHED
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Survivor Packet Modal */}
      <SurvivorPacketModal
        survivor={selectedSurvivor}
        onClose={() => setSelectedSurvivor(null)}
      />
    </div>
  );
};
