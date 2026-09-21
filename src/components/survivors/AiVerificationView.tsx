import React from 'react';
import { Cpu, CheckCircle2, Flame, Eye, Activity } from 'lucide-react';

export const AiVerificationView: React.FC = () => {
  const pipelineStages = [
    {
      step: '01',
      title: 'Sensor Ingestion',
      metric: '60 Hz Dual Stream',
      sub: 'Synchronized FLIR LWIR & 4K Optical',
      icon: Eye,
      status: 'COMPLETE',
    },
    {
      step: '02',
      title: 'Confidence Analysis',
      metric: '96.4% Probability',
      sub: 'AERONEX-SAR-Fused Neural Net',
      icon: Cpu,
      status: 'COMPLETE',
    },
    {
      step: '03',
      title: 'Multi-Frame Consistency',
      metric: '15 / 15 Frames',
      sub: 'Kalman-Tracked Centroid Stability',
      icon: Activity,
      status: 'COMPLETE',
    },
    {
      step: '04',
      title: 'False-Alarm Heuristic',
      metric: 'Passed (+14.8°C)',
      sub: 'Rejects livestock, hot rocks & reflections',
      icon: Flame,
      status: 'COMPLETE',
    },
    {
      step: '05',
      title: 'Survivor Confirmed',
      metric: 'TACTICAL LOCK',
      sub: 'MGRS Grid logged & priority scored',
      icon: CheckCircle2,
      status: 'VERIFIED',
    },
  ];

  return (
    <div className="bg-[#0D131D] rounded-2xl border border-white/10 p-5 shadow-xl space-y-5 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
            <h3 className="text-xs font-black tracking-wider text-[#F8FAFC] uppercase">
              AERONEX AI VERIFICATION PIPELINE
            </h3>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Edge neural verification eliminates false alarms and prioritizes genuine victims
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] font-bold">
            OVERALL CONFIDENCE: 96.4%
          </div>
        </div>
      </div>

      {/* Connected 5-Stage Verification Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {pipelineStages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#111925] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">
                    STAGE {stage.step}
                  </span>
                  <Icon className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="text-xs font-bold text-[#F8FAFC]">{stage.title}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{stage.sub}</p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="font-bold text-white">{stage.metric}</span>
                <span className="text-[#22C55E] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {stage.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
