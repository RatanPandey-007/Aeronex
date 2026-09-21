import React from 'react';
import { 
  ShieldAlert, 
  Radio, 
  MapPin, 
  Users, 
  ArrowRight, 
  PlayCircle, 
  Sparkles, 
  Activity, 
  AlertTriangle, 
  Clock, 
  Compass, 
  CheckCircle2, 
  TrendingUp, 
  Crosshair, 
  Layers, 
  Cpu, 
  ChevronRight,
  Wind,
  Waves
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { DroneVisual } from '../hero/DroneVisual';
import { TacticalMapLibre } from '../map/TacticalMapLibre';
import { WorkflowSection } from '../hero/WorkflowSection';
import { HardwareShowcase } from '../hero/HardwareShowcase';

export const OverviewDashboard: React.FC = () => {
  const { 
    setActiveTab, 
    currentMission, 
    primaryDrone, 
    survivors, 
    alerts, 
    startDemo, 
    isDemoActive,
    setIsRerouteModalOpen,
    setSelectedSurvivor,
    setSelectedAlert
  } = useMission();

  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL');
  const verifiedSurvivors = survivors.filter(s => s.status === 'VERIFIED');

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* 1. TOP OPERATIONAL NOTICE / SITUATION SUMMARY                 */}
      {/* ============================================================ */}
      <div className="bg-[#0C121B] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[#E53935] shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white font-mono">INCIDENT: LANDSLIDE & FLASH FLOOD CORRIDOR</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-[#E53935] font-mono font-bold border border-red-500/40">
                ACTIVE INCIDENT
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              NDRF Battalion 04 & State Disaster Management Authority coordinating real-time autonomous aerial search via AERONEX.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-mono">
          <button
            onClick={() => setActiveTab('mission-control')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md group"
          >
            <span>ENTER MISSION CONTROL</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => setActiveTab('replay')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#101722] hover:bg-[#182230] border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-colors shadow-sm"
          >
            <PlayCircle className="w-3.5 h-3.5 text-[#35C8FF]" />
            <span className="hidden sm:inline">WATCH REPLAY</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. PRIMARY 3-COLUMN COMMAND VIEWPORT                          */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* ------------------------------------------------------------ */}
        {/* COLUMN 1 (LEFT, 3 cols): ACTIVE MISSION BRIEFING             */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-3 flex flex-col justify-between bg-[#0C121B] border border-white/10 rounded-2xl p-4 shadow-xl space-y-4 font-mono">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                ACTIVE MISSION BRIEF
              </span>
              <span className="text-[10px] text-[#22C55E] bg-[#22C55E]/15 border border-[#22C55E]/30 px-1.5 py-0.5 rounded font-bold">
                ACTIVE DEPLOYMENT
              </span>
            </div>

            <div className="mt-3 space-y-1">
              <h2 className="text-base font-black tracking-tight text-white font-sans">
                {currentMission.name}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-[#35C8FF]">
                <MapPin className="w-3.5 h-3.5 text-[#E53935]" />
                <span>{currentMission.locationName}, {currentMission.state}</span>
              </div>
            </div>

            {/* Grid Coverage Progress Bar */}
            <div className="mt-4 p-3 rounded-xl bg-[#101722] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Search Grid Target</span>
                <span className="text-white font-bold">
                  {Math.round((currentMission.searchedAreaKm2 / currentMission.totalAreaKm2) * 100)}% ({currentMission.searchedAreaKm2} / {currentMission.totalAreaKm2} km²)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-sky-500 to-[#22C55E] rounded-full transition-all duration-500"
                  style={{ width: `${(currentMission.searchedAreaKm2 / currentMission.totalAreaKm2) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>EST. COMPLETION:</span>
                <span className="text-[#22C55E] font-bold">~{currentMission.estimatedCompletionMinutes} MIN REMAINING</span>
              </div>
            </div>

            {/* Mission Key Objectives */}
            <div className="mt-4 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">
                Active Objectives:
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-start gap-2 text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>FLIR thermal survey of Sector Alpha riverbank</span>
                </div>
                <div className="flex items-start gap-2 text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>Survivor detection & automated triage triangulation</span>
                </div>
                <div className="flex items-start gap-2 text-slate-200">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 shrink-0 mt-0.5 animate-pulse" />
                  <span>Dynamic reroute around active flash flood surge</span>
                </div>
              </div>
            </div>

            {/* Coordinated Field Teams */}
            <div className="mt-4 space-y-2 pt-3 border-t border-white/5">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">
                Field Teams Coordinated:
              </span>
              <div className="space-y-1 text-[11px] text-slate-300">
                <div className="flex justify-between py-1 px-2 rounded bg-white/5">
                  <span className="text-purple-300 font-bold">NDRF TEAM ALPHA</span>
                  <span className="text-slate-400">8 Units (ETA 12m)</span>
                </div>
                <div className="flex justify-between py-1 px-2 rounded bg-white/5">
                  <span className="text-purple-300 font-bold">KERALA SDRF-02</span>
                  <span className="text-slate-400">Boat (On Station)</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('mission-control')}
            className="w-full py-2.5 rounded-xl bg-[#101722] hover:bg-[#182230] border border-white/10 text-xs font-bold text-slate-200 hover:text-white transition-colors flex items-center justify-center gap-2 mt-3"
          >
            <span>OPEN FULL MISSION CONTROL</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#35C8FF]" />
          </button>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* COLUMN 2 (CENTER, 6 cols): LARGE IMMERSIVE TACTICAL MAP      */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-6 flex flex-col bg-[#0C121B] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-3 border-b border-white/10 bg-[#080D14] flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#35C8FF]" />
              <span className="font-bold text-white">LIVE GEOSPATIAL SEARCH CORRIDOR</span>
            </div>
            <span className="text-[11px] text-slate-400">CHALIYAR BASIN GRID</span>
          </div>

          {/* Interactive Tactical MapLibre */}
          <div className="flex-1 w-full min-h-[440px] sm:min-h-[480px]">
            <TacticalMapLibre heightClass="h-full min-h-[440px] sm:min-h-[480px]" />
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* COLUMN 3 (RIGHT, 3 cols): PHYSICAL 3D RESCUE DRONE & GAUGES  */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-3 flex flex-col bg-[#0C121B] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <DroneVisual />
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. BOTTOM OPERATIONAL COMMAND SECTION: STREAM / DETECTIONS    */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono">
        {/* Box 1: Live Event Stream Ticker */}
        <div className="bg-[#0C121B] border border-white/10 rounded-2xl p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
              <span className="font-bold text-white">LIVE OPERATIONAL FEED</span>
            </div>
            <span className="text-[10px] text-slate-400">REAL-TIME TELEMETRY</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2 rounded-xl bg-[#101722] border border-white/5 space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span className="text-[#35C8FF] font-bold">14:34:12 IST</span>
                <span className="text-[#22C55E] font-bold">FLIR BOSON CONFIRMED</span>
              </div>
              <p className="text-slate-200 text-[11px]">
                Thermal anomaly verified: S-01 (36.8°C signature) localized at 11.5342°N, 76.1284°E.
              </p>
            </div>

            <div className="p-2 rounded-xl bg-[#101722] border border-white/5 space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span className="text-[#35C8FF] font-bold">14:32:05 IST</span>
                <span className="text-[#FF3347] font-bold">CAP 1.2 WARNING</span>
              </div>
              <p className="text-slate-200 text-[11px]">
                SACHET flash flood surge polygon ingested. 48.2 m³/s crest predicted across Sector Alpha.
              </p>
            </div>

            <div className="p-2 rounded-xl bg-[#101722] border border-white/5 space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span className="text-[#35C8FF] font-bold">14:28:40 IST</span>
                <span className="text-[#F59E0B] font-bold">ROUTE OPTIMIZER</span>
              </div>
              <p className="text-slate-200 text-[11px]">
                Dynamic reroute calculated: Drone-01 corridor adjusted 420m west to maintain safety clearance.
              </p>
            </div>
          </div>
        </div>

        {/* Box 2: AI Detections & Verified Survivors */}
        <div className="bg-[#0C121B] border border-white/10 rounded-2xl p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-[#35C8FF]" />
              <span className="font-bold text-white">AI RESCUE DETECTIONS</span>
            </div>
            <span className="text-[10px] text-[#22C55E] font-bold">
              {verifiedSurvivors.length} VERIFIED
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {survivors.slice(0, 3).map((s) => (
              <div 
                key={s.id}
                onClick={() => {
                  setSelectedSurvivor(s);
                  setActiveTab('survivors');
                }}
                className="p-2.5 rounded-xl bg-[#101722] hover:bg-[#182230] border border-white/5 cursor-pointer transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      s.priority === 'CRITICAL' ? 'bg-red-500/20 text-[#FF3347]' : 'bg-amber-500/20 text-[#F59E0B]'
                    }`}>
                      {s.priority}
                    </span>
                    <span className="font-bold text-white">{s.id}</span>
                  </div>
                  <span className="text-[#22C55E] font-bold">
                    {(s.aiVerification.fusedConfidence * 100).toFixed(0)}% AI CONF
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>GRID: {s.mgrsGrid}</span>
                  <span>SURFACE: {s.aiVerification.thermalSurfaceTempC}°C</span>
                </div>
              </div>
            ))}

            <button
              onClick={() => setActiveTab('survivors')}
              className="w-full py-1.5 text-center text-xs text-[#35C8FF] hover:underline"
            >
              View all survivor intelligence packets →
            </button>
          </div>
        </div>

        {/* Box 3: Recommended Operational Next Action */}
        <div className="bg-[#0C121B] border border-red-500/30 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-red-500/20 text-xs">
              <AlertTriangle className="w-4 h-4 text-[#FF3347]" />
              <span className="font-bold text-[#FF3347]">CRITICAL OPERATIONAL ADVISORY</span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="text-xs text-slate-200">
                <span className="font-bold text-white block mb-1">HAZARD INTERSECTION DETECTED:</span>
                Flash flood crest advancing at 2.4 m/s in Sector Alpha. Drone-01 current waypoint WP-03 intersects the turbulence boundary.
              </div>

              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-[11px] text-red-200">
                <strong>RECOMMENDED ACTION:</strong> Execute safe automated detour via WP-04 (+1.8km flight distance, +3m 40s mission duration).
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-white/5 flex items-center gap-2">
            <button
              onClick={() => setIsRerouteModalOpen(true)}
              className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-md text-center"
            >
              EXECUTE REROUTE ADVISORY
            </button>
            <button
              onClick={() => setActiveTab('alert-center')}
              className="p-2 rounded-xl bg-[#101722] hover:bg-[#182230] border border-white/10 text-slate-300 hover:text-white transition-colors"
              title="Open Alert Center"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. PRESERVED DEEP DIVE ARCHITECTURE & HARDWARE SECTIONS        */}
      {/* ============================================================ */}
      <div className="space-y-6 pt-4 border-t border-white/10">
        <WorkflowSection />
        <HardwareShowcase />
      </div>
    </div>
  );
};
