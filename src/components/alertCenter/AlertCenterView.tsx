import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  ArrowRight, 
  Database, 
  Maximize2,
  RefreshCw,
  Layers,
  ChevronRight,
  Flame,
  Wind,
  CloudRain,
  Waves,
  CheckCircle2
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { DisasterAlert, HazardType } from '../../types/alert';
import { SeverityBadge } from '../common/Badge';
import { OperationsMap } from '../map/OperationsMap';
import { AlertDetailModal } from './AlertDetailModal';
import { FullMapView } from '../map/FullMapView';
import { DroneRerouteModal } from './DroneRerouteModal';

export const AlertCenterView: React.FC = () => {
  const { 
    alerts, 
    selectedAlert, 
    setSelectedAlert, 
    setIsRerouteModalOpen,
    acceptRerouteRecommendation,
    currentMission 
  } = useMission();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [hazardFilter, setHazardFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Strict Modal Architecture State (Mutual Exclusivity)
  const [isFullMapOpen, setIsFullMapOpen] = useState<boolean>(false);

  // Stats Counters
  const activeCount = alerts.length;
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const warningCount = alerts.filter(a => a.severity === 'WARNING').length;
  const watchCount = alerts.filter(a => a.severity === 'WATCH').length;
  const monitoringCount = alerts.filter(a => a.severity === 'MONITORING').length;

  // Filter Logic
  const filteredAlerts = alerts.filter(alert => {
    if (severityFilter !== 'ALL' && alert.severity !== severityFilter) return false;
    if (hazardFilter !== 'ALL' && alert.hazardType !== hazardFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        alert.title.toLowerCase().includes(q) ||
        alert.regionName.toLowerCase().includes(q) ||
        alert.state.toLowerCase().includes(q) ||
        alert.hazardType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getHazardIcon = (type: HazardType) => {
    switch (type) {
      case 'FLASH_FLOOD': return Waves;
      case 'LANDSLIDE': return AlertTriangle;
      case 'CYCLONE': return Wind;
      case 'WILDFIRE': return Flame;
      case 'EXTREME_RAINFALL': return CloudRain;
      default: return AlertTriangle;
    }
  };

  const handleOpenFullMap = () => {
    // Cleanly close intelligence sheet and switch to full map mode
    setIsFullMapOpen(true);
  };

  const handleBackToIntelligence = () => {
    setIsFullMapOpen(false);
  };

  const criticalFlood = alerts.find(a => a.id === 'ALT-2026-0814-01');

  return (
    <div className="space-y-6">
      {/* Alert Center Header & Status Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B4E] animate-ping" />
            <h1 className="text-2xl font-black tracking-tight text-[#F8FAFC]">
              ALERT CENTER // REAL-TIME DISASTER INTELLIGENCE
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Ingesting SACHET / NDMA Common Alerting Protocol feeds with automated flight-corridor collision hazard detection
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-xs font-bold shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span>LIVE ALERT NETWORK: CONNECTED</span>
          </div>
        </div>
      </div>

      {/* Top 5 Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
        <div 
          onClick={() => setSeverityFilter('ALL')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-xl ${
            severityFilter === 'ALL' ? 'bg-[#151E2B] border-[#38BDF8] ring-1 ring-[#38BDF8]/40' : 'bg-[#0D131D] border-white/5 hover:border-white/15'
          }`}
        >
          <span className="text-[10px] font-bold text-slate-400 block uppercase">
            ACTIVE ALERTS
          </span>
          <span className="text-2xl font-black text-[#F8FAFC] mt-1 block">
            {activeCount.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] text-[#38BDF8] block mt-0.5">
            All Hazard Sectors
          </span>
        </div>

        <div 
          onClick={() => setSeverityFilter('CRITICAL')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-xl ${
            severityFilter === 'CRITICAL' ? 'bg-[#FF3B4E]/20 border-[#FF3B4E] ring-1 ring-[#FF3B4E]/40' : 'bg-[#0D131D] border-white/5 hover:border-white/15'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#FF3B4E] block uppercase">
              CRITICAL
            </span>
            <span className="w-2 h-2 rounded-full bg-[#FF3B4E] animate-ping" />
          </div>
          <span className="text-2xl font-black text-[#FF3B4E] mt-1 block">
            {criticalCount.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Immediate Drone Risk
          </span>
        </div>

        <div 
          onClick={() => setSeverityFilter('WARNING')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-xl ${
            severityFilter === 'WARNING' ? 'bg-[#FF9F1C]/20 border-[#FF9F1C] ring-1 ring-[#FF9F1C]/40' : 'bg-[#0D131D] border-white/5 hover:border-white/15'
          }`}
        >
          <span className="text-[10px] font-bold text-[#FF9F1C] block uppercase">
            WARNING
          </span>
          <span className="text-2xl font-black text-[#FF9F1C] mt-1 block">
            {warningCount.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Squall & Inundation
          </span>
        </div>

        <div 
          onClick={() => setSeverityFilter('WATCH')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-xl ${
            severityFilter === 'WATCH' ? 'bg-[#F6C945]/20 border-[#F6C945] ring-1 ring-[#F6C945]/40' : 'bg-[#0D131D] border-white/5 hover:border-white/15'
          }`}
        >
          <span className="text-[10px] font-bold text-[#F6C945] block uppercase">
            WATCH
          </span>
          <span className="text-2xl font-black text-[#F6C945] mt-1 block">
            {(watchCount + monitoringCount).toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Catchment Basins
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0D131D] border border-white/5 shadow-xl">
          <span className="text-[10px] font-bold text-purple-400 block uppercase">
            AFFECTED REGIONS
          </span>
          <span className="text-2xl font-black text-[#F8FAFC] mt-1 block">
            04
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Wayanad & Idukki
          </span>
        </div>
      </div>

      {/* Flagship Differentiator: Operational Alert Event Banner */}
      <div className="bg-[#0D131D] rounded-2xl p-5 border border-[#FF3B4E]/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FF3B4E]/20 border border-[#FF3B4E] flex items-center justify-center text-[#FF3B4E] shrink-0">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#FF3B4E] bg-[#FF3B4E]/20 px-2 py-0.5 rounded border border-[#FF3B4E]/30">
                CRITICAL OPERATIONAL EVENT
              </span>
              <span className="text-xs text-slate-400">MISSION-04 CORRIDOR INTERSECTION</span>
            </div>
            <h3 className="text-sm font-bold text-white mt-1">
              Flash Flood Inundation Surge — Zone Alpha Chaliyar Basin
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              AERONEX Intelligence: &quot;Mission-04 flight corridor intersects the projected hazard zone. Shift search corridor 1.8 km East.&quot;
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsRerouteModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-bold transition-colors"
          >
            REVIEW
          </button>
          <button
            onClick={() => {
              if (criticalFlood) {
                acceptRerouteRecommendation(criticalFlood.id);
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-[#FF3B4E] hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>ACCEPT & REROUTE</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout: 65% Large Map (7 cols) + 35% Filtered Alert List (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
        {/* Left Column: Large Geospatial Map (7 cols, ~60–70% visual focus) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between bg-[#0D131D] px-4 py-2 rounded-xl border border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF3B4E] animate-ping" />
              <span className="font-bold text-[#F8FAFC]">GEOSPATIAL HAZARD MAP (DARK GIS)</span>
              <span className="text-slate-500">|</span>
              <span className="text-[#FF3B4E] font-bold">CLICK ZONE TO INSPECT</span>
            </div>
            <span className="text-slate-400">{alerts.length} Ingested Polygons</span>
          </div>

          <OperationsMap heightClass="h-[620px]" />
        </div>

        {/* Right Column: Alert Cards & Filters (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filter Bar */}
          <div className="bg-[#0D131D] p-4 rounded-2xl border border-white/10 shadow-xl space-y-3 text-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hazard, region, state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#111925] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-[#38BDF8]"
              />
            </div>

            {/* Severity Pill Filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              {['ALL', 'CRITICAL', 'WARNING', 'WATCH', 'MONITORING'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                    severityFilter === sev
                      ? 'bg-[#38BDF8] text-slate-950 shadow-md'
                      : 'bg-[#111925] text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            {/* Hazard Category Selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">HAZARD:</span>
              <select
                value={hazardFilter}
                onChange={(e) => setHazardFilter(e.target.value)}
                className="flex-1 px-2.5 py-1.5 rounded-xl bg-[#111925] border border-white/10 text-xs text-slate-300 focus:outline-hidden"
              >
                <option value="ALL">All Hazard Categories</option>
                <option value="FLASH_FLOOD">Flash Flood Surge</option>
                <option value="LANDSLIDE">Landslide / Debris</option>
                <option value="CYCLONE">Cyclone / Squall Line</option>
                <option value="EXTREME_RAINFALL">Extreme Cloudburst</option>
                <option value="WILDFIRE">Wildfire / Smoke</option>
                <option value="STORM">Severe Thunderstorm</option>
                <option value="HEATWAVE">Post-Storm Humidity</option>
              </select>
            </div>
          </div>

          {/* Alert Cards List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 bg-[#0D131D] rounded-2xl border border-white/10 text-center text-xs text-slate-400">
                No alerts match the selected filters.
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const Icon = getHazardIcon(alert.hazardType);
                const hasImpact = Boolean(alert.missionImpact);

                return (
                  <div
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className="p-4 rounded-2xl bg-[#0D131D] border border-white/10 hover:border-white/25 hover:bg-[#111925] transition-all cursor-pointer shadow-xl space-y-2.5 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#111925] border border-white/5 flex items-center justify-center text-[#38BDF8] group-hover:border-[#38BDF8]/40 transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <SeverityBadge severity={alert.severity} />
                          <h4 className="text-xs font-bold text-[#F8FAFC] mt-1 group-hover:text-[#38BDF8] transition-colors">
                            {alert.title}
                          </h4>
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-500">
                        {alert.issuedAt}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span className="truncate max-w-[180px]">{alert.regionName}</span>
                      </div>
                      <span>{alert.affectedAreaKm2} km²</span>
                    </div>

                    {/* Mission Impact Badge */}
                    {hasImpact && (
                      <div className="p-2 rounded-xl bg-[#FF3B4E]/15 border border-[#FF3B4E]/30 flex items-center justify-between text-[11px] text-[#FF3B4E]">
                        <span className="font-bold flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Impacts {alert.missionImpact?.affectedMissionId}
                        </span>
                        <span className="underline font-bold">Inspect Sheet →</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Strict Modal Architecture: Disaster Intelligence Sheet */}
      {!isFullMapOpen && (
        <AlertDetailModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onOpenFullMap={handleOpenFullMap}
        />
      )}

      {/* Full Map Mode (Never overlaps Intelligence Sheet) */}
      <FullMapView
        isOpen={isFullMapOpen}
        alert={selectedAlert}
        onBackToIntelligence={handleBackToIntelligence}
        onClose={() => setIsFullMapOpen(false)}
      />

      {/* Dynamic Route Reroute Modal */}
      <DroneRerouteModal />
    </div>
  );
};
