import React from 'react';
import { Radio, Cpu, Wifi, Database, ShieldCheck } from 'lucide-react';
import { useMission } from '../../context/MissionContext';

export const SystemStatusStrip: React.FC = () => {
  const { drones, setIsSystemDrawerOpen } = useMission();
  const activeDrones = drones.filter(d => d.status === 'ACTIVE_SEARCH').length;

  const items = [
    {
      label: 'DRONE FLEET',
      subtext: `${activeDrones} Active in Flight / 2 Ready`,
      icon: Radio,
      status: 'Operational',
    },
    {
      label: 'AI ENGINE',
      subtext: 'NVIDIA Orin NX • 42.4 FPS',
      icon: Cpu,
      status: 'Operational',
    },
    {
      label: 'COMMUNICATION',
      subtext: 'MIMO Mesh 24.8 Mbps • AES-256',
      icon: Wifi,
      status: 'Operational',
    },
    {
      label: 'ALERT NETWORK',
      subtext: 'SACHET / NDMA Integrated Feed',
      icon: Database,
      status: 'Connected',
    },
    {
      label: 'OPERATIONS',
      subtext: 'Tactical SAR Grid Protocol Active',
      icon: ShieldCheck,
      status: 'Operational',
    },
  ];

  return (
    <div className="bg-[#0D131D] border-y border-white/10 py-3.5 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">
              LIVE SYSTEM STATUS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 flex-1 lg:max-w-5xl">
            {items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => setIsSystemDrawerOpen(true)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#111925] hover:bg-[#151E2B] transition-colors cursor-pointer border border-white/5 hover:border-white/15 shadow-md"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#070B12] border border-white/10 flex items-center justify-center shrink-0 text-[#38BDF8]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-[#F8FAFC] tracking-tight block truncate font-mono">
                        {item.label}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shrink-0" />
                    </div>
                    <span className="text-[10px] text-[#94A3B8] truncate block font-mono">
                      {item.subtext}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
