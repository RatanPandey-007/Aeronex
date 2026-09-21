import React from 'react';
import { X, CheckCircle2, AlertTriangle, Radio, Cpu, Navigation, Wifi, Database, Layers, Shield } from 'lucide-react';
import { useMission } from '../../context/MissionContext';

export const SystemStatusDrawer: React.FC = () => {
  const { isSystemDrawerOpen, setIsSystemDrawerOpen, systemStatus } = useMission();

  if (!isSystemDrawerOpen) return null;

  const getSubsystemIcon = (id: string) => {
    switch (id) {
      case 'sub-drone': return Radio;
      case 'sub-ai': return Cpu;
      case 'sub-gps': return Navigation;
      case 'sub-mesh': return Wifi;
      case 'sub-sachet': return Database;
      case 'sub-map': return Layers;
      default: return Shield;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0D131D] shadow-2xl border-l border-white/10 flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 bg-[#111925] border-b border-white/10 text-white flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-ping" />
                <h2 className="text-base font-black tracking-tight text-[#F8FAFC]">System Diagnostics & Telemetry</h2>
              </div>
              <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                PLATFORM HEALTH: ALL SUBSYSTEMS NOMINAL
              </p>
            </div>
            <button
              onClick={() => setIsSystemDrawerOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Core Hardware Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 p-4 bg-[#070B12] border-b border-white/10 text-center font-mono">
            <div className="bg-[#111925] p-2.5 rounded-xl border border-white/5 shadow-md">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Edge AI Engine</span>
              <span className="text-sm font-bold text-[#F8FAFC]">42.4 FPS</span>
              <span className="text-[10px] text-[#22C55E] block">18.2ms Latency</span>
            </div>
            <div className="bg-[#111925] p-2.5 rounded-xl border border-white/5 shadow-md">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">RTK GNSS</span>
              <span className="text-sm font-bold text-[#38BDF8]">±1.8 cm</span>
              <span className="text-[10px] text-slate-400 block">18 SVs Fixed</span>
            </div>
            <div className="bg-[#111925] p-2.5 rounded-xl border border-white/5 shadow-md">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Mesh Throughput</span>
              <span className="text-sm font-bold text-[#22C55E]">24.8 Mbps</span>
              <span className="text-[10px] text-slate-400 block">-58 dBm RSSI</span>
            </div>
          </div>

          {/* Subsystems List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider px-1">
              Active Hardware & Intelligence Stacks
            </div>

            {systemStatus.subsystems.map((sub) => {
              const Icon = getSubsystemIcon(sub.id);
              return (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-xl border border-white/5 bg-[#111925] hover:border-white/15 transition-all shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#151E2B] border border-white/10 flex items-center justify-center text-[#38BDF8]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#F8FAFC]">{sub.name}</h3>
                        <p className="text-[11px] text-[#94A3B8] font-mono">{sub.subTitle}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono text-[#22C55E] bg-[#22C55E]/15 px-2 py-0.5 rounded border border-[#22C55E]/30">
                      <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                      {sub.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-[#0D131D] p-2 rounded-lg border border-white/5 font-mono">
                    {sub.details}
                  </p>

                  <div className="grid grid-cols-3 gap-1 mt-2.5 pt-2 border-t border-white/5 text-[10px] font-mono">
                    {sub.metrics.map((m, i) => (
                      <div key={i}>
                        <span className="text-slate-500 block">{m.label}</span>
                        <span className="text-slate-200 font-bold">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-[#111925] border-t border-white/10 text-center font-mono">
            <p className="text-xs text-slate-400 font-semibold">
              AERONEX Ground Command Architecture v2.4
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Certified for NDRF & SDRF Emergency Operations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
