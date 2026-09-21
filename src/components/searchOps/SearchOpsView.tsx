import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Compass, 
  RotateCw
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { SearchPattern } from '../../types/mission';
import { OperationsMap } from '../map/OperationsMap';

export const SearchOpsView: React.FC = () => {
  const { currentMission, changeSearchPattern, addToast } = useMission();
  const [selectedPattern, setSelectedPattern] = useState<SearchPattern>(currentMission.pattern);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const patterns: { id: SearchPattern; name: string; desc: string; optimalFor: string }[] = [
    {
      id: 'CREEPING_LINE',
      name: 'Creeping Line (Lawnmower)',
      desc: 'Systematic parallel sweeps across wide rectangular disaster corridors.',
      optimalFor: 'Broad valley inundation, flat terrain sweeps',
    },
    {
      id: 'EXPANDING_SQUARE',
      name: 'Expanding Square Search',
      desc: 'Outward spiral from a last-known point or distress beacon transmission.',
      optimalFor: 'Single missing hiker, localized vehicle washaway',
    },
    {
      id: 'SECTOR_SEARCH',
      name: 'Sector Search (Pie Slices)',
      desc: 'Multi-directional radial passes over high-probability centerpoint.',
      optimalFor: 'Turbulent river confluence, debris pile',
    },
    {
      id: 'CONTOUR_FOLLOW',
      name: 'Contour Follow (Elevation DEM)',
      desc: 'LiDAR-assisted constant-AGL sweeps wrapping steep mountain slopes.',
      optimalFor: 'Landslide escarpments, tea plantation ridges',
    },
  ];

  const handleGeneratePattern = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      changeSearchPattern(selectedPattern);
      addToast({
        type: 'success',
        title: 'Search Pattern Generated',
        message: `Generated 48 autonomous waypoints using ${selectedPattern.replace('_', ' ')}. Flight envelope synchronized.`,
      });
    }, 1200);
  };

  const totalCells = currentMission.gridCells?.length || 30;
  const searchedCells = currentMission.gridCells?.filter(c => c.status === 'SEARCHED').length || 15;
  const activeCells = currentMission.gridCells?.filter(c => c.status === 'SEARCHING').length || 1;
  const survivorCells = currentMission.gridCells?.filter(c => c.status === 'SURVIVOR_FOUND').length || 1;

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-ping" />
            <h1 className="text-2xl font-black tracking-tight text-[#F8FAFC]">
              SEARCH OPERATIONS // TACTICAL GRID
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Autonomous trajectory planner, LiDAR-assisted obstacle clearance, and area coverage accounting
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#F8FAFC] bg-[#111925] px-3 py-1.5 rounded-xl border border-white/10 shadow-md">
            PATTERN: {currentMission.pattern.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0D131D] border border-white/10 shadow-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Search Coverage</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#F8FAFC]">68.4%</span>
            <span className="text-xs text-slate-400">8.55 / 12.5 km²</span>
          </div>
          <div className="w-full bg-[#111925] rounded-full h-1.5 mt-2 overflow-hidden border border-white/5">
            <div className="bg-[#22C55E] h-1.5 rounded-full" style={{ width: '68.4%' }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D131D] border border-white/10 shadow-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Search Efficiency</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#F8FAFC]">2.8</span>
            <span className="text-xs text-slate-400">ha / min</span>
          </div>
          <span className="text-[10px] text-[#22C55E] block mt-1">● +42% vs foot SAR teams</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D131D] border border-white/10 shadow-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Remaining Sector</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#F8FAFC]">3.95</span>
            <span className="text-xs text-slate-400">km² pending</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">11 pending grid blocks</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D131D] border border-white/10 shadow-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Est. Completion</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#F8FAFC]">22</span>
            <span className="text-xs text-slate-400">minutes</span>
          </div>
          <span className="text-[10px] text-[#38BDF8] block mt-1">Target: 15:10 IST</span>
        </div>
      </div>

      {/* Main Grid Visualizer & Pattern Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map with Search Grid Overlay (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between bg-[#0D131D] px-4 py-2 rounded-xl border border-white/10 text-xs">
            <span className="font-bold text-[#F8FAFC]">TACTICAL SEARCH GRID MATRIX (30 CELLS)</span>
            <div className="flex items-center gap-3 text-slate-400">
              <span className="text-[#22C55E] font-bold">{searchedCells} Searched</span>
              <span className="text-[#F6C945] font-bold">{activeCells} Active</span>
              <span className="text-[#FF3B4E] font-bold">{survivorCells} Detected</span>
            </div>
          </div>

          <OperationsMap heightClass="h-[560px]" />
        </div>

        {/* Autonomous Pattern Generator (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0D131D] rounded-2xl border border-white/10 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <span className="text-xs font-bold text-[#38BDF8] uppercase">
                  WAYPOINT COMPUTATION ENGINE
                </span>
                <h3 className="text-sm font-bold text-[#F8FAFC] mt-0.5">
                  Autonomous Search Pattern Selector
                </h3>
              </div>
              <Compass className="w-5 h-5 text-slate-500" />
            </div>

            {/* Pattern Options */}
            <div className="space-y-2.5">
              {patterns.map((p) => {
                const isSelected = selectedPattern === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPattern(p.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#151E2B] border-[#38BDF8] ring-1 ring-[#38BDF8]/40 shadow-lg'
                        : 'bg-[#111925] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F8FAFC]">
                        {p.name}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                      )}
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-1 leading-snug font-sans">
                      {p.desc}
                    </p>
                    <span className="text-[10px] text-slate-500 block mt-1.5">
                      Best: {p.optimalFor}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Generate Action Button */}
            <div className="pt-2">
              <button
                onClick={handleGeneratePattern}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-blue-200" />
                    <span>Computing Terrain Clearance & Splines...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-blue-200" />
                    <span>Generate & Upload {selectedPattern.replace('_', ' ')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Grid Legend & Status Breakdown */}
          <div className="bg-[#0D131D] rounded-2xl border border-white/10 p-4 shadow-xl text-xs space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              SEARCH GRID COLOR CODES
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30">
                <span className="w-3 h-3 rounded bg-[#22C55E]" />
                <span>Searched (68%)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F6C945]/15 text-[#F6C945] border border-[#F6C945]/30">
                <span className="w-3 h-3 rounded bg-[#F6C945]" />
                <span>Active Sweep</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 text-slate-400 border border-white/10">
                <span className="w-3 h-3 rounded bg-slate-600" />
                <span>Pending Grid</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FF3B4E]/15 text-[#FF3B4E] border border-[#FF3B4E]/30">
                <span className="w-3 h-3 rounded bg-[#FF3B4E] animate-pulse" />
                <span>Survivor Found</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
