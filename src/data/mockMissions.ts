import { Mission, GridCell } from '../types/mission';

// Helper to generate a realistic search grid for Zone Alpha
const generateAlphaGrid = (): GridCell[] => {
  const cells: GridCell[] = [];
  const startLat = 11.528;
  const startLng = 76.110;
  const latStep = 0.004;
  const lngStep = 0.005;

  let idCounter = 1;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 6; c++) {
      const sLat = startLat + r * latStep;
      const sLng = startLng + c * lngStep;
      const id = `G-${String(idCounter++).padStart(2, '0')}`;
      
      let status: GridCell['status'] = 'PENDING';
      let hasSurvivor = false;

      // Simulate current progress
      if (r < 2 || (r === 2 && c <= 2)) {
        status = 'SEARCHED';
      } else if (r === 2 && c === 3) {
        status = 'SEARCHING';
      }

      // Mark cell with detected survivor S-01
      if (r === 2 && c === 4) {
        status = 'SURVIVOR_FOUND';
        hasSurvivor = true;
      }

      cells.push({
        id,
        bounds: [
          [sLat, sLng],
          [sLat + latStep, sLng + lngStep],
        ],
        status,
        hasSurvivor,
        droneId: 'ANX-SAR-03',
        searchedAt: status === 'SEARCHED' ? '14:25 IST' : undefined,
      });
    }
  }
  return cells;
};

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'MISSION-04',
    code: 'MISSION-04',
    name: 'Wayanad Sector 4 — Meppadi Flash Flood Sweep',
    locationName: 'Chaliyar River Basin, Zone Alpha',
    state: 'Kerala',
    status: 'ACTIVE',
    assignedDroneId: 'ANX-SAR-03',
    pattern: 'CREEPING_LINE',
    totalAreaKm2: 12.5,
    searchedAreaKm2: 8.55,
    searchEfficiencyHaPerMin: 2.8,
    remainingAreaKm2: 3.95,
    estimatedCompletionMinutes: 22,
    startedAt: '14:10:00 IST',
    gridCells: generateAlphaGrid(),
    survivorIds: ['SURV-001', 'SURV-002', 'SURV-004'],
    events: [
      {
        id: 'EVT-01',
        timestamp: '14:10:00',
        timeOffsetSec: 0,
        type: 'DEPLOY',
        title: 'Autonomous Launch & Takeoff',
        description: 'Valkyrie-03 launched from Tactical Base Alpha. Climbed to 65m AGL with RTK-Fixed GNSS.',
        coordinates: [11.5200, 76.1000],
        severity: 'info',
      },
      {
        id: 'EVT-02',
        timestamp: '14:12:45',
        timeOffsetSec: 165,
        type: 'SEARCH_START',
        title: 'Search Grid Commenced',
        description: 'Initiated Creeping Line autonomous sweep pattern over Grid Cell G-01 to G-06.',
        coordinates: [11.5310, 76.1150],
        severity: 'info',
      },
      {
        id: 'EVT-03',
        timestamp: '14:32:10',
        timeOffsetSec: 1330,
        type: 'ALERT_RECEIVED',
        title: 'Flash Flood Early Warning Received',
        description: 'SACHET Disaster Alert ingested. Hazard perimeter intersecting planned corridor at waypoint 4.',
        coordinates: [11.5350, 76.1200],
        severity: 'warning',
      },
      {
        id: 'EVT-04',
        timestamp: '14:33:40',
        timeOffsetSec: 1420,
        type: 'ROUTE_REROUTED',
        title: 'Autonomous Corridor Shift Accepted',
        description: 'Shifted search corridor 1.8 km East along ridgeline to circumvent turbulent river gorge.',
        coordinates: [11.5365, 76.1265],
        severity: 'success',
      },
      {
        id: 'EVT-05',
        timestamp: '14:38:12',
        timeOffsetSec: 1692,
        type: 'SURVIVOR_DETECTED',
        title: 'FLIR Radiometric Anomaly S-01',
        description: 'Thermal anomaly detected (+14.8°C differential) at river sandbar root cluster.',
        coordinates: [11.5385, 76.1330],
        severity: 'critical',
      },
      {
        id: 'EVT-06',
        timestamp: '14:39:04',
        timeOffsetSec: 1744,
        type: 'SURVIVOR_VERIFIED',
        title: 'Multi-Frame AI Verification Confirmed',
        description: 'Neural detector confirmed human morphology (96.4% confidence across 15 temporal frames).',
        coordinates: [11.5385, 76.1330],
        severity: 'success',
      },
      {
        id: 'EVT-07',
        timestamp: '14:41:20',
        timeOffsetSec: 1880,
        type: 'RESCUE_DISPATCHED',
        title: 'Tactical Rescue Dispatched',
        description: 'NDRF Quick Response Team Bravo-02 dispatched with motorized inflatable raft (ETA: 8 min).',
        coordinates: [11.5385, 76.1330],
        severity: 'success',
      },
    ],
  },
  {
    id: 'MISSION-02',
    code: 'MISSION-02',
    name: 'Meppadi Ridge — Sector 2B Landslide Sweep',
    locationName: 'Meppadi Hillsides',
    state: 'Kerala',
    status: 'ACTIVE',
    assignedDroneId: 'ANX-SAR-02',
    pattern: 'CONTOUR_FOLLOW',
    totalAreaKm2: 8.2,
    searchedAreaKm2: 4.4,
    searchEfficiencyHaPerMin: 2.1,
    remainingAreaKm2: 3.8,
    estimatedCompletionMinutes: 34,
    startedAt: '13:45:00 IST',
    gridCells: [],
    survivorIds: ['SURV-003'],
    events: [],
  },
  {
    id: 'MISSION-01',
    code: 'MISSION-01',
    name: 'Vythiri Road Access & Clearance Recon',
    locationName: 'Vythiri Highway Sector',
    state: 'Kerala',
    status: 'COMPLETED',
    assignedDroneId: 'ANX-SAR-01',
    pattern: 'EXPANDING_SQUARE',
    totalAreaKm2: 15.0,
    searchedAreaKm2: 15.0,
    searchEfficiencyHaPerMin: 3.4,
    remainingAreaKm2: 0,
    estimatedCompletionMinutes: 0,
    startedAt: '12:30:00 IST',
    completedAt: '14:05:00 IST',
    gridCells: [],
    survivorIds: ['SURV-005'],
    events: [],
  },
];
