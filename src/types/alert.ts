export type HazardType = 
  | 'FLASH_FLOOD'
  | 'LANDSLIDE'
  | 'CYCLONE'
  | 'EARTHQUAKE'
  | 'WILDFIRE'
  | 'EXTREME_RAINFALL'
  | 'STORM'
  | 'HEATWAVE';

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'WATCH' | 'MONITORING';

export interface MissionImpact {
  affectedMissionId: string;
  affectedDroneId: string;
  riskLevel: 'HIGH' | 'MODERATE' | 'LOW';
  impactDescription: string;
  corridorIntersectionKm2: number;
  batteryImpactPercent: number;
  commsDegradationPercent: number;
  recommendedAction: string;
  recommendedShiftEastKm: number;
  recommendationAccepted: boolean;
}

export interface DisasterAlert {
  id: string;
  hazardType: HazardType;
  title: string;
  severity: AlertSeverity;
  regionName: string;
  state: string;
  centerLocation: [number, number]; // [lat, lng]
  polygonCoordinates: [number, number][]; // boundary polygon
  affectedAreaKm2: number;
  populationAtRisk: number;
  issuedAt: string;
  lastUpdatedAt: string;
  expectedDurationHours: number;
  sourceAgency: string; // e.g. "SACHET / NDMA Integrated Feed"
  weatherConditions: {
    rainfallMmHr: number;
    windGustKmh: number;
    riverLevelRiseM?: number;
    slopeInstabilityIndex?: number;
  };
  missionImpact?: MissionImpact;
}
