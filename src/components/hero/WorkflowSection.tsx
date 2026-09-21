import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Cpu, 
  Send, 
  Search, 
  UserCheck, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  ArrowRight
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';

export const WorkflowSection: React.FC = () => {
  const { setActiveTab } = useMission();
  const [activeStep, setActiveStep] = useState<number>(4);

  const steps = [
    {
      step: '01',
      title: 'Detect Threat',
      subtitle: 'Disaster Ingestion',
      icon: AlertTriangle,
      description: 'SACHET / NDMA feeds trigger real-time hazard polygons (flash flood surge, landslide mass movement).',
      actionTab: 'alert-center',
      tag: 'CAP 1.2 Feed',
    },
    {
      step: '02',
      title: 'Analyze Risk',
      subtitle: 'Impact Corridor',
      icon: Cpu,
      description: 'Automated geospatial intersection flags drones inside hazard zones and calculates terrain clearance.',
      actionTab: 'alert-center',
      tag: 'Dynamic GIS',
    },
    {
      step: '03',
      title: 'Deploy Fleet',
      subtitle: 'Autonomous Sortie',
      icon: Send,
      description: 'AeroNex Valkyrie hexacopters launch with RTK centimeter navigation and AES-256 tactical mesh link.',
      actionTab: 'mission-control',
      tag: 'PX4 Autopilot',
    },
    {
      step: '04',
      title: 'Autonomous Search',
      subtitle: 'Grid Execution',
      icon: Search,
      description: 'Autonomous creeping line or contour-following sweep over designated disaster sectors.',
      actionTab: 'search-ops',
      tag: 'LiDAR + Optical',
    },
    {
      step: '05',
      title: 'Detect Survivor',
      subtitle: 'Thermal Signature',
      icon: UserCheck,
      description: 'FLIR Boson radiometric sensor detects human body heat differential (+14.8°C above cold ambient mud/water).',
      actionTab: 'survivors',
      tag: 'LWIR 640x512',
    },
    {
      step: '06',
      title: 'Verify via AI',
      subtitle: 'Multi-Frame Check',
      icon: CheckCircle2,
      description: 'Edge Jetson Orin validates morphology over 15 consecutive frames to eliminate false heat anomalies.',
      actionTab: 'survivors',
      tag: '96.4% Confidence',
    },
    {
      step: '07',
      title: 'Prioritize Rescue',
      subtitle: 'Urgency Engine',
      icon: TrendingUp,
      description: 'Multi-factor algorithm ranks victims by flood surge proximity, immobility duration, and ground team ETA.',
      actionTab: 'priority-engine',
      tag: 'Tactical Queue',
    },
    {
      step: '08',
      title: 'Execute Rescue',
      subtitle: 'Tactical Handoff',
      icon: Award,
      description: 'MGRS coordinates and medical triage packets transmitted instantly to NDRF/SDRF tactical field units.',
      actionTab: 'reports',
      tag: 'Debrief Report',
    },
  ];

  return (
    <section className="py-16 bg-[#070B12] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111925] border border-white/10 text-[#38BDF8] text-xs font-bold font-mono tracking-wider uppercase mb-3">
            <span>OPERATIONAL PIPELINE</span>
          </div>
          <h2 className="text-3xl font-black text-[#F8FAFC] tracking-tight sm:text-4xl">
            From Disaster Ingestion to Tactical Rescue
          </h2>
          <p className="mt-3 text-sm text-[#94A3B8] leading-relaxed font-sans">
            AERONEX connects national disaster intelligence feeds, onboard drone autonomy, edge AI inference, and field rescue logistics into one synchronized command layer.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 relative z-10 font-mono">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = activeStep === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer rounded-xl p-3.5 transition-all duration-200 flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-[#151E2B] text-white shadow-xl border-[#38BDF8] ring-1 ring-[#38BDF8]/40 scale-102'
                    : 'bg-[#0D131D] hover:bg-[#111925] text-[#94A3B8] border-white/5 hover:border-white/15'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-[#38BDF8] text-slate-950 font-bold' : 'bg-white/5 text-slate-400'
                    }`}>
                      {item.step}
                    </span>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-[#38BDF8]/20 text-[#38BDF8]' : 'bg-white/5 text-slate-400'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <h3 className={`text-xs font-bold tracking-tight ${isSelected ? 'text-[#F8FAFC]' : 'text-slate-200'}`}>
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-white/5">
                  <span className={`text-[10px] block truncate ${
                    isSelected ? 'text-[#22C55E] font-bold' : 'text-[#38BDF8]'
                  }`}>
                    {item.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Step Detail Showcase */}
        <div className="mt-8 bg-[#0D131D] border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 text-[#38BDF8] flex items-center justify-center shrink-0 shadow-lg">
                {React.createElement(steps[activeStep].icon, { className: 'w-6 h-6' })}
              </div>
              <div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-xs font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/20">
                    STAGE {steps[activeStep].step} OF 08
                  </span>
                  <h4 className="text-lg font-bold text-[#F8FAFC]">
                    {steps[activeStep].title} — {steps[activeStep].subtitle}
                  </h4>
                </div>
                <p className="text-sm text-[#94A3B8] mt-1.5 max-w-3xl leading-relaxed">
                  {steps[activeStep].description}
                </p>
              </div>
            </div>

            <div className="shrink-0 font-mono">
              <button
                onClick={() => setActiveTab(steps[activeStep].actionTab)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#151E2B] hover:bg-[#1E293B] border border-white/10 text-white text-xs font-bold transition-colors shadow-md"
              >
                <span>OPEN LIVE INTERFACE</span>
                <ArrowRight className="w-4 h-4 text-[#38BDF8]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
