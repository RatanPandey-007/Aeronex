import React from 'react';
import { 
  Radio, 
  MapPin, 
  Users, 
  Pause, 
  Play, 
  RotateCcw, 
  BatteryCharging, 
  Wifi, 
  Gauge, 
  AlertTriangle,
  ShieldCheck,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { OperationsMap } from '../map/OperationsMap';

export const MissionControlView: React.FC = () => {
  const {
    missions,
    drones,
    survivors,
    currentMission,
    primaryDrone,
    pauseMission,
    resumeMission,
    emergencyReturnHome,
    recalculateRoute,
    setIsRerouteModalOpen,
    setActiveTab,
  } = useMission();

  const isPaused = currentMission.status === 'PAUSED';
  const isReturning = currentMission.status === 'RETURNING';

  const formatFlightTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Sector Callouts */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-ping" />
            <h1 className="text-2xl font-black tracking-tight text-[#F8FAFC]">
              MISSION CONTROL // LIVE OPERATIONS
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            OPERATIONAL SECTOR: WAYANAD CHALIYAR DRAINAGE BASIN • SORTIE ACTIVE
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('alert-center')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF3B4E]/15 border border-[#FF3B4E]/30 text-[#FF3B4E] text-xs font-bold hover:bg-[#FF3B4E]/25 transition-colors shadow-md"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>2 CRITICAL ALERTS</span>
          </button>
          <div className="px-3 py-1.5 rounded-xl bg-[#111925] border border-white/10 text-xs text-[#38BDF8] font-bold">
            RTK GNSS: ±1.8cm FIX
          </div>
        </div>
      </div>

      {/* Top 4 Operational KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-2xl bg-[#0D131D] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Active Missions
            </span>
            <span className="w-7 h-7 rounded-lg bg-[#111925] border border-white/5 text-[#38BDF8] flex items-center justify-center">
              <Radio className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#F8FAFC]">03</span>
            <span className="text-xs text-slate-500">of 5 deployed</span>
          </div>
          <span className="text-[10px] text-[#22C55E] block mt-1">
            ● Mission-04 Active Sweep
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D131D] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Fleet Status
            </span>
            <span className="w-7 h-7 rounded-lg bg-[#111925] border border-white/5 text-[#22C55E] flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#F8FAFC]">03</span>
            <span className="text-xs text-slate-500">Airborne / 2 Base</span>
          </div>
          <span className="text-[10px] text-[#38BDF8] block mt-1">
            MIMO Mesh: 24.8 Mbps
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D131D] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Survivors Located
            </span>
            <span className="w-7 h-7 rounded-lg bg-[#111925] border border-white/5 text-[#FF3B4E] flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#F8FAFC]">05</span>
            <span className="text-xs text-[#FF3B4E] font-bold">2 Critical</span>
          </div>
          <span className="text-[10px] text-[#38BDF8] block mt-1">
            S-01 Confirmed (96.4% AI)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D131D] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Area Swept
            </span>
            <span className="w-7 h-7 rounded-lg bg-[#111925] border border-white/5 text-purple-400 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#F8FAFC]">42.8</span>
            <span className="text-xs text-slate-500">km² cumulative</span>
          </div>
          <span className="text-[10px] text-[#22C55E] block mt-1">
            ● 68.4% of Zone Alpha Sweep
          </span>
        </div>
      </div>

      {/* Command Workspace: Left Info (3 cols), Center Map (6 cols), Right Telemetry (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Mission Overview & Sector Plan (3 cols) */}
        <div className="lg:col-span-3 space-y-4 font-mono">
          <div className="bg-[#0D131D] rounded-2xl border border-white/10 p-4 shadow-xl space-y-3">
            <div className="border-b border-white/5 pb-2">
              <span className="text-[10px] font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/20">
                {currentMission.code}
              </span>
              <h3 className="text-xs font-bold text-[#F8FAFC] mt-1.5 leading-snug">
                {currentMission.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {currentMission.locationName}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Drone:</span>
                <span className="font-bold text-[#F8FAFC]">{primaryDrone.callsign}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Search Pattern:</span>
                <span className="font-bold text-[#38BDF8]">{currentMission.pattern.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Efficiency:</span>
                <span className="font-bold text-[#22C55E]">{currentMission.searchEfficiencyHaPerMin} ha/min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Remaining Area:</span>
                <span className="font-bold text-white">{currentMission.remainingAreaKm2} km²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Est. Remaining:</span>
                <span className="font-bold text-amber-400">{currentMission.estimatedCompletionMinutes} min</span>
              </div>
            </div>

            {/* Sweep Coverage Bar */}
            <div className="pt-2 border-t border-white/5 space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Coverage:</span>
                <span className="text-[#22C55E] font-bold">68.4%</span>
              </div>
              <div className="w-full bg-[#111925] rounded-full h-2 overflow-hidden border border-white/5">
                <div className="bg-[#22C55E] h-2 rounded-full" style={{ width: '68.4%' }} />
              </div>
            </div>
          </div>

          {/* Tactical Control Buttons */}
          <div className="bg-[#0D131D] rounded-2xl border border-white/10 p-4 shadow-xl space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              FLIGHT COMMANDS
            </span>

            <button
              onClick={pauseMission}
              className={`w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-colors shadow-md ${
                isPaused
                  ? 'bg-[#22C55E] hover:bg-emerald-600 text-white'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              }`}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? 'RESUME SWEEP' : 'PAUSE MISSION'}</span>
            </button>

            <button
              onClick={emergencyReturnHome}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-[#FF3B4E]/15 hover:bg-[#FF3B4E]/25 text-[#FF3B4E] border border-[#FF3B4E]/30 transition-colors shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>EMERGENCY RTH</span>
            </button>

            <button
              onClick={() => setIsRerouteModalOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-md"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>RECALCULATE ROUTE</span>
            </button>
          </div>
        </div>

        {/* Center: Large Geospatial Map (6 cols, 60-70% visual focus) */}
        <div className="lg:col-span-6 space-y-2">
          <div className="flex items-center justify-between bg-[#0D131D] px-4 py-2 rounded-xl border border-white/10 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
              <span className="font-bold text-[#F8FAFC]">TACTICAL SITUATION MAP</span>
              <span className="text-slate-500">|</span>
              <span className="text-[#38BDF8]">ZONE ALPHA SWEEP</span>
            </div>
            <span className="text-slate-400">
              {primaryDrone.currentLocation[0].toFixed(4)}°N, {primaryDrone.currentLocation[1].toFixed(4)}°E
            </span>
          </div>

          <OperationsMap heightClass="h-[680px]" />
        </div>

        {/* Right Column: Live Telemetry Gauges (3 cols) */}
        <div className="lg:col-span-3 space-y-4 font-mono">
          <div className="bg-[#0D131D] rounded-2xl border border-white/10 p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                LIVE TELEMETRY
              </span>
              <span className="text-[10px] font-bold text-[#22C55E]">STREAMING</span>
            </div>

            <div className="space-y-2.5">
              {/* Altitude */}
              <div className="p-2.5 rounded-xl bg-[#111925] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Altitude (AGL)</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black text-[#F8FAFC]">{primaryDrone.telemetry.altitudeM}</span>
                  <span className="text-xs text-slate-400">meters</span>
                </div>
                <span className="text-[10px] text-slate-500 block">Terrain Clearance: 58m</span>
              </div>

              {/* Airspeed */}
              <div className="p-2.5 rounded-xl bg-[#111925] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Ground Speed</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black text-[#FF9F1C]">{primaryDrone.telemetry.groundSpeedMs}</span>
                  <span className="text-xs text-slate-400">m/s</span>
                </div>
                <span className="text-[10px] text-slate-500 block">Heading: {primaryDrone.telemetry.headingDeg}°</span>
              </div>

              {/* Battery */}
              <div className="p-2.5 rounded-xl bg-[#111925] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Battery & Voltage</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black text-[#22C55E]">{primaryDrone.telemetry.batteryPercent}%</span>
                  <span className="text-xs text-slate-400">({primaryDrone.telemetry.batteryVoltage}V)</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div className="bg-[#22C55E] h-1.5 rounded-full" style={{ width: `${primaryDrone.telemetry.batteryPercent}%` }} />
                </div>
              </div>

              {/* Radio Signal & Comms */}
              <div className="p-2.5 rounded-xl bg-[#111925] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Mesh Signal (RSSI)</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black text-[#38BDF8]">{primaryDrone.telemetry.linkQualityPercent}%</span>
                  <span className="text-xs text-slate-400">({primaryDrone.telemetry.signalRssiDbm} dBm)</span>
                </div>
                <span className="text-[10px] text-slate-500 block">Throughput: 24.8 Mbps AES</span>
              </div>
            </div>

            {/* Flight Duration */}
            <div className="p-2.5 rounded-xl bg-[#111925] border border-white/5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Sortie Duration:</span>
                <span className="font-bold text-white">{formatFlightTime(primaryDrone.telemetry.flightTimeSeconds)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
