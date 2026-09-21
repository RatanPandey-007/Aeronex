export type SubsystemStatus = 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE';

export interface Subsystem {
  id: string;
  name: string;
  subTitle: string;
  status: SubsystemStatus;
  latencyMs: number;
  lastPing: string;
  metrics: {
    label: string;
    value: string;
  }[];
  details: string;
}

export interface SystemStatusData {
  overallStatus: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
  activeDronesCount: number;
  aiInferenceFps: number;
  meshSignalPercent: number;
  gpsFixStatus: string;
  alertNetworkLatencyMs: number;
  subsystems: Subsystem[];
}
