import React from 'react';
import { 
  ShieldAlert, 
  Radio, 
  MapPin, 
  Users, 
  PlayCircle, 
  BarChart3, 
  FileText, 
  Cpu, 
  Sparkles, 
  Compass,
  AlertTriangle,
  Sliders
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    alerts, 
    survivors, 
    setIsSystemDrawerOpen, 
    startDemo,
    isDemoActive 
  } = useMission();

  const criticalAlertsCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const verifiedSurvivorsCount = survivors.filter(s => s.status === 'VERIFIED').length;

  const navItems = [
    { id: 'overview', label: 'OVERVIEW', icon: Compass },
    { id: 'mission-control', label: 'MISSION CONTROL', icon: Radio },
    { 
      id: 'alert-center', 
      label: 'ALERT CENTER', 
      icon: AlertTriangle, 
      highlight: true, 
      badge: criticalAlertsCount > 0 ? `${criticalAlertsCount} CRITICAL` : undefined 
    },
    { id: 'search-ops', label: 'SEARCH OPS', icon: MapPin },
    { 
      id: 'survivors', 
      label: 'SURVIVORS', 
      icon: Users, 
      badge: verifiedSurvivorsCount > 0 ? `${verifiedSurvivorsCount}` : undefined 
    },
    { id: 'priority-engine', label: 'PRIORITY', icon: Sliders },
    { id: 'replay', label: 'MISSION REPLAY', icon: PlayCircle },
    { id: 'analytics', label: 'ANALYTICS', icon: BarChart3 },
    { id: 'reports', label: 'REPORTS', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070B12]/95 backdrop-blur-md border-b border-white/10 shadow-2xl">
      {/* Top emergency network telemetry strip */}
      <div className="bg-[#05080E] text-[#94A3B8] px-4 py-1 text-xs flex items-center justify-between font-mono tracking-tight border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#22C55E] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
            ● LIVE EMERGENCY NETWORK
          </span>
          <span className="text-white/10">|</span>
          <span className="text-slate-300">NDRF & STATE DISASTER OPERATIONS COMMAND</span>
          <span className="text-white/10">|</span>
          <span className="text-slate-400">SACHET / NDMA CAP FEED: <span className="text-[#22C55E]">ACTIVE</span></span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-400">
          <span>COORDINATES: 11.5365°N, 76.1265°E</span>
          <span className="text-[#38BDF8]">RTK GNSS: ±1.8cm FIX</span>
          <span>ENCRYPTION: AES-256</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Subtitle */}
          <div 
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 cursor-pointer group select-none py-1"
          >
            <div className="w-10 h-10 rounded-xl bg-[#111925] border border-white/10 flex items-center justify-center text-[#38BDF8] group-hover:border-[#38BDF8]/40 transition-colors shadow-lg">
              <ShieldAlert className="w-6 h-6 text-[#38BDF8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-[#F8FAFC]">AERONEX</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/5 text-[#38BDF8] border border-white/10 font-mono">
                  SAR-AI
                </span>
              </div>
              <p className="text-[10px] font-bold tracking-widest text-[#94A3B8] uppercase font-mono">
                AUTONOMOUS RESCUE INTELLIGENCE
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#151E2B] text-[#F8FAFC] border border-white/15 shadow-md'
                      : item.highlight && criticalAlertsCount > 0
                      ? 'bg-[#FF3B4E]/10 text-[#FF3B4E] border border-[#FF3B4E]/30 hover:bg-[#FF3B4E]/20'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#38BDF8]' : item.highlight ? 'text-[#FF3B4E]' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      item.highlight
                        ? 'bg-[#FF3B4E] text-white animate-pulse'
                        : 'bg-white/10 text-[#38BDF8]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 font-mono">
            {/* Demo Mode Button */}
            <button
              onClick={startDemo}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                isDemoActive
                  ? 'bg-[#FF9F1C] text-slate-950 hover:bg-amber-500 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
              title="Experience complete simulated end-to-end mission"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isDemoActive ? 'DEMO RUNNING' : 'DEMO MODE'}</span>
            </button>

            {/* System Status Drawer Toggle */}
            <button
              onClick={() => setIsSystemDrawerOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-[#0D131D] hover:bg-[#111925] text-xs font-medium text-slate-300 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="hidden sm:inline">SYSTEM:</span>
              <span className="font-bold text-[#F8FAFC]">OPTIMAL</span>
              <Cpu className="w-3.5 h-3.5 text-slate-500 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-nav for smaller viewports */}
      <div className="xl:hidden overflow-x-auto border-t border-white/5 bg-[#0D131D] px-3 py-1.5 flex items-center gap-1 font-mono">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                isActive
                  ? 'bg-[#151E2B] text-white border border-white/15'
                  : item.highlight && criticalAlertsCount > 0
                  ? 'bg-[#FF3B4E]/20 text-[#FF3B4E]'
                  : 'text-[#94A3B8] hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[10px] px-1 bg-[#FF3B4E] text-white rounded font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
