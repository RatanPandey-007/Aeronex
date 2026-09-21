import React from 'react';
import { 
  ShieldAlert, 
  Radio, 
  ArrowRight, 
  PlayCircle, 
  Sparkles, 
  Activity, 
  MapPin, 
  Users,
  Compass,
  AlertTriangle
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { DroneVisual } from './DroneVisual';

export const HeroSection: React.FC = () => {
  const { setActiveTab, startDemo, alerts, survivors } = useMission();
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const verifiedSurvivors = survivors.filter(s => s.status === 'VERIFIED').length;

  return (
    <section className="relative overflow-hidden pt-4 pb-12 sm:pt-8 sm:pb-16 bg-[#070B12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Operational Pill Row */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111925] border border-white/10 text-white text-xs font-mono font-medium shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="font-bold text-[#F8FAFC]">LIVE EMERGENCY NETWORK</span>
            <span className="text-white/10">•</span>
            <span className="text-[#38BDF8]">SACHET CONNECTED</span>
          </div>

          <div 
            onClick={() => setActiveTab('alert-center')}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF3B4E]/15 border border-[#FF3B4E]/30 text-[#FF3B4E] text-xs font-mono font-bold cursor-pointer hover:bg-[#FF3B4E]/25 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{criticalCount} CRITICAL DISASTER ALERTS ACTIVE</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#94A3B8] text-xs font-mono">
            <span>SECTOR: WAYANAD CHALIYAR BASIN</span>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#38BDF8] uppercase font-mono block mb-2">
                AERONEX // AUTONOMOUS EMERGENCY RESPONSE
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F8FAFC] tracking-tight leading-[1.1]">
                Autonomous Intelligence for Emergency Search & Rescue
              </h1>
              <p className="mt-4 text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-xl font-sans">
                From disaster detection to survivor localization, AERONEX connects autonomous aerial search, edge AI thermal computer vision, and real-time field rescue coordination into one operational system.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono">
              <button
                onClick={() => setActiveTab('mission-control')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg hover:shadow-blue-500/25 group"
              >
                <span>ENTER MISSION CONTROL</span>
                <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('replay')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#111925] border border-white/10 text-[#F8FAFC] hover:bg-[#151E2B] text-xs font-bold transition-colors shadow-md"
              >
                <PlayCircle className="w-4 h-4 text-[#38BDF8]" />
                <span>WATCH MISSION REPLAY</span>
              </button>

              <button
                onClick={startDemo}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-[#FF9F1C]/15 border border-[#FF9F1C]/30 text-[#FF9F1C] hover:bg-[#FF9F1C]/25 text-xs font-bold transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#FF9F1C]" />
                <span>DEMO MODE</span>
              </button>
            </div>

            {/* Quick Live Telemetry Strip */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 font-mono">
              <div className="p-3 rounded-xl bg-[#111925] border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase">Area Searched</span>
                <span className="text-xl sm:text-2xl font-black text-[#F8FAFC]">42.8 <span className="text-xs font-normal text-slate-400">km²</span></span>
                <span className="text-[10px] text-[#22C55E] block mt-0.5">● 68.4% Grid Target</span>
              </div>
              <div className="p-3 rounded-xl bg-[#111925] border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase">Survivors Located</span>
                <span className="text-xl sm:text-2xl font-black text-[#F8FAFC]">{verifiedSurvivors} <span className="text-xs font-normal text-slate-400">verified</span></span>
                <span className="text-[10px] text-[#38BDF8] block mt-0.5">● 96.4% AI Confidence</span>
              </div>
              <div className="p-3 rounded-xl bg-[#111925] border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase">Mean Response</span>
                <span className="text-xl sm:text-2xl font-black text-[#F8FAFC]">8.4 <span className="text-xs font-normal text-slate-400">min</span></span>
                <span className="text-[10px] text-[#22C55E] block mt-0.5">● -64% vs manual SAR</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Rescue Drone Visual */}
          <div className="lg:col-span-6">
            <DroneVisual />
          </div>
        </div>
      </div>
    </section>
  );
};
