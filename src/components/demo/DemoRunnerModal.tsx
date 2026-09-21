import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';

export const DemoRunnerModal: React.FC = () => {
  const { 
    isDemoActive, 
    demoStep, 
    nextDemoStep, 
    prevDemoStep, 
    stopDemo, 
    goToDemoStep 
  } = useMission();

  if (!isDemoActive) return null;

  const demoSteps = [
    {
      step: 1,
      title: 'STEP 01 // DISASTER ALERT',
      tag: 'DISASTER INGESTION',
      narrative: 'A critical Flash Flood Alert is ingested from India\'s SACHET / NDMA disaster alert network, warning of an immediate river surge in Zone Alpha.',
      actionText: 'Inspect Affected Region on Map',
    },
    {
      step: 2,
      title: 'STEP 02 // AFFECTED REGION',
      tag: 'GEOSPATIAL GIS',
      narrative: 'The platform highlights the 18.4 km² hazard boundary polygon and correlates it with all active drone flight corridors in the sector.',
      actionText: 'Correlate with Active Fleet',
    },
    {
      step: 3,
      title: 'STEP 03 // MISSION IDENTIFIED',
      tag: 'MISSION AUDIT',
      narrative: 'AERONEX detects that Mission-04 (flown by Valkyrie-03) has planned flight corridors directly intersecting the expanding flood surge perimeter.',
      actionText: 'Analyze Collision Risk',
    },
    {
      step: 4,
      title: 'STEP 04 // DRONE HAZARD RISK',
      tag: 'AI FLIGHT PLANNER',
      narrative: 'Flight corridor risk flagged as HIGH due to 54 km/h turbulent crosswinds and heavy water spray compromising the optical gimbal.',
      actionText: 'Generate Reroute Recommendation',
    },
    {
      step: 5,
      title: 'STEP 05 // ROUTE REPLANNED',
      tag: 'MAVLINK TELEMETRY',
      narrative: 'AERONEX AI generates an optimal corridor: "Shift Mission-04 search corridor 1.8 km East along ridge", clearing the flood boundary by 650m.',
      actionText: 'Accept & Shift Search Grid',
    },
    {
      step: 6,
      title: 'STEP 06 // SEARCH GRID EXECUTED',
      tag: 'SEARCH OPERATIONS',
      narrative: 'Valkyrie-03 commences Creeping Line autonomous sweep over safe Zone Alpha ridge, scanning with dual 4K optical and FLIR thermal LWIR.',
      actionText: 'Monitor Thermal Ingestion',
    },
    {
      step: 7,
      title: 'STEP 07 // SURVIVOR S-01 DETECTED',
      tag: 'SURVIVOR LOCALIZATION',
      narrative: 'FLIR Boson radiometric sensor identifies human body heat differential (+14.8°C) semi-submerged behind root wad on river sandbar.',
      actionText: 'Initiate Neural Verification',
    },
    {
      step: 8,
      title: 'STEP 08 // AI VERIFICATION CONFIRMED',
      tag: 'EDGE AI INFERENCE',
      narrative: 'NVIDIA Jetson Orin edge neural detector verifies morphology across 15 consecutive frames, confirming Survivor S-01 with 96.4% confidence.',
      actionText: 'Evaluate Priority Queue',
    },
    {
      step: 9,
      title: 'STEP 09 // RESCUE PRIORITY ASSIGNED',
      tag: 'PRIORITY ENGINE',
      narrative: 'Rescue Priority Engine assigns "CRITICAL PRIORITY" due to zero detected movement and flood surge water margin under 40 meters.',
      actionText: 'Transmit Tactical Rescue Dispatch',
    },
    {
      step: 10,
      title: 'STEP 10 // RESCUE DISPATCH GENERATED',
      tag: 'TACTICAL DISPATCH',
      narrative: 'MGRS coordinates and medical triage packet transmitted to NDRF Quick Response Team Bravo-02 with motorized inflatable raft (ETA: 8 min).',
      actionText: 'Generate Mission Debrief Report',
    },
    {
      step: 11,
      title: 'STEP 11 // RESCUE COMPLETE & REPORT',
      tag: 'MISSION COMPLETE',
      narrative: 'A formal tactical after-action report is compiled with flight logs, hazard mitigation audit, and survivor coordinates for disaster commanders.',
      actionText: 'Complete Interactive Walkthrough',
    },
  ];

  const current = demoSteps[demoStep - 1] || demoSteps[0];
  const progressPct = ((demoStep - 1) / (demoSteps.length - 1)) * 100;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl font-mono">
      <div className="bg-[#0D131D] text-white rounded-2xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-md">
        {/* Progress Bar */}
        <div className="w-full bg-[#111925] h-1.5 overflow-hidden">
          <div 
            className="bg-[#38BDF8] h-1.5 transition-all duration-300 shadow-[0_0_12px_rgba(56,189,248,0.8)]"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="p-5 space-y-3">
          {/* Top Step Counter */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
              <span className="text-xs font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/20">
                {current.tag}
              </span>
              <span className="text-xs text-slate-400">
                STEP {demoStep} OF 11
              </span>
            </div>

            <button
              onClick={stopDemo}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Exit Demo Mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Narrative */}
          <div>
            <h3 className="text-base font-black text-[#F8FAFC] tracking-tight">
              {current.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {current.narrative}
            </p>
          </div>

          {/* Controls */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              onClick={prevDemoStep}
              disabled={demoStep === 1}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold text-slate-300 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1 hidden sm:flex">
              {demoSteps.map((s) => (
                <button
                  key={s.step}
                  onClick={() => goToDemoStep(s.step)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    demoStep === s.step ? 'bg-[#38BDF8] w-5' : 'bg-[#111925] hover:bg-slate-700'
                  }`}
                  title={`Jump to step ${s.step}: ${s.title}`}
                />
              ))}
            </div>

            <button
              onClick={nextDemoStep}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
            >
              <span>{current.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
