import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import { 
  Layers, 
  RotateCcw, 
  Users, 
  Radio, 
  AlertTriangle, 
  Compass, 
  Navigation,
  CheckCircle2,
  X,
  Shield,
  Eye
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { Survivor } from '../../types/survivor';
import { DisasterAlert } from '../../types/alert';
import { SyntheticGeoMap } from './SyntheticGeoMap';

export interface TacticalMapProps {
  heightClass?: string;
  focusAlertId?: string;
  onSelectSurvivor?: (survivor: Survivor) => void;
  onSelectAlert?: (alert: DisasterAlert) => void;
  interactive?: boolean;
}

export const TacticalMapLibre: React.FC<TacticalMapProps> = ({
  heightClass = 'h-[560px]',
  focusAlertId,
  onSelectSurvivor,
  onSelectAlert,
  interactive = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [useFallback, setUseFallback] = useState<boolean>(false);
  const [is3D, setIs3D] = useState<boolean>(true);
  const [selectedSurvivorPopup, setSelectedSurvivorPopup] = useState<Survivor | null>(null);

  const {
    primaryDrone,
    currentMission,
    alerts,
    survivors,
    setSelectedSurvivor,
    setSelectedAlert,
    dispatchRescue
  } = useMission();

  // Layer Visibility Toggles
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showHazards, setShowHazards] = useState<boolean>(true);
  const [showFlightPath, setShowFlightPath] = useState<boolean>(true);
  const [showRescueTeams, setShowRescueTeams] = useState<boolean>(true);

  // Initialize MapLibre with Realistic Topographic Terrain & Satellite Imagery
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    try {
      // Premium dark geographic/topographic style specification
      // Blends real high-res satellite imagery + topographic features (roads, rivers, contours) + 3D DEM elevation
      const tacticalMapStyle: maplibregl.StyleSpecification = {
        version: 8,
        sources: {
          'satellite-imagery': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            maxzoom: 19,
          },
          'topo-roads-rivers': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            maxzoom: 19,
          },
          'terrain-dem': {
            type: 'raster-dem',
            tiles: [
              'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
            ],
            encoding: 'terrarium',
            tileSize: 256,
            maxzoom: 15,
          },
        },
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: { 'background-color': '#060B12' },
          },
          {
            id: 'satellite-layer',
            type: 'raster',
            source: 'satellite-imagery',
            paint: {
              'raster-opacity': 0.7,
              'raster-saturation': -0.45,
              'raster-contrast': 0.2,
              'raster-brightness-max': 0.85,
            },
          },
          {
            id: 'topo-layer',
            type: 'raster',
            source: 'topo-roads-rivers',
            paint: {
              'raster-opacity': 0.35,
              'raster-saturation': -0.6,
              'raster-contrast': 0.3,
            },
          },
        ],
        terrain: {
          source: 'terrain-dem',
          exaggeration: 2.2, // Renders realistic 3D mountain ridges and river valleys in Wayanad
        },
      };

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: tacticalMapStyle,
        center: [primaryDrone.currentLocation[1], primaryDrone.currentLocation[0]], // [lng, lat]
        zoom: 13.6,
        pitch: 42, // Default tactical 3D pitch
        bearing: -15,
        attributionControl: false,
        interactive: interactive,
        scrollZoom: true,
        dragPan: true,
        dragRotate: true,
        doubleClickZoom: true,
        touchZoomRotate: true,
      });

      map.on('error', () => {
        setUseFallback(true);
      });

      map.on('load', () => {
        mapInstanceRef.current = map;

        // Try setting 3D terrain
        try {
          map.setTerrain({ source: 'terrain-dem', exaggeration: 2.2 });
        } catch (e) {
          // Terrain supported without crash
        }

        // ============================================================
        // 1. MISSION OPERATING CORRIDOR (WAYANAD SECTOR 4)
        // ============================================================
        map.addSource('mission-corridor', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [76.098, 11.516],
                [76.162, 11.516],
                [76.162, 11.572],
                [76.098, 11.572],
                [76.098, 11.516],
              ]],
            },
            properties: {},
          },
        });

        map.addLayer({
          id: 'corridor-fill',
          type: 'fill',
          source: 'mission-corridor',
          paint: {
            'fill-color': '#0284c7',
            'fill-opacity': 0.04,
          },
        });

        map.addLayer({
          id: 'corridor-line',
          type: 'line',
          source: 'mission-corridor',
          paint: {
            'line-color': '#38bdf8',
            'line-width': 1.5,
            'line-dasharray': [4, 4],
            'line-opacity': 0.65,
          },
        });

        // ============================================================
        // 2. OPERATIONAL SEARCH GRID CELLS (WITH CELL STATES)
        // ============================================================
        const gridFeatures: any[] = [];
        const cols = [76.106, 76.119, 76.132, 76.145, 76.158];
        const rows = [11.520, 11.530, 11.540, 11.550, 11.560];

        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            let status = 'SEARCHED';
            let color = '#22c55e'; // Searched green
            let opacity = 0.12;

            if (r === 2 && c === 1) {
              status = 'ACTIVE';
              color = '#38bdf8'; // Active cyan
              opacity = 0.26;
            } else if (r === 2 && c === 2) {
              status = 'HIGH_PRIORITY';
              color = '#f59e0b'; // Priority amber
              opacity = 0.2;
            } else if (r >= 2) {
              status = 'PENDING';
              color = '#94a3b8';
              opacity = 0.03;
            }

            gridFeatures.push({
              type: 'Feature',
              properties: { status, color, opacity, id: `CELL-${r}-${c}` },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [cols[c], rows[r]],
                  [cols[c + 1], rows[r]],
                  [cols[c + 1], rows[r + 1]],
                  [cols[c], rows[r + 1]],
                  [cols[c], rows[r]],
                ]],
              },
            });
          }
        }

        map.addSource('search-grid-cells', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: gridFeatures,
          },
        });

        map.addLayer({
          id: 'grid-cells-fill',
          type: 'fill',
          source: 'search-grid-cells',
          paint: {
            'fill-color': ['get', 'color'],
            'fill-opacity': ['get', 'opacity'],
          },
        });

        map.addLayer({
          id: 'grid-cells-stroke',
          type: 'line',
          source: 'search-grid-cells',
          paint: {
            'line-color': ['get', 'color'],
            'line-width': 1,
            'line-opacity': 0.35,
          },
        });

        // ============================================================
        // 3. FLIGHT PATH ROUTE (COMPLETED, ACTIVE, PLANNED)
        // ============================================================
        // Completed route
        map.addSource('flight-completed', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [76.110, 11.524],
                [76.118, 11.530],
                [76.124, 11.534],
                [primaryDrone.currentLocation[1], primaryDrone.currentLocation[0]],
              ],
            },
            properties: {},
          },
        });

        map.addLayer({
          id: 'route-completed-line',
          type: 'line',
          source: 'flight-completed',
          paint: {
            'line-color': '#0284c7',
            'line-width': 2.5,
            'line-opacity': 0.5,
          },
        });

        // Active segment with directional pulse
        map.addSource('flight-active', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [primaryDrone.currentLocation[1], primaryDrone.currentLocation[0]],
                [76.136, 11.542],
              ],
            },
            properties: {},
          },
        });

        map.addLayer({
          id: 'route-active-line',
          type: 'line',
          source: 'flight-active',
          paint: {
            'line-color': '#38bdf8',
            'line-width': 3.5,
            'line-opacity': 0.95,
          },
        });

        // Planned lawmower grid flight path
        map.addSource('flight-planned', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [76.136, 11.542],
                [76.145, 11.545],
                [76.148, 11.554],
                [76.132, 11.556],
                [76.134, 11.564],
              ],
            },
            properties: {},
          },
        });

        map.addLayer({
          id: 'route-planned-line',
          type: 'line',
          source: 'flight-planned',
          paint: {
            'line-color': '#38bdf8',
            'line-width': 2,
            'line-dasharray': [3, 3],
            'line-opacity': 0.55,
          },
        });

        // ============================================================
        // 4. GEOGRAPHIC HAZARD ZONES (FLASH FLOOD SURGE & LANDSLIDE)
        // ============================================================
        // Flash Flood Basin Polygon along Chaliyar river
        map.addSource('hazard-flood', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [76.115, 11.522],
                [76.122, 11.528],
                [76.131, 11.535],
                [76.138, 11.544],
                [76.145, 11.548],
                [76.140, 11.552],
                [76.128, 11.543],
                [76.119, 11.533],
                [76.112, 11.526],
                [76.115, 11.522],
              ]],
            },
            properties: {},
          },
        });

        map.addLayer({
          id: 'flood-fill',
          type: 'fill',
          source: 'hazard-flood',
          paint: {
            'fill-color': '#ef4444',
            'fill-opacity': 0.28,
          },
        });

        map.addLayer({
          id: 'flood-stroke',
          type: 'line',
          source: 'hazard-flood',
          paint: {
            'line-color': '#ef4444',
            'line-width': 2,
            'line-dasharray': [4, 2],
            'line-opacity': 0.85,
          },
        });

        // Landslide Slope Debris Polygon near Meppadi
        map.addSource('hazard-landslide', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [76.138, 11.548],
                [76.152, 11.551],
                [76.156, 11.559],
                [76.142, 11.557],
                [76.138, 11.548],
              ]],
            },
            properties: {},
          },
        });

        map.addLayer({
          id: 'landslide-fill',
          type: 'fill',
          source: 'hazard-landslide',
          paint: {
            'fill-color': '#f59e0b',
            'fill-opacity': 0.22,
          },
        });

        map.addLayer({
          id: 'landslide-stroke',
          type: 'line',
          source: 'hazard-landslide',
          paint: {
            'line-color': '#f59e0b',
            'line-width': 1.5,
            'line-dasharray': [3, 3],
            'line-opacity': 0.8,
          },
        });
      });

      mapInstanceRef.current = map;
    } catch (err) {
      setUseFallback(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [interactive]);

  // Update Dynamic HTML Markers (Drone, Survivors, Hazard Badges, Rescue Teams)
  useEffect(() => {
    if (useFallback || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear previous markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // ============================================================
    // 1. PHYSICAL AERONEX DRONE MARKER (MATCHING REAL DRONE HARDWARE)
    // ============================================================
    const droneEl = document.createElement('div');
    droneEl.className = 'relative flex items-center justify-center cursor-pointer select-none';
    droneEl.innerHTML = `
      <!-- Subtle Navigation Halo -->
      <div class="absolute w-12 h-12 rounded-full bg-cyan-500/15 border border-cyan-400/40 animate-ping"></div>
      <div class="absolute w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-400/30"></div>

      <!-- Real AERONEX Drone Silhouette: 2 Red Front Arms, 2 White Rear Arms, 4 Black Props, Central Screen -->
      <div class="relative w-8 h-8 flex items-center justify-center" style="transform: rotate(${primaryDrone.telemetry.headingDeg}deg);">
        <svg viewBox="0 0 100 100" class="w-8 h-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          <!-- Front Left Red Arm -->
          <line x1="50" y1="50" x2="20" y2="20" stroke="#DC2626" stroke-width="7" stroke-linecap="round"/>
          <!-- Front Right Red Arm -->
          <line x1="50" y1="50" x2="80" y2="20" stroke="#DC2626" stroke-width="7" stroke-linecap="round"/>
          <!-- Rear Left White Arm -->
          <line x1="50" y1="50" x2="20" y2="80" stroke="#F8FAFC" stroke-width="7" stroke-linecap="round"/>
          <!-- Rear Right White Arm -->
          <line x1="50" y1="50" x2="80" y2="80" stroke="#F8FAFC" stroke-width="7" stroke-linecap="round"/>

          <!-- 4 Black 2-Blade Propellers with Silver Spinner Nuts -->
          <!-- Prop FL -->
          <circle cx="20" cy="20" r="15" fill="#1E293B" fill-opacity="0.3" stroke="#0F172A" stroke-width="1.5"/>
          <ellipse cx="20" cy="20" rx="14" ry="4" fill="#020617" transform="rotate(30 20 20)"/>
          <circle cx="20" cy="20" r="3" fill="#E2E8F0"/>
          <!-- Prop FR -->
          <circle cx="80" cy="20" r="15" fill="#1E293B" fill-opacity="0.3" stroke="#0F172A" stroke-width="1.5"/>
          <ellipse cx="80" cy="20" rx="14" ry="4" fill="#020617" transform="rotate(-30 80 20)"/>
          <circle cx="80" cy="20" r="3" fill="#E2E8F0"/>
          <!-- Prop RL -->
          <circle cx="20" cy="80" r="15" fill="#1E293B" fill-opacity="0.3" stroke="#0F172A" stroke-width="1.5"/>
          <ellipse cx="20" cy="80" rx="14" ry="4" fill="#020617" transform="rotate(-30 20 80)"/>
          <circle cx="20" cy="80" r="3" fill="#E2E8F0"/>
          <!-- Prop RR -->
          <circle cx="80" cy="80" r="15" fill="#1E293B" fill-opacity="0.3" stroke="#0F172A" stroke-width="1.5"/>
          <ellipse cx="80" cy="80" rx="14" ry="4" fill="#020617" transform="rotate(30 80 80)"/>
          <circle cx="80" cy="80" r="3" fill="#E2E8F0"/>

          <!-- Central Frame Base (Black) -->
          <rect x="36" y="36" width="28" height="28" rx="4" fill="#0F172A" stroke="#334155" stroke-width="1.5"/>

          <!-- Central Onboard Display Monitor with RED Bezel & Glowing Screen -->
          <rect x="33" y="37" width="34" height="22" rx="2" fill="#DC2626" stroke="#EF4444" stroke-width="1"/>
          <rect x="36" y="40" width="28" height="16" rx="1" fill="#030712"/>
          <rect x="38" y="42" width="24" height="12" rx="1" fill="#22C55E" fill-opacity="0.9"/>

          <!-- Forward Flight Vector Arrow -->
          <polygon points="50,14 46,24 54,24" fill="#38BDF8"/>
        </svg>
      </div>

      <!-- Compact Drone Altitude Callout Pill -->
      <div class="absolute -bottom-6 px-1.5 py-0.5 rounded bg-[#080D14]/95 border border-cyan-400/40 text-[9px] font-mono font-bold text-white whitespace-nowrap shadow-xl flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping"></span>
        <span>AERONEX-01 • 124m AGL</span>
      </div>
    `;

    const droneMarker = new maplibregl.Marker({ element: droneEl })
      .setLngLat([primaryDrone.currentLocation[1], primaryDrone.currentLocation[0]])
      .addTo(map);
    markersRef.current.push(droneMarker);

    // ============================================================
    // 2. SURVIVOR RESCUE MARKERS (CIRCULAR RESCUE SYMBOLS)
    // ============================================================
    survivors.forEach(survivor => {
      const isVerified = survivor.status === 'VERIFIED';
      const isImmediate = survivor.priority === 'CRITICAL';
      const ringColor = isImmediate ? '#EF4444' : '#F59E0B';
      const confPercent = Math.round(survivor.aiVerification.fusedConfidence * 100);

      const surEl = document.createElement('div');
      surEl.className = 'relative flex items-center justify-center cursor-pointer group select-none';
      surEl.innerHTML = `
        <!-- Outer Coral Breathing Ring -->
        <div class="absolute w-7 h-7 rounded-full bg-red-500/20 border border-red-500/40 animate-ping"></div>
        <div class="relative w-5 h-5 rounded-full bg-[#080D14] border-2 flex items-center justify-center shadow-lg" style="border-color: ${ringColor};">
          <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>
        <!-- Compact Label -->
        <div class="absolute -bottom-4 px-1.5 py-0.2 rounded bg-[#080D14]/95 border text-[9px] font-mono font-bold text-white whitespace-nowrap shadow-md" style="border-color: ${ringColor};">
          ${survivor.code || survivor.id.slice(-4)} • ${confPercent}%
        </div>
      `;

      surEl.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedSurvivorPopup(survivor);
        if (onSelectSurvivor) onSelectSurvivor(survivor);
        else setSelectedSurvivor(survivor);
      });

      const surMarker = new maplibregl.Marker({ element: surEl })
        .setLngLat([survivor.location[1], survivor.location[0]])
        .addTo(map);
      markersRef.current.push(surMarker);
    });

    // ============================================================
    // 3. HAZARD ZONE PERIMETER CALLOUT BADGE
    // ============================================================
    if (showHazards) {
      const floodBadgeEl = document.createElement('div');
      floodBadgeEl.className = 'cursor-pointer select-none';
      floodBadgeEl.innerHTML = `
        <div class="px-2 py-1 rounded-md bg-red-950/90 border border-red-500/60 text-red-200 font-mono text-[9px] font-bold shadow-xl flex items-center gap-1.5 backdrop-blur-md">
          <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span>FLASH FLOOD // CRITICAL • 48.2 m³/s</span>
        </div>
      `;
      const floodMarker = new maplibregl.Marker({ element: floodBadgeEl })
        .setLngLat([76.136, 11.538])
        .addTo(map);
      markersRef.current.push(floodMarker);
    }

    // ============================================================
    // 4. RESCUE TEAMS (SUBTLE COMPACT OPERATIONAL CHIPS)
    // ============================================================
    if (showRescueTeams) {
      const teams = [
        { id: 'NDRF-04', coords: [76.1180, 11.5280], name: 'NDRF-04 (8 Units)' },
        { id: 'SDRF-02', coords: [76.1340, 11.5450], name: 'SDRF-02 (Boat)' },
      ];

      teams.forEach(t => {
        const teamEl = document.createElement('div');
        teamEl.className = 'cursor-pointer select-none';
        teamEl.innerHTML = `
          <div class="px-1.5 py-0.5 rounded bg-[#0C121B]/90 border border-slate-700 text-slate-300 font-mono text-[9px] font-bold shadow-md flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"></span>
            <span>${t.id}</span>
          </div>
        `;
        const tMarker = new maplibregl.Marker({ element: teamEl })
          .setLngLat([t.coords[0], t.coords[1]])
          .addTo(map);
        markersRef.current.push(tMarker);
      });
    }

  }, [useFallback, primaryDrone.currentLocation, primaryDrone.telemetry.headingDeg, survivors, showHazards, showRescueTeams]);

  // Recenter Handler
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [primaryDrone.currentLocation[1], primaryDrone.currentLocation[0]],
        zoom: 14.2,
        pitch: is3D ? 45 : 0,
        bearing: is3D ? -15 : 0,
        essential: true,
      });
    }
  };

  // 2D vs 3D Perspective Toggle
  const toggle3D = () => {
    if (mapInstanceRef.current) {
      const next3D = !is3D;
      setIs3D(next3D);
      mapInstanceRef.current.easeTo({
        pitch: next3D ? 45 : 0,
        bearing: next3D ? -15 : 0,
        duration: 900,
      });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  if (useFallback) {
    return (
      <SyntheticGeoMap
        heightClass={heightClass}
        isFallback={false}
        onSelectSurvivor={onSelectSurvivor}
        onSelectAlert={onSelectAlert}
        interactive={interactive}
      />
    );
  }

  return (
    <div 
      onClick={() => setSelectedSurvivorPopup(null)}
      className={`relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#060B12] shadow-2xl select-none ${heightClass}`}
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
          onClick={(e) => { e.stopPropagation(); handleRecenter(); }}
          className="px-2 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 font-bold border border-sky-500/40 flex items-center gap-1 transition-colors text-[10px]"
          title="Center map on Drone-01"
        >
          <Navigation className="w-3 h-3" />
          <span>DRONE</span>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); toggle3D(); }}
          className={`px-2 py-1 rounded-lg font-bold border transition-colors flex items-center gap-1 text-[10px] ${
            is3D 
              ? 'bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/40' 
              : 'bg-white/5 text-slate-400 border-white/10'
          }`}
          title="Toggle 3D Terrain Perspective vs 2D Overhead"
        >
          <Compass className="w-3 h-3" />
          <span>{is3D ? '3D 45°' : '2D TOP'}</span>
        </button>

        <div className="h-4 w-px bg-white/10 mx-0.5" />

        <button
          onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition-colors"
          title="Zoom In (+)"
        >
          +
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition-colors"
          title="Zoom Out (-)"
        >
          -
        </button>
      </div>

      {/* ============================================================ */}
      {/* 3. LAYER TOGGLES (BOTTOM-LEFT)                               */}
      {/* ============================================================ */}
      <div className="absolute bottom-3 left-3 z-30 bg-[#080D14]/90 backdrop-blur-md rounded-xl p-1.5 border border-white/10 shadow-xl flex items-center gap-1 text-[10px] font-mono">
        <span className="text-[9px] font-bold text-slate-500 uppercase px-1">LAYERS:</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowHazards(!showHazards);
            if (mapInstanceRef.current) {
              const vis = !showHazards ? 'visible' : 'none';
              if (mapInstanceRef.current.getLayer('flood-fill')) {
                mapInstanceRef.current.setLayoutProperty('flood-fill', 'visibility', vis);
                mapInstanceRef.current.setLayoutProperty('flood-stroke', 'visibility', vis);
                mapInstanceRef.current.setLayoutProperty('landslide-fill', 'visibility', vis);
                mapInstanceRef.current.setLayoutProperty('landslide-stroke', 'visibility', vis);
              }
            }
          }}
          className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
            showHazards ? 'bg-red-500/20 text-[#EF4444] font-bold border border-red-500/40' : 'bg-white/5 text-slate-400'
          }`}
        >
          <span>Hazards</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowGrid(!showGrid);
            if (mapInstanceRef.current) {
              const vis = !showGrid ? 'visible' : 'none';
              if (mapInstanceRef.current.getLayer('grid-cells-fill')) {
                mapInstanceRef.current.setLayoutProperty('grid-cells-fill', 'visibility', vis);
                mapInstanceRef.current.setLayoutProperty('grid-cells-stroke', 'visibility', vis);
              }
            }
          }}
          className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
            showGrid ? 'bg-emerald-500/20 text-[#22C55E] font-bold border border-emerald-500/40' : 'bg-white/5 text-slate-400'
          }`}
        >
          <span>Search Grid</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowFlightPath(!showFlightPath);
            if (mapInstanceRef.current) {
              const vis = !showFlightPath ? 'visible' : 'none';
              if (mapInstanceRef.current.getLayer('route-completed-line')) {
                mapInstanceRef.current.setLayoutProperty('route-completed-line', 'visibility', vis);
                mapInstanceRef.current.setLayoutProperty('route-active-line', 'visibility', vis);
                mapInstanceRef.current.setLayoutProperty('route-planned-line', 'visibility', vis);
              }
            }
          }}
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
      {/* 4. COMPACT FLOATING SURVIVOR INTELLIGENCE POPUP (ON SELECT)   */}
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
              <span className="text-slate-400">THERMAL SIGNATURE:</span>
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
            <div className="flex justify-between">
              <span className="text-slate-400">CONDITION:</span>
              <span className="text-slate-200">
                {selectedSurvivorPopup.estimatedCondition.replace('_', ' ')}
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

      {/* MapLibre DOM Mount */}
      <div ref={mapContainerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
