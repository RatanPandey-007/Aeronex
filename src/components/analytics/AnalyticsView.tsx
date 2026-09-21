import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  BatteryCharging, 
  ShieldCheck,
  Activity,
  Radio
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const metrics = [
    { label: 'Total Sorties Flown', value: '48', sub: '100% mission safety record' },
    { label: 'Cumulative Area Swept', value: '284.6 km²', sub: '12 sectors in 72 hours' },
    { label: 'Average Detection Time', value: '7.8 min', sub: '-64% vs foot SAR teams' },
    { label: 'Confirmed Survivors', value: '31', sub: 'Zero false negative rate' },
    { label: 'Neural Detection Accuracy', value: '96.8%', sub: 'Multi-frame verified' },
    { label: 'False Alarm Rejection', value: '98.4%', sub: 'Animal/hot rock filter' },
    { label: 'Mean Battery Utilization', value: '22.4 Wh/km', sub: 'Optimal aerodynamic trim' },
    { label: 'Average Response Time', value: '8.4 min', sub: 'Alert to unit dispatch' },
  ];

  const dailyCoverage = [
    { day: 'Mon', area: 32.4 },
    { day: 'Tue', area: 41.2 },
    { day: 'Wed', area: 54.8 },
    { day: 'Thu', area: 38.6 },
    { day: 'Fri', area: 48.0 },
    { day: 'Sat', area: 26.8 },
    { day: 'Sun (Today)', area: 42.8 },
  ];

  const hourlyAccuracy = [
    { hour: '08:00', acc: 95.2 },
    { hour: '10:00', acc: 96.8 },
    { hour: '12:00', acc: 97.4 },
    { hour: '14:00', acc: 96.4 },
    { hour: '16:00', acc: 98.1 },
    { hour: '18:00', acc: 97.0 },
  ];

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-ping" />
            <h1 className="text-2xl font-black tracking-tight text-[#F8FAFC]">
              MISSION ANALYTICS & OPERATIONAL TELEMETRY
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Statistical performance metrics, sensor detection fidelity, and fleet resource utilization
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 bg-[#0D131D] px-3 py-1.5 rounded-xl border border-white/10 shadow-md">
            PERIOD: LAST 7 DAYS (DISASTER MOBILIZATION)
          </span>
        </div>
      </div>

      {/* KPI Grid (8 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-[#0D131D] border border-white/10 shadow-xl space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {m.label}
            </span>
            <span className="text-2xl font-black text-[#F8FAFC] block">
              {m.value}
            </span>
            <span className="text-[10px] text-[#22C55E] block">
              ● {m.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Search Coverage Bar Chart */}
        <div className="bg-[#0D131D] rounded-2xl border border-white/10 shadow-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <span className="text-xs font-bold text-[#38BDF8] uppercase">
                COVERAGE METRICS
              </span>
              <h3 className="text-sm font-bold text-[#F8FAFC] mt-0.5">
                Daily Area Swept (km²)
              </h3>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-500" />
          </div>

          <div className="pt-4 h-64 flex items-end justify-between gap-3 px-2">
            {dailyCoverage.map((item, idx) => {
              const maxArea = 60;
              const heightPct = (item.area / maxArea) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] text-[#38BDF8] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.area} km²
                  </div>
                  <div className="w-full bg-[#111925] rounded-t-lg relative flex items-end justify-center overflow-hidden h-44 border border-white/5">
                    <div
                      className="w-full bg-blue-600 rounded-t-lg transition-all group-hover:bg-blue-500"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 truncate w-full text-center">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Peak Sortie: Wednesday (54.8 km²)</span>
            <span className="text-[#22C55E] font-bold">Total: 284.6 km²</span>
          </div>
        </div>

        {/* AI Confidence Trend */}
        <div className="bg-[#0D131D] rounded-2xl border border-white/10 shadow-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <span className="text-xs font-bold text-[#38BDF8] uppercase">
                NEURAL RELIABILITY
              </span>
              <h3 className="text-sm font-bold text-[#F8FAFC] mt-0.5">
                Hourly Neural Verification Accuracy (%)
              </h3>
            </div>
            <TrendingUp className="w-5 h-5 text-slate-500" />
          </div>

          <div className="pt-4 h-64 flex items-end justify-between gap-4 px-2">
            {hourlyAccuracy.map((item, idx) => {
              const heightPct = ((item.acc - 90) / 10) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] text-[#22C55E] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.acc}%
                  </div>
                  <div className="w-full bg-[#111925] rounded-t-lg relative flex items-end justify-center overflow-hidden h-44 border border-white/5">
                    <div
                      className="w-full bg-[#22C55E] rounded-t-lg transition-all group-hover:bg-emerald-400"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {item.hour}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Model: TensorRT YOLOv9-SAR-Fused</span>
            <span className="text-[#38BDF8] font-bold">Reliability &gt;95% Target</span>
          </div>
        </div>
      </div>
    </div>
  );
};
