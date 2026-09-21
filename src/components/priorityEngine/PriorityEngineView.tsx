import React, { useState } from 'react';
import { 
  Sliders, 
  ShieldAlert, 
  Send, 
  ArrowRight,
  Activity
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { Survivor, SurvivorPriority } from '../../types/survivor';
import { PriorityBadge, SurvivorStatusBadge } from '../common/Badge';

export const PriorityEngineView: React.FC = () => {
  const { survivors, setSelectedSurvivor, dispatchRescue } = useMission();
  const [selectedSurvivorForRation, setSelectedSurvivorForRation] = useState<Survivor>(survivors[0]);

  const tiers: { id: SurvivorPriority; title: string; desc: string }[] = [
    {
      id: 'CRITICAL',
      title: 'CRITICAL RESPONSE TIER (IMMEDIATE EXTIRPATION)',
      desc: 'Severe environmental hazard immersion, trauma, or immobility. Life-threatening threshold under 30 minutes.',
    },
    {
      id: 'HIGH',
      title: 'HIGH PRIORITY TIER (PRE-EMPTIVE RESCUE)',
      desc: 'Trapped under structural debris or rising flood margins. Stable vitals but high secondary risk.',
    },
    {
      id: 'MEDIUM',
      title: 'MEDIUM PRIORITY TIER (SUPPORT & MONITORED EVACUATION)',
      desc: 'Safe elevation, active signaling, no immediate flood inundation threat.',
    },
    {
      id: 'MONITOR',
      title: 'MONITORING & POST-RESCUE CARE TIER',
      desc: 'Evacuated victims receiving base camp triage or standing by for transport.',
    },
  ];

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B4E] animate-ping" />
            <h1 className="text-2xl font-black tracking-tight text-[#F8FAFC]">
              RESCUE PRIORITY ENGINE // TACTICAL DISPATCH QUEUE
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Algorithmic priority queue evaluated across environmental hazard velocity, immobility duration, and rescue asset transit distance
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="px-3.5 py-1.5 rounded-xl bg-[#0D131D] border border-white/10 text-slate-300 shadow-md font-bold">
            EVALUATION CYCLE: 5 SECONDS (ACTIVE)
          </span>
        </div>
      </div>

      {/* Main Grid: Priority Queue (7 cols) + Scoring Rationale (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Operational Priority Queue by Tier */}
        <div className="lg:col-span-7 space-y-6">
          {tiers.map((tier) => {
            const tierSurvivors = survivors.filter((s) => s.priority === tier.id);
            if (tierSurvivors.length === 0) return null;

            return (
              <div key={tier.id} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      tier.id === 'CRITICAL' ? 'bg-[#FF3B4E]' : tier.id === 'HIGH' ? 'bg-[#FF9F1C]' : tier.id === 'MEDIUM' ? 'bg-[#F6C945]' : 'bg-slate-500'
                    }`} />
                    <h3 className="text-xs font-black tracking-wider text-[#F8FAFC]">
                      {tier.title}
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">
                    {tierSurvivors.length} Victim{tierSurvivors.length > 1 ? 's' : ''}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">
                  {tier.desc}
                </p>

                {/* Queue Cards */}
                <div className="space-y-2 mt-2">
                  {tierSurvivors.map((survivor) => {
                    const isSelected = selectedSurvivorForRation.id === survivor.id;

                    return (
                      <div
                        key={survivor.id}
                        onClick={() => setSelectedSurvivorForRation(survivor)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xl flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'bg-[#151E2B] text-white border-[#38BDF8] ring-1 ring-[#38BDF8]/40'
                            : 'bg-[#0D131D] hover:bg-[#111925] border-white/5 hover:border-white/15 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`text-sm font-black px-2 py-1 rounded ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-[#111925] text-[#38BDF8] border border-white/10'
                          }`}>
                            {survivor.code}
                          </span>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold truncate">
                                {survivor.zone}
                              </h4>
                              <SurvivorStatusBadge status={survivor.status} />
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                              <span>ETA: {survivor.nearestRescueTeam.etaMinutes}m</span>
                              <span>•</span>
                              <span>Dist: {survivor.nearestRescueTeam.distanceKm}km</span>
                              <span>•</span>
                              <span className="text-[#22C55E] font-bold">
                                {survivor.aiVerification.fusedConfidence}% AI
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSurvivor(survivor);
                            }}
                            className="p-2 rounded-xl text-xs font-bold bg-[#111925] border border-white/10 text-[#38BDF8] hover:bg-white/10 transition-colors"
                            title="Inspect Survivor Packet"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Survivor Priority Scoring Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0D131D] rounded-2xl border border-white/10 shadow-2xl p-5 space-y-5">
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-xs font-bold text-[#38BDF8] uppercase">
                  PRIORITY ENGINE RATIONALE
                </span>
                <h3 className="text-base font-bold text-[#F8FAFC] mt-0.5">
                  Victim {selectedSurvivorForRation.code} Scoring Breakdown
                </h3>
              </div>
              <PriorityBadge priority={selectedSurvivorForRation.priority} />
            </div>

            {/* Why the system assigned this priority */}
            <div className="space-y-3 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                EVALUATED TACTICAL VECTORS
              </span>

              <div className="space-y-2">
                {selectedSurvivorForRation.priorityFactors.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#111925] border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        f.severity === 'critical' ? 'bg-[#FF3B4E]' : f.severity === 'warning' ? 'bg-[#FF9F1C]' : 'bg-[#38BDF8]'
                      }`} />
                      <span className="text-slate-300 font-medium">{f.label}</span>
                    </div>
                    <span className="font-bold text-white">{f.weight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Algorithmic Weights Summary */}
            <div className="p-4 rounded-2xl bg-[#070B12] border border-white/10 text-xs space-y-3">
              <div className="flex items-center justify-between text-[#38BDF8] font-bold">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  RESCUE URGENCY FORMULA
                </span>
                <span>CALCULATED</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Score = (Hazard Proximity × 0.40) + (Immobility Duration × 0.30) + (Vitals Anomaly × 0.20) - (Rescue ETA × 0.10)
              </p>
              <div className="pt-2 border-t border-white/10 flex justify-between items-center text-white">
                <span>Net Urgency Index:</span>
                <span className="text-base font-black text-[#FF3B4E]">92.4 / 100 (HIGH CRITICALITY)</span>
              </div>
            </div>

            {/* Dispatch Action */}
            <div className="pt-2">
              <button
                onClick={() => dispatchRescue(selectedSurvivorForRation.id)}
                disabled={selectedSurvivorForRation.status === 'RESCUE_DISPATCHED'}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-lg ${
                  selectedSurvivorForRation.status === 'RESCUE_DISPATCHED'
                    ? 'bg-white/10 text-slate-500 cursor-not-allowed'
                    : 'bg-[#FF3B4E] hover:bg-rose-600 text-white animate-pulse'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>
                  {selectedSurvivorForRation.status === 'RESCUE_DISPATCHED'
                    ? 'Unit Dispatched to Location'
                    : `Dispatch ${selectedSurvivorForRation.nearestRescueTeam.teamName}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
