export type SearchPattern = 'CREEPING_LINE' | 'EXPANDING_SQUARE' | 'SECTOR_SEARCH' | 'CONTOUR_FOLLOW';

export type GridCellStatus = 'SEARCHED' | 'SEARCHING' | 'PENDING' | 'SURVIVOR_FOUND';

export interface GridCell {
  id: string;
  bounds: [[number, number], [number, number]]; // southWest, northEast
  status: GridCellStatus;
  searchedAt?: string;
  droneId?: string;
  hasSurvivor?: boolean;
}

export interface MissionEvent {
  id: string;
  timestamp: string;
  timeOffsetSec: number;
  type: 'DEPLOY' | 'SEARCH_START' | 'ALERT_RECEIVED' | 'ROUTE_REROUTED' | 'SURVIVOR_DETECTED' | 'SURVIVOR_VERIFIED' | 'RESCUE_DISPATCHED' | 'COMPLETED';
  title: string;
  description: string;
  coordinates?: [number, number];
  severity?: 'info' | 'warning' | 'critical' | 'success';
}

export interface Mission {
  id: string;
  code: string; // e.g. "MISSION-04"
  name: string;
  locationName: string;
  state: string;
  status: 'ACTIVE' | 'PAUSED' | 'RETURNING' | 'REROUTING' | 'COMPLETED';
  assignedDroneId: string;
  pattern: SearchPattern;
  totalAreaKm2: number;
  searchedAreaKm2: number;
  searchEfficiencyHaPerMin: number;
  remainingAreaKm2: number;
  estimatedCompletionMinutes: number;
  startedAt: string;
  completedAt?: string;
  gridCells: GridCell[];
  events: MissionEvent[];
  survivorIds: string[];
}
