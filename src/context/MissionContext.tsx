import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Drone } from '../types/drone';
import { DisasterAlert } from '../types/alert';
import { Survivor } from '../types/survivor';
import { Mission, SearchPattern } from '../types/mission';
import { SystemStatusData } from '../types/system';
import { INITIAL_DRONES } from '../data/mockDrones';
import { INITIAL_ALERTS } from '../data/mockAlerts';
import { INITIAL_SURVIVORS } from '../data/mockSurvivors';
import { INITIAL_MISSIONS } from '../data/mockMissions';
import { INITIAL_SYSTEM_STATUS } from '../data/mockSystem';

export interface ToastNotification {
  id: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  message: string;
  timestamp: string;
}

interface MissionContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  drones: Drone[];
  alerts: DisasterAlert[];
  survivors: Survivor[];
  missions: Mission[];
  currentMission: Mission;
  primaryDrone: Drone;
  systemStatus: SystemStatusData;
  isSystemDrawerOpen: boolean;
  setIsSystemDrawerOpen: (open: boolean) => void;
  selectedAlert: DisasterAlert | null;
  setSelectedAlert: (alert: DisasterAlert | null) => void;
  selectedSurvivor: Survivor | null;
  setSelectedSurvivor: (survivor: Survivor | null) => void;
  isRerouteModalOpen: boolean;
  setIsRerouteModalOpen: (open: boolean) => void;
  toasts: ToastNotification[];
  dismissToast: (id: string) => void;
  addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => void;
  // Mission Operational Actions
  pauseMission: () => void;
  resumeMission: () => void;
  emergencyReturnHome: () => void;
  recalculateRoute: () => void;
  acceptRerouteRecommendation: (alertId: string) => void;
  changeSearchPattern: (pattern: SearchPattern) => void;
  // Survivor Actions
  confirmSurvivorDetection: (survivorId: string) => void;
  markFalseDetection: (survivorId: string) => void;
  dispatchRescue: (survivorId: string) => void;
  // Demo Mode
  isDemoActive: boolean;
  demoStep: number;
  startDemo: () => void;
  stopDemo: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  goToDemoStep: (step: number) => void;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [drones, setDrones] = useState<Drone[]>(INITIAL_DRONES);
  const [alerts, setAlerts] = useState<DisasterAlert[]>(INITIAL_ALERTS);
  const [survivors, setSurvivors] = useState<Survivor[]>(INITIAL_SURVIVORS);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [systemStatus] = useState<SystemStatusData>(INITIAL_SYSTEM_STATUS);
  const [isSystemDrawerOpen, setIsSystemDrawerOpen] = useState<boolean>(false);
  const [selectedAlert, setSelectedAlert] = useState<DisasterAlert | null>(null);
  const [selectedSurvivor, setSelectedSurvivor] = useState<Survivor | null>(null);
  const [isRerouteModalOpen, setIsRerouteModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([
    {
      id: 'toast-1',
      type: 'critical',
      title: 'CRITICAL DISASTER ALERT',
      message: 'Flash flood alert issued for Zone Alpha. Mission-04 corridor impact detected.',
      timestamp: '14:32 IST',
    },
  ]);

  // Demo Mode State
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(1);

  const currentMission = missions.find(m => m.id === 'MISSION-04') || missions[0];
  const primaryDrone = drones.find(d => d.id === currentMission.assignedDroneId) || drones[0];

  const addToast = (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} IST`;
    setToasts(prev => [
      { ...toast, id, timestamp: timeStr },
      ...prev.slice(0, 4),
    ]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Subtle real-time telemetry ticker for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setDrones(prevDrones =>
        prevDrones.map(drone => {
          if (drone.status !== 'ACTIVE_SEARCH' && drone.status !== 'REROUTING') {
            return drone;
          }

          // Micro jitter in altitude and speed
          const altJitter = (Math.random() - 0.5) * 0.4;
          const speedJitter = (Math.random() - 0.5) * 0.3;
          const newAlt = Math.max(50, Math.min(120, +(drone.telemetry.altitudeM + altJitter).toFixed(1)));
          const newSpeed = Math.max(10, Math.min(18, +(drone.telemetry.groundSpeedMs + speedJitter).toFixed(1)));

          // Smooth progress along waypoints
          let [lat, lng] = drone.currentLocation;
          const targetWaypoint = drone.waypoints[drone.currentWaypointIndex];
          if (targetWaypoint) {
            const dLat = (targetWaypoint[0] - lat) * 0.04;
            const dLng = (targetWaypoint[1] - lng) * 0.04;
            lat += dLat;
            lng += dLng;
          }

          return {
            ...drone,
            currentLocation: [lat, lng],
            telemetry: {
              ...drone.telemetry,
              altitudeM: newAlt,
              groundSpeedMs: newSpeed,
              flightTimeSeconds: drone.telemetry.flightTimeSeconds + 1,
            },
          };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Operational Controls
  const pauseMission = () => {
    setMissions(prev =>
      prev.map(m =>
        m.id === currentMission.id
          ? { ...m, status: m.status === 'PAUSED' ? 'ACTIVE' : 'PAUSED' }
          : m
      )
    );
    setDrones(prev =>
      prev.map(d =>
        d.id === primaryDrone.id
          ? { ...d, status: d.status === 'STANDBY' ? 'ACTIVE_SEARCH' : 'STANDBY' }
          : d
      )
    );
    addToast({
      type: 'warning',
      title: 'Mission Status Changed',
      message: currentMission.status === 'PAUSED' ? 'Mission-04 flight resumed.' : 'Mission-04 paused. Drone holding altitude at 64m.',
    });
  };

  const resumeMission = () => {
    pauseMission();
  };

  const emergencyReturnHome = () => {
    setMissions(prev =>
      prev.map(m => (m.id === currentMission.id ? { ...m, status: 'RETURNING' } : m))
    );
    setDrones(prev =>
      prev.map(d =>
        d.id === primaryDrone.id
          ? {
              ...d,
              status: 'RETURNING',
              telemetry: { ...d.telemetry, flightMode: 'RETURN_TO_HOME' },
            }
          : d
      )
    );
    addToast({
      type: 'critical',
      title: 'EMERGENCY RTH ENGAGED',
      message: 'Valkyrie-03 returning to Base Camp pad at 18 m/s.',
    });
  };

  const recalculateRoute = () => {
    // Shifts waypoints 1.8km east along the ridgeline to clear the flash flood zone
    const shiftedWaypoints: [number, number][] = [
      [11.5310, 76.1310],
      [11.5350, 76.1380],
      [11.5390, 76.1430],
      [11.5430, 76.1480],
      [11.5470, 76.1440],
    ];

    setDrones(prev =>
      prev.map(d =>
        d.id === primaryDrone.id
          ? {
              ...d,
              status: 'ACTIVE_SEARCH',
              waypoints: shiftedWaypoints,
              telemetry: { ...d.telemetry, flightMode: 'AUTONOMOUS_SEARCH' },
            }
          : d
      )
    );

    setAlerts(prev =>
      prev.map(a =>
        a.id === 'ALT-2026-0814-01' && a.missionImpact
          ? {
              ...a,
              missionImpact: {
                ...a.missionImpact,
                riskLevel: 'LOW',
                recommendationAccepted: true,
                impactDescription: 'Search corridor successfully shifted 1.8 km East. Route now clears flood boundary by 650m.',
              },
            }
          : a
      )
    );

    addToast({
      type: 'success',
      title: 'Corridor Recalculated & Uploaded',
      message: 'New flight corridor uploaded via MAVLink. Mission-04 now clear of Flash Flood Zone Alpha.',
    });
  };

  const acceptRerouteRecommendation = (alertId: string) => {
    recalculateRoute();
    setIsRerouteModalOpen(false);
  };

  const changeSearchPattern = (pattern: SearchPattern) => {
    setMissions(prev =>
      prev.map(m => (m.id === currentMission.id ? { ...m, pattern } : m))
    );
    addToast({
      type: 'info',
      title: 'Search Pattern Updated',
      message: `Flight controller updated with ${pattern.replace('_', ' ')} trajectory.`,
    });
  };

  // Survivor Actions
  const confirmSurvivorDetection = (survivorId: string) => {
    setSurvivors(prev =>
      prev.map(s =>
        s.id === survivorId
          ? {
              ...s,
              status: 'VERIFIED',
              aiVerification: { ...s.aiVerification, verificationDecision: 'CONFIRMED' },
            }
          : s
      )
    );
    addToast({
      type: 'success',
      title: 'Detection Verified',
      message: 'Survivor S-01 human presence verified. Added to Tactical Rescue Dispatch queue.',
    });
  };

  const markFalseDetection = (survivorId: string) => {
    setSurvivors(prev =>
      prev.map(s =>
        s.id === survivorId
          ? {
              ...s,
              status: 'FALSE_DETECTION',
              priority: 'MONITOR',
              aiVerification: { ...s.aiVerification, verificationDecision: 'REJECTED' },
            }
          : s
      )
    );
    addToast({
      type: 'warning',
      title: 'Marked False Detection',
      message: 'Detection flagged as false positive (thermal animal/inorganic signature).',
    });
  };

  const dispatchRescue = (survivorId: string) => {
    setSurvivors(prev =>
      prev.map(s =>
        s.id === survivorId
          ? {
              ...s,
              status: 'RESCUE_DISPATCHED',
            }
          : s
      )
    );
    addToast({
      type: 'success',
      title: 'RESCUE DISPATCH TRANSMITTED',
      message: 'NDRF Quick Response Team dispatched with motorized watercraft and paramedic unit.',
    });
  };

  // Demo Mode Navigation
  const startDemo = () => {
    setIsDemoActive(true);
    setDemoStep(1);
    setActiveTab('alert-center');
  };

  const stopDemo = () => {
    setIsDemoActive(false);
    setDemoStep(1);
  };

  const goToDemoStep = (step: number) => {
    setDemoStep(step);
    // Automatically switch tabs according to narrative progression
    switch (step) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        setActiveTab('alert-center');
        if (step === 2 || step === 3) {
          const alert01 = alerts.find(a => a.id === 'ALT-2026-0814-01');
          if (alert01) setSelectedAlert(alert01);
        }
        if (step === 4 || step === 5) {
          setIsRerouteModalOpen(true);
        }
        break;
      case 6:
        setIsRerouteModalOpen(false);
        setSelectedAlert(null);
        setActiveTab('search-ops');
        break;
      case 7:
      case 8:
        setActiveTab('survivors');
        const s1 = survivors.find(s => s.code === 'S-01');
        if (s1) setSelectedSurvivor(s1);
        break;
      case 9:
        setSelectedSurvivor(null);
        setActiveTab('priority-engine');
        break;
      case 10:
        setActiveTab('mission-control');
        break;
      case 11:
        setActiveTab('reports');
        break;
    }
  };

  const nextDemoStep = () => {
    if (demoStep < 11) {
      goToDemoStep(demoStep + 1);
    } else {
      stopDemo();
    }
  };

  const prevDemoStep = () => {
    if (demoStep > 1) {
      goToDemoStep(demoStep - 1);
    }
  };

  return (
    <MissionContext.Provider
      value={{
        activeTab,
        setActiveTab,
        drones,
        alerts,
        survivors,
        missions,
        currentMission,
        primaryDrone,
        systemStatus,
        isSystemDrawerOpen,
        setIsSystemDrawerOpen,
        selectedAlert,
        setSelectedAlert,
        selectedSurvivor,
        setSelectedSurvivor,
        isRerouteModalOpen,
        setIsRerouteModalOpen,
        toasts,
        dismissToast,
        addToast,
        pauseMission,
        resumeMission,
        emergencyReturnHome,
        recalculateRoute,
        acceptRerouteRecommendation,
        changeSearchPattern,
        confirmSurvivorDetection,
        markFalseDetection,
        dispatchRescue,
        isDemoActive,
        demoStep,
        startDemo,
        stopDemo,
        nextDemoStep,
        prevDemoStep,
        goToDemoStep,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = (): MissionContextType => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMission must be used within a MissionProvider');
  }
  return context;
};
