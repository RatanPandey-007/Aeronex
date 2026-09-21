export interface DroneTelemetry {
  batteryPercent: number;
  batteryVoltage: number;
  batteryTempC: number;
  altitudeM: number;
  groundSpeedMs: number;
  headingDeg: number;
  pitchDeg: number;
  rollDeg: number;
  satellites: number;
  gpsFix: 'RTK_FIXED' | 'RTK_FLOAT' | '3D_FIX' | 'NO_FIX';
  signalRssiDbm: number;
  linkQualityPercent: number;
  flightMode: 'AUTONOMOUS_SEARCH' | 'MANUAL_OVERRIDE' | 'RETURN_TO_HOME' | 'HOLD_ORBIT' | 'REROUTING';
  flightTimeSeconds: number;
  distanceFlownKm: number;
}

export interface DronePayload {
  opticalCamera: {
    resolution: string;
    zoomLevel: number;
    fps: number;
    recording: boolean;
  };
  thermalSensor: {
    model: string;
    palette: 'IRONBOW' | 'WHITE_HOT' | 'BLACK_HOT' | 'RAINBOW';
    minTempC: number;
    maxTempC: number;
  };
  lidar: {
    active: boolean;
    pointsPerSec: number;
    obstacleDistanceM: number;
  };
}

export interface Drone {
  id: string;
  callsign: string;
  model: string;
  status: 'ACTIVE_SEARCH' | 'EN_ROUTE' | 'REROUTING' | 'RETURNING' | 'STANDBY' | 'MAINTENANCE';
  currentLocation: [number, number]; // [lat, lng]
  waypoints: [number, number][];
  currentWaypointIndex: number;
  homeLocation: [number, number];
  telemetry: DroneTelemetry;
  payload: DronePayload;
  assignedMissionId: string | null;
}
