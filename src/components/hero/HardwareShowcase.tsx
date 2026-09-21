import React from 'react';
import { Shield, Cpu, Flame, Navigation, Radio } from 'lucide-react';

export const HardwareShowcase: React.FC = () => {
  const hardwareSpecs = [
    {
      title: 'AeroNex SAR-03 Custom Quadcopter',
      category: 'TACTICAL AIRFRAME',
      icon: Shield,
      description: 'Custom SAR quadcopter with dual red front lattice truss arms, dual white rear lattice truss arms, central high-contrast onboard HUD display monitor, and high-thrust black composite propellers.',
      specs: ['2x Red / 2x White Truss Arms', 'Central HUD Display Monitor', 'Black 2-Blade Composite Props', 'Front Sensor Gimbal Mount'],
    },
    {
      title: 'Dual Optical + Radiometric LWIR Pod',
      category: 'SENSOR PAYLOAD',
      icon: Flame,
      description: 'FLIR Boson 640 (640x512, <40mK NETD, 60Hz) paired with Sony 4K 30x optical zoom on a 3-axis gyro-stabilized carbon gimbal.',
      specs: ['Spectral: 7.5–13.5 µm', 'Radiometric Temp Map', '3-Axis Carbon Gimbal', 'Laser Rangefinder'],
    },
    {
      title: 'NVIDIA Jetson Orin NX (16GB)',
      category: 'EDGE AI INFERENCE',
      icon: Cpu,
      description: '100 TOPS AI compute running AERONEX-SAR fused neural network at 42.4 FPS directly onboard. Zero cloud latency required for survivor localization.',
      specs: ['100 TOPS INT8', 'Dual NVDLA Engines', 'TensorRT Optimized', '18.2ms Ingestion'],
    },
    {
      title: 'Dual RTK-GNSS + Tactical MIMO Mesh',
      category: 'NAVIGATION & COMMS',
      icon: Navigation,
      description: 'Dual u-blox ZED-F9P RTK receivers delivering 0.018m precision with Silvus SC4200EP COFDM MIMO mesh radio link for non-line-of-sight valley coverage.',
      specs: ['±1.8cm RTK Precision', '24.8 Mbps Throughput', 'AES-256 Encryption', 'COFDM MIMO 2.4GHz'],
    },
  ];

  return (
    <section className="py-16 bg-[#070B12] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111925] text-[#38BDF8] border border-white/10 text-xs font-bold font-mono tracking-wider uppercase mb-2">
              <span>HARDWARE COMMAND LAYER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] tracking-tight">
              AERONEX Ground Command & Hardware Sync
            </h2>
            <p className="text-sm text-[#94A3B8] mt-1 max-w-2xl font-sans">
              This software platform is the command and intelligence layer built specifically for the AERONEX autonomous search-and-rescue drone fleet.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-[#0D131D] p-2.5 rounded-xl border border-white/10 shadow-md">
            <Radio className="w-4 h-4 text-[#22C55E] animate-pulse" />
            <span>DIRECT MAVLINK / DDS AIR-TO-GROUND BUS</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hardwareSpecs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#0D131D] rounded-2xl p-5 border border-white/10 shadow-xl hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/20">
                      {item.category}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#111925] border border-white/5 flex items-center justify-center text-[#F8FAFC]">
                      <Icon className="w-4 h-4 text-[#38BDF8]" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[#F8FAFC] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 space-y-1.5 font-mono">
                  {item.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                      <span className="w-1 h-1 rounded-full bg-[#38BDF8]" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
