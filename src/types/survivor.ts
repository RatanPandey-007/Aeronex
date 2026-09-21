export type SurvivorStatus = 
  | 'VERIFIED' 
  | 'PENDING_VERIFICATION' 
  | 'FALSE_DETECTION' 
  | 'RESCUE_DISPATCHED' 
  | 'RESCUED';

export type SurvivorPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'MONITOR';

export interface AiVerificationDetails {
  rawOpticalConfidence: number;
  thermalConfidence: number;
  fusedConfidence: number;
  multiFrameTrackingFrames: number;
  multiFrameConsistencyPercent: number;
  thermalSurfaceTempC: number;
  morphologyMatchPercent: number;
  temporalPersistenceSec: number;
  verificationDecision: 'CONFIRMED' | 'ANALYZING' | 'REJECTED';
}

export interface Survivor {
  id: string;
  code: string; // e.g. "S-01"
  status: SurvivorStatus;
  priority: SurvivorPriority;
  location: [number, number];
  mgrsGrid: string;
  zone: string;
  detectedAt: string;
  detectedByDroneId: string;
  movementStatus: 'IMMOBILE' | 'WEAK_MOVEMENT' | 'ACTIVE_SIGNALING';
  estimatedCondition: 'CRITICAL_TRAUMA' | 'HYPOTHERMIA_RISK' | 'TRAPPED_DEBRIS' | 'STABLE_ISOLATED';
  temperatureC: number;
  aiVerification: AiVerificationDetails;
  nearestRescueTeam: {
    teamName: string;
    distanceKm: number;
    etaMinutes: number;
    teamType: 'NDRF_QRT' | 'SDRF_BOAT' | 'AIR_AMBULANCE';
  };
  priorityFactors: {
    label: string;
    weight: string;
    severity: 'critical' | 'warning' | 'info';
  }[];
  notes: string;
}
