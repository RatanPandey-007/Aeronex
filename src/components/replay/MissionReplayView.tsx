import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  AlertTriangle, 
} from 'lucide-react';
import { OperationsMap } from '../map/OperationsMap';

interface ReplayEvent {
  timeStr: string;
  timeSec: number;
  title: string;
  category: 'DEPLOY' | 'SEARCH' | 'ALERT' | 'REROUTE' | 'DETECTION' | 'VERIFICATION' | 'DISPATCH';
  description: string;
  droneCoord: [number, number];
  altitudeM: number;
  speedMs: number;
  batteryPct: number;
  coveragePct: number;
  survivorsCount: number;
  activeAlertTitle?: string;
}

export const MissionReplayView: React.FC = () => {
  const replayMilestones: ReplayEvent[] = [
    {
      timeStr: '00:00',
      timeSec: 0,
      title: 'Autonomous Launch & Fleet Sortie',
      category: 'DEPLOY',
      description: 'Valkyrie-03 launched from Tactical Base Alpha pad. Ascended to 65m AGL with dual RTK GNSS lock.',
      droneCoord: [11.5200, 76.1000],
      altitudeM: 65,
      speedMs: 14.5,
      batteryPct: 98,
      coveragePct: 0,
      survivorsCount: 0,
    },
    {
      timeStr: '01:24',
      timeSec: 84,
      title: 'Autonomous Search Grid Initiated',
      category: 'SEARCH',
      description: 'Switched to Creeping Line sweep trajectory. 4K optical zoom and FLIR Boson thermal radiometric scanning engaged.',
      droneCoord: [11.5310, 76.1150],
      altitudeM: 64,
      speedMs: 14.2,
      batteryPct: 94,
      coveragePct: 15,
      survivorsCount: 0,
    },
    {
      timeStr: '03:16',
      timeSec: 196,
      title: 'SACHET Flash Flood Critical Alert Received',
      category: 'ALERT',
      description: 'Disaster early-warning feed ingested. Flash flood surge polygon intersecting search corridor at waypoint 4.',
      droneCoord: [11.5350, 76.1200],
      altitudeM: 65,
      speedMs: 14.0,
      batteryPct: 89,
      coveragePct: 35,
      survivorsCount: 0,
      activeAlertTitle: 'FLASH FLOOD SURGE (ZONE ALPHA)',
    },
    {
      timeStr: '04:08',
      timeSec: 248,
      title: 'Autonomous Route Reroute Accepted',
      category: 'REROUTE',
      description: 'Shifted search corridor 1.8 km East along ridgeline. Avoided turbulent river spray and cleared hazard boundary by 650m.',
      droneCoord: [11.5365, 76.1265],
      altitudeM: 64,
      speedMs: 14.8,
      batteryPct: 85,
      coveragePct: 48,
      survivorsCount: 0,
    },
    {
      timeStr: '05:32',
      timeSec: 332,
      title: 'Survivor S-01 Thermal Anomaly Detected',
      category: 'DETECTION',
      description: 'FLIR Boson identified human heat differential (+14.8°C) trapped in river sandbar root cluster.',
      droneCoord: [11.5385, 76.1330],
      altitudeM: 62,
      speedMs: 8.5,
      batteryPct: 80,
      coveragePct: 62,
      survivorsCount: 1,
    },
    {
      timeStr: '06:04',
      timeSec: 364,
      title: 'Multi-Frame AI Verification Confirmed',
      category: 'VERIFICATION',
      description: 'NVIDIA Jetson Orin edge detector verified morphology across 15 consecutive frames (96.4% confidence).',
      droneCoord: [11.5385, 76.1330],
      altitudeM: 60,
      speedMs: 0.0,
      batteryPct: 78,
      coveragePct: 68,
      survivorsCount: 1,
    },
    {
      timeStr: '07:20',
      timeSec: 440,
      title: 'Tactical Rescue Unit Dispatched',
      category: 'DISPATCH',
      description: 'MGRS coordinates transmitted to NDRF Quick Response Team Bravo-02 with motorized watercraft (ETA: 8 min).',
      droneCoord: [11.5385, 76.1330],
      altitudeM: 64,
      speedMs: 12.0,
      batteryPct: 75,
      coveragePct: 68,
      survivorsCount: 1,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const currentMilestone = replayMilestones[currentIndex];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev < replayMilestones.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, 2800 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, replayMilestones.length]);

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-ping" />
            <h1 className="text-2xl font-black tracking-tight text-[#F8FAFC]">
              MISSION REPLAY // CINEMATIC TIMELINE
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Step-by-step forensic replay of flight telemetry, hazard avoidance rerouting, and AI victim detection
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 bg-[#0D131D] px-3 py-1.5 rounded-xl border border-white/10 shadow-md">
            SORTIE: MS-2026-0814-WAYANAD (TELEMETRY LOG)
          </span>
        </div>
      </div>

      {/* Main Map Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Map with Synchronized Position (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between bg-[#0D131D] px-4 py-2 rounded-xl border border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#F8FAFC]">SYNCHRONIZED TACTICAL MAP</span>
              <span className="text-slate-500">|</span>
              <span className="text-[#38BDF8]">TIME: {currentMilestone.timeStr}</span>
            </div>
            <span className="text-slate-400">
              ALT: {currentMilestone.altitudeM}m • SPD: {currentMilestone.speedMs} m/s
            </span>
          </div>

          <OperationsMap heightClass="h-[520px]" />
        </div>

        {/* Right: Milestone Event Information (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0D131D] rounded-2xl border border-white/10 shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-bold text-[#38BDF8] uppercase">
                ACTIVE REPLAY MILESTONE {currentIndex + 1} OF {replayMilestones.length}
              </span>
              <span className="text-xs font-bold text-[#F8FAFC] bg-[#111925] px-2.5 py-0.5 rounded-lg border border-white/10">
                T+{currentMilestone.timeStr}
              </span>
            </div>

            {/* Event Details */}
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC]">
                {currentMilestone.title}
              </h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed font-sans">
                {currentMilestone.description}
              </p>
            </div>

            {/* Telemetry at Milestone */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
              <div className="p-3 rounded-xl bg-[#111925] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Battery Level</span>
                <span className="text-sm font-bold text-[#22C55E]">{currentMilestone.batteryPct}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#111925] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Sweep Coverage</span>
                <span className="text-sm font-bold text-[#38BDF8]">{currentMilestone.coveragePct}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#111925] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Survivors Located</span>
                <span className="text-sm font-bold text-[#FF3B4E]">{currentMilestone.survivorsCount} Verified</span>
              </div>
              <div className="p-3 rounded-xl bg-[#111925] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Airspeed</span>
                <span className="text-sm font-bold text-white">{currentMilestone.speedMs} m/s</span>
              </div>
            </div>

            {currentMilestone.activeAlertTitle && (
              <div className="p-3 rounded-xl bg-[#FF3B4E]/15 border border-[#FF3B4E]/30 text-xs text-[#FF3B4E] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{currentMilestone.activeAlertTitle} INGESTED</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cinematic Timeline Scrubber & Playback Controls */}
      <div className="bg-[#0D131D] rounded-2xl border border-white/10 p-5 shadow-2xl space-y-4">
        {/* Playback Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-md"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'PAUSE REPLAY' : 'PLAY REPLAY'}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentIndex(0);
              }}
              className="p-2 rounded-xl bg-[#111925] border border-white/10 hover:bg-white/5 text-slate-300 transition-colors"
              title="Reset to 00:00"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Speed Options */}
            <div className="flex items-center gap-1 ml-2 text-xs">
              {[1, 2, 4].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                    playbackSpeed === speed
                      ? 'bg-[#38BDF8] text-slate-950'
                      : 'bg-[#111925] text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-400">
            CURRENT: <span className="font-bold text-white">{currentMilestone.timeStr}</span> / 07:20 TOTAL MISSION
          </div>
        </div>

        {/* Milestone Timeline Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {replayMilestones.map((m, idx) => {
            const isSelected = currentIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentIndex(idx);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#151E2B] border-[#38BDF8] ring-1 ring-[#38BDF8]/40 shadow-md'
                    : 'bg-[#111925] border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold ${isSelected ? 'text-[#38BDF8]' : 'text-slate-400'}`}>
                    {m.timeStr}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />}
                </div>
                <span className="text-[11px] font-bold text-slate-200 block truncate mt-1">
                  {m.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
