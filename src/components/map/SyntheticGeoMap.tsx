import React, { useState } from 'react';
import { 
  Radio, 
  ShieldAlert, 
  Layers, 
  RotateCcw, 
  Users, 
  MapPin, 
  Compass, 
  Navigation,
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { Survivor } from '../../types/survivor';
import { DisasterAlert } from '../../types/alert';

export interface SyntheticGeoMapProps {
  heightClass?: string;
  isFallback?: boolean;
  onSelectSurvivor?: (survivor: Survivor) => void;
  onSelectAlert?: (alert: DisasterAlert) => void;
  interactive?: boolean;
}

export const SyntheticGeoMap: React.FC<SyntheticGeoMapProps> = ({
  heightClass = 'h-[560px]',
  onSelectSurvivor,
  onSelectAlert,
  interactive = true,
}) => {
  const {
    primaryDrone,
    currentMission,
    alerts,
    survivors,
    setSelectedSurvivor,
    setSelectedAlert,
    dispatchRescue
  } = useMission();

  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showHazards, setShowHazards] = useState<boolean>(true);
  const [showFlightPath, setShowFlightPath] = useState<boolean>(true);
  const [showRescueTeams, setShowRescueTeams] = useState<boolean>(true);
  const [is3D, setIs3D] = useState<boolean>(true);
  const [selectedSurvivorPopup, setSelectedSurvivorPopup] = useState<Survivor | null>(null);

  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Coordinate projection bounding box for Wayanad / Chaliyar Sector:
  const minLat = 11.5100;
  const maxLat = 11.5900;
  const minLng = 76.0800;
  const maxLng = 76.1800;

  const project = (coord: [number, number]): [number, number] => {
    const lat = coord[0];
    const lng = coord[1];
    const x = ((lng - minLng) / (maxLng - minLng)) * 1000;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 700;
    return [x, y];
  };

  const dronePos = project(primaryDrone.currentLocation);
  const droneHeading = primaryDrone.telemetry.headingDeg;

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.87;
    setZoom((prev) => Math.min(Math.max(prev * factor, 0.6), 5.0));
  };

  // Drag to Pan Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = (e.clientX - dragStart.x) / zoom;
    const dy = (e.clientY - dragStart.y) / zoom;
    setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Dynamic ViewBox calculation
  const currentW = 1000 / zoom;
  const currentH = 700 / zoom;
  const minX = 500 - currentW / 2 - pan.x;
  const minY = 350 - currentH / 2 - pan.y;
  const dynamicViewBox = `${minX} ${minY} ${currentW} ${currentH}`;

  return (
    <div 
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={() => setSelectedSurvivorPopup(null)}
      className={`relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#060B12] shadow-2xl select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      } ${heightClass}`}
    >
      {/* ============================================================ */}
      {/* 1. COMPACT FLOATING MISSION STATUS STRIP (TOP-LEFT)          */}
      {/* ============================================================ */}
      <div className="absolute top-3 left-3 z-30 flex flex-wrap items-center gap-2 bg-[#080D14]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-mono shadow-xl pointer-events-none">
        <div className="flex items-center gap-1.5 text-white font-bold">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span>MISSION-04</span>
          <span className="text-slate-500">•</span>
          <span className="text-[#38BDF8]">WAYANAD SECTOR 4</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-2 text-slate-300">
          <span>GRID: <strong className="text-[#22C55E]">68%</strong></span>
          <span>•</span>
          <span>DRONE: <strong className="text-white">124m AGL</strong></span>
          <span>•</span>
          <span>HAZARD: <strong className="text-[#EF4444]">CRITICAL</strong></span>
          <span>•</span>
          <span>SURVIVORS: <strong className="text-[#38BDF8]">3</strong></span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. COMPACT CAMERA & ZOOM CONTROLS (TOP-RIGHT)                */}
      {/* ============================================================ */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-[#080D14]/90 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-xl text-xs font-mono">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom(1.3);
            setPan({ x: 500 - dronePos[0], y: 350 - dronePos[1] });
          }}
          className="px-2 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 font-bold border border-sky-500/40 flex items-center gap-1 transition-colors text-[10px]"
          title="Center on Drone-01"
        >
          <Navigation className="w-3 h-3" />
          <span>DRONE</span>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); setIs3D(!is3D); }}
          className={`px-2 py-1 rounded-lg font-bold border transition-colors flex items-center gap-1 text-[10px] ${
            is3D 
              ? 'bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/40' 
              : 'bg-white/5 text-slate-400 border-white/10'
          }`}
          title="Toggle Perspective"
        >
          <Compass className="w-3 h-3" />
          <span>{is3D ? '3D 45°' : '2D TOP'}</span>
        </button>

        <div className="h-4 w-px bg-white/10 mx-0.5" />

        <button
          onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(z * 1.25, 5)); }}
          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition-colors"
          title="Zoom In (+)"
        >
          +
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(z * 0.8, 0.6)); }}
          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition-colors"
          title="Zoom Out (-)"
        >
          -
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setZoom(1); setPan({ x: 0, y: 0 }); }}
          className="px-1.5 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-[10px] font-bold transition-colors"
          title="Reset View"
        >
          RESET
        </button>
      </div>

      {/* ============================================================ */}
      {/* 3. LAYER TOGGLES (BOTTOM-LEFT)                               */}
      {/* ============================================================ */}
      <div className="absolute bottom-3 left-3 z-30 bg-[#080D14]/90 backdrop-blur-md rounded-xl p-1.5 border border-white/10 shadow-xl flex items-center gap-1 text-[10px] font-mono">
        <span className="text-[9px] font-bold text-slate-500 uppercase px-1">LAYERS:</span>
        <button
          onClick={(e) => { e.stopPropagation(); setShowHazards(!showHazards); }}
          className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
            showHazards ? 'bg-red-500/20 text-[#EF4444] font-bold border border-red-500/40' : 'bg-white/5 text-slate-400'
          }`}
        >
          <span>Hazards</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setShowGrid(!showGrid); }}
          className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
            showGrid ? 'bg-emerald-500/20 text-[#22C55E] font-bold border border-emerald-500/40' : 'bg-white/5 text-slate-400'
          }`}
        >
          <span>Search Grid</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setShowFlightPath(!showFlightPath); }}
          className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
            showFlightPath ? 'bg-sky-500/20 text-[#38BDF8] font-bold border border-sky-500/40' : 'bg-white/5 text-slate-400'
          }`}
        >
          <span>Route</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setShowRescueTeams(!showRescueTeams); }}
          className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
            showRescueTeams ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40' : 'bg-white/5 text-slate-400'
          }`}
        >
          <span>Units</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 4. COMPACT FLOATING SURVIVOR POPUP                           */}
      {/* ============================================================ */}
      {selectedSurvivorPopup && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-12 right-3 z-40 max-w-xs w-full bg-[#080D14]/95 backdrop-blur-md rounded-xl border border-red-500/40 p-3 shadow-2xl font-mono text-xs space-y-2 animate-in fade-in zoom-in duration-150"
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="font-bold text-white">SURVIVOR {selectedSurvivorPopup.code || selectedSurvivorPopup.id}</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-red-500/20 text-red-400 font-bold">
                {selectedSurvivorPopup.status}
              </span>
            </div>
            <button 
              onClick={() => setSelectedSurvivorPopup(null)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">AI CONFIDENCE:</span>
              <span className="text-[#22C55E] font-bold">
                {(selectedSurvivorPopup.aiVerification.fusedConfidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">THERMAL:</span>
              <span className="text-amber-300 font-bold">
                POSITIVE ({selectedSurvivorPopup.aiVerification.thermalSurfaceTempC}°C)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">NEAREST UNIT:</span>
              <span className="text-[#38BDF8] font-bold">
                {selectedSurvivorPopup.nearestRescueTeam.teamName} (ETA {selectedSurvivorPopup.nearestRescueTeam.etaMinutes}m)
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              dispatchRescue(selectedSurvivorPopup.id);
              setSelectedSurvivorPopup(null);
            }}
            className="w-full py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] transition-colors shadow-md text-center"
          >
            DISPATCH RESCUE TEAM
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. SVG REALISTIC TOPOGRAPHIC TERRAIN CANVAS                   */}
      {/* ============================================================ */}
      <svg
        viewBox={dynamicViewBox}
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Subtle Geospatial Grid Pattern */}
          <pattern id="tacticalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            <circle cx="0" cy="0" r="0.75" fill="rgba(56, 189, 248, 0.2)" />
          </pattern>

          {/* Realistic River Gradient */}
          <linearGradient id="chaliyarGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#0369a1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
          </linearGradient>

          {/* Mountain Ridge Gradient */}
          <linearGradient id="ridgeShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.9" />
          </linearGradient>

          {/* Flash Flood Surge Gradient */}
          <radialGradient id="floodGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#ef4444" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
          </radialGradient>
        </defs>

        {/* 1. Deep Topographic Terrain Relief Base */}
        <rect width="1000" height="700" fill="#080e18" />
        <rect width="1000" height="700" fill="url(#tacticalGrid)" />

        {/* 2. Topographic Elevation Contour Lines (Western Ghats Escarpments: 650m - 1200m) */}
        <g stroke="#1e293b" strokeWidth="1" fill="none" opacity="0.6">
          {/* Ridge Line 1200m */}
          <path d="M 80,180 Q 220,120 420,160 T 780,130 T 960,190" stroke="#334155" strokeWidth="1.5" />
          <text x="440" y="155" fill="#64748b" fontSize="8" fontFamily="monospace">1200m</text>

          {/* Ridge Line 1050m */}
          <path d="M 60,240 Q 240,190 440,230 T 760,200 T 940,250" />
          <text x="740" y="195" fill="#475569" fontSize="8" fontFamily="monospace">1050m</text>

          {/* Ridge Line 900m */}
          <path d="M 50,320 Q 260,270 480,310 T 740,280 T 920,330" />
          <text x="240" y="265" fill="#475569" fontSize="8" fontFamily="monospace">900m</text>

          {/* Ridge Line 750m (Valley Edge) */}
          <path d="M 40,420 Q 280,380 520,400 T 760,370 T 910,430" stroke="#334155" />
          <text x="500" y="395" fill="#64748b" fontSize="8" fontFamily="monospace">750m</text>

          {/* Valley Bottom 600m */}
          <path d="M 50,560 Q 310,510 560,530 T 780,490 T 920,550" />
          <text x="320" y="505" fill="#475569" fontSize="8" fontFamily="monospace">600m</text>
        </g>

        {/* 3. Road & Trail Networks (Meppadi - Chooralmala Highway 59) */}
        <g stroke="#475569" strokeWidth="1.5" fill="none" opacity="0.65">
          <path d="M 120,680 Q 260,570 380,470 T 560,360 T 740,230 T 890,110" strokeDasharray="6 3" />
          <path d="M 380,470 Q 450,490 530,550 T 680,620" strokeWidth="1" strokeDasharray="3 3" />
        </g>

        {/* 4. Chaliyar River Main Waterway Channel & Drainage Tributaries */}
        <path
          d="M 100,690 Q 230,580 340,480 T 520,370 T 700,240 T 880,100"
          fill="none"
          stroke="url(#chaliyarGrad)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 100,690 Q 230,580 340,480 T 520,370 T 700,240 T 880,100"
          fill="none"
          stroke="#7dd3fc"
          strokeWidth="2"
          strokeOpacity="0.6"
          strokeDasharray="8 4"
        />

        {/* 5. Geographic Settlement Markers */}
        <g fill="#94a3b8" fontFamily="monospace" fontSize="9" fontWeight="bold">
          <circle cx="280" cy="540" r="3" fill="#38bdf8" />
          <text x="290" y="543" fill="#cbd5e1">MEPPADI</text>

          <circle cx="480" cy="410" r="3" fill="#38bdf8" />
          <text x="490" y="413" fill="#cbd5e1">CHOORALMALA</text>

          <circle cx="680" cy="280" r="3" fill="#38bdf8" />
          <text x="690" y="283" fill="#cbd5e1">MUNDAKKAI</text>
        </g>

        {/* 6. Mission Operating Corridor (WAYANAD SECTOR 4) */}
        <rect
          x="140"
          y="120"
          width="720"
          height="460"
          rx="12"
          fill="#0284c7"
          fillOpacity="0.04"
          stroke="#38bdf8"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          strokeOpacity="0.6"
        />
        <text x="155" y="142" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace">
          MISSION AREA // WAYANAD SECTOR 4
        </text>

        {/* 7. Operational Search Grid Cells with States */}
        {showGrid && (
          <g>
            {/* Cell (Row 0, Col 0) - Searched */}
            <rect x="220" y="180" width="120" height="90" fill="#22c55e" fillOpacity="0.12" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.3" />
            <text x="270" y="230" fill="#22c55e" fontSize="14" fontWeight="bold" textAnchor="middle">✓</text>

            {/* Cell (Row 0, Col 1) - Searched */}
            <rect x="340" y="180" width="120" height="90" fill="#22c55e" fillOpacity="0.12" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.3" />
            <text x="390" y="230" fill="#22c55e" fontSize="14" fontWeight="bold" textAnchor="middle">✓</text>

            {/* Cell (Row 0, Col 2) - Searched */}
            <rect x="460" y="180" width="120" height="90" fill="#22c55e" fillOpacity="0.12" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.3" />
            <text x="510" y="230" fill="#22c55e" fontSize="14" fontWeight="bold" textAnchor="middle">✓</text>

            {/* Cell (Row 1, Col 0) - Searched */}
            <rect x="220" y="270" width="120" height="90" fill="#22c55e" fillOpacity="0.12" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.3" />
            <text x="270" y="320" fill="#22c55e" fontSize="14" fontWeight="bold" textAnchor="middle">✓</text>

            {/* Cell (Row 1, Col 1) - ACTIVE (Drone sweeping) */}
            <rect x="340" y="270" width="120" height="90" fill="#38bdf8" fillOpacity="0.22" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="400" cy="315" r="8" fill="none" stroke="#38bdf8" strokeWidth="1.5" className="animate-ping" />
            <text x="400" y="318" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">◉ ACTIVE</text>

            {/* Cell (Row 1, Col 2) - HIGH PRIORITY */}
            <rect x="460" y="270" width="120" height="90" fill="#f59e0b" fillOpacity="0.18" stroke="#f59e0b" strokeWidth="1" />
            <text x="520" y="320" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="middle">⚠ PRIORITY</text>

            {/* Cell (Row 2, Col 0) - Searched */}
            <rect x="220" y="360" width="120" height="90" fill="#22c55e" fillOpacity="0.12" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.3" />
            <text x="270" y="410" fill="#22c55e" fontSize="14" fontWeight="bold" textAnchor="middle">✓</text>

            {/* Pending Cells */}
            <rect x="580" y="180" width="120" height="90" fill="none" stroke="#475569" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3 3" />
            <rect x="580" y="270" width="120" height="90" fill="none" stroke="#475569" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3 3" />
            <rect x="340" y="360" width="120" height="90" fill="none" stroke="#475569" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3 3" />
            <rect x="460" y="360" width="120" height="90" fill="none" stroke="#475569" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3 3" />
            <rect x="580" y="360" width="120" height="90" fill="none" stroke="#475569" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3 3" />
          </g>
        )}

        {/* 8. Geographic Hazard Zones */}
        {showHazards && (
          <g>
            {/* Flash Flood Surge Hazard Polygon */}
            <polygon
              points="380,480 460,430 550,380 620,350 660,330 620,300 520,330 420,390 350,450"
              fill="url(#floodGlow)"
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="6 3"
            />
            <g transform="translate(510, 360)">
              <rect x="-70" y="-12" width="140" height="24" rx="4" fill="#450a0a" stroke="#ef4444" strokeWidth="1" />
              <text x="0" y="2" fill="#fca5a5" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                FLASH FLOOD // CRITICAL (48m³/s)
              </text>
            </g>

            {/* Landslide Risk Zone */}
            <polygon
              points="580,240 680,210 740,250 670,290 590,270"
              fill="#f59e0b"
              fillOpacity="0.2"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <g transform="translate(650, 245)">
              <rect x="-60" y="-10" width="120" height="20" rx="3" fill="#451a03" stroke="#f59e0b" strokeWidth="1" />
              <text x="0" y="3" fill="#fde68a" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                LANDSLIDE RISK // UNSTABLE
              </text>
            </g>
          </g>
        )}

        {/* 9. Flight Path Line Segments */}
        {showFlightPath && (
          <g>
            {/* Completed Path (Dim Cyan) */}
            <path
              d="M 230,480 L 280,390 L 340,340 L 400,315"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.5"
              strokeOpacity="0.5"
            />
            {/* Active Flight Path (Bright Cyan) */}
            <line
              x1="400"
              y1="315"
              x2="480"
              y2="280"
              stroke="#38bdf8"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Directional Chevron Arrow */}
            <polygon points="480,280 468,272 472,280 468,288" fill="#38bdf8" />

            {/* Planned Lawnmower Path (Dashed Cyan) */}
            <path
              d="M 480,280 L 560,250 L 580,310 L 510,340 L 530,400"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeOpacity="0.5"
            />
          </g>
        )}

        {/* 10. Circular Survivor Markers */}
        <g>
          {survivors.map((survivor) => {
            const pos = project(survivor.location);
            const isImmediate = survivor.priority === 'CRITICAL';
            const ringColor = isImmediate ? '#ef4444' : '#f59e0b';
            const conf = Math.round(survivor.aiVerification.fusedConfidence * 100);

            return (
              <g 
                key={survivor.id} 
                transform={`translate(${pos[0]}, ${pos[1]})`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSurvivorPopup(survivor);
                }}
                className="cursor-pointer"
              >
                {/* Outer Breathing Ring */}
                <circle cx="0" cy="0" r="16" fill="none" stroke={ringColor} strokeWidth="1" strokeDasharray="3 2" className="animate-ping" />
                <circle cx="0" cy="0" r="9" fill="#080d14" stroke={ringColor} strokeWidth="2" />
                <circle cx="0" cy="0" r="3" fill="#ffffff" />

                {/* Compact Label */}
                <g transform="translate(0, 16)">
                  <rect x="-24" y="-7" width="48" height="14" rx="3" fill="#080d14" stroke={ringColor} strokeWidth="1" />
                  <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    {survivor.code || survivor.id.slice(-4)} • {conf}%
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        {/* 11. Rescue Team Subtle Operational Chips */}
        {showRescueTeams && (
          <g>
            <g transform="translate(310, 430)">
              <rect x="-30" y="-8" width="60" height="16" rx="3" fill="#0c121b" stroke="#334155" strokeWidth="1" />
              <circle cx="-20" cy="0" r="2" fill="#38bdf8" />
              <text x="0" y="3" fill="#cbd5e1" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                NDRF-04
              </text>
            </g>
            <g transform="translate(450, 480)">
              <rect x="-30" y="-8" width="60" height="16" rx="3" fill="#0c121b" stroke="#334155" strokeWidth="1" />
              <circle cx="-20" cy="0" r="2" fill="#38bdf8" />
              <text x="0" y="3" fill="#cbd5e1" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                SDRF-02
              </text>
            </g>
          </g>
        )}

        {/* 12. AERONEX PHYSICAL RESCUE DRONE MARKER */}
        <g transform={`translate(${dronePos[0]}, ${dronePos[1]})`}>
          {/* Subtle Navigation Halo */}
          <circle cx="0" cy="0" r="26" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 2" className="animate-spin duration-3000 ease-linear" opacity="0.4" />
          <circle cx="0" cy="0" r="16" fill="#080d14" stroke="#38bdf8" strokeWidth="1.5" opacity="0.8" />

          {/* Physical Drone Silhouette with Heading */}
          <g transform={`rotate(${droneHeading})`}>
            {/* Front Red Truss Arms */}
            <line x1="0" y1="0" x2="-14" y2="-14" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
            <line x1="0" y1="0" x2="14" y2="-14" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
            {/* Rear White Truss Arms */}
            <line x1="0" y1="0" x2="-14" y2="14" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
            <line x1="0" y1="0" x2="14" y2="14" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />

            {/* 4 Black Propellers with Silver Nuts */}
            <circle cx="-14" cy="-14" r="8" fill="#1e293b" fillOpacity="0.4" stroke="#020617" strokeWidth="1" />
            <circle cx="-14" cy="-14" r="1.5" fill="#e2e8f0" />

            <circle cx="14" cy="-14" r="8" fill="#1e293b" fillOpacity="0.4" stroke="#020617" strokeWidth="1" />
            <circle cx="14" cy="-14" r="1.5" fill="#e2e8f0" />

            <circle cx="-14" cy="14" r="8" fill="#1e293b" fillOpacity="0.4" stroke="#020617" strokeWidth="1" />
            <circle cx="-14" cy="14" r="1.5" fill="#e2e8f0" />

            <circle cx="14" cy="14" r="8" fill="#1e293b" fillOpacity="0.4" stroke="#020617" strokeWidth="1" />
            <circle cx="14" cy="14" r="1.5" fill="#e2e8f0" />

            {/* Central Monitor with RED Bezel */}
            <rect x="-7" y="-5" width="14" height="10" rx="1" fill="#dc2626" />
            <rect x="-5" y="-3" width="10" height="6" rx="0.5" fill="#22c55e" />

            {/* Heading Pointer */}
            <polygon points="0,-18 -3,-12 3,-12" fill="#38bdf8" />
          </g>

          {/* Telemetry Pill */}
          <g transform="translate(0, -26)">
            <rect x="-52" y="-8" width="104" height="16" rx="3" fill="#080d14" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="-42" cy="0" r="2" fill="#22c55e" />
            <text x="3" y="3" fill="#f8fafc" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              AERONEX-01 • 124m AGL
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};
