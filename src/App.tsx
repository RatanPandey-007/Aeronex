import React from 'react';
import { MissionProvider, useMission } from './context/MissionContext';
import { CommandLayout } from './components/layout/CommandLayout';
import { SystemStatusDrawer } from './components/common/SystemStatusDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { DemoRunnerModal } from './components/demo/DemoRunnerModal';

// Views
import { OverviewDashboard } from './components/overview/OverviewDashboard';
import { MissionControlView } from './components/missionControl/MissionControlView';
import { AlertCenterView } from './components/alertCenter/AlertCenterView';
import { SearchOpsView } from './components/searchOps/SearchOpsView';
import { SurvivorListView } from './components/survivors/SurvivorListView';
import { PriorityEngineView } from './components/priorityEngine/PriorityEngineView';
import { MissionReplayView } from './components/replay/MissionReplayView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { MissionReportsView } from './components/reports/MissionReportsView';

const AppContent: React.FC = () => {
  const { activeTab } = useMission();

  return (
    <CommandLayout>
      {activeTab === 'overview' && <OverviewDashboard />}
      {activeTab === 'mission-control' && <MissionControlView />}
      {activeTab === 'alert-center' && <AlertCenterView />}
      {activeTab === 'search-ops' && <SearchOpsView />}
      {activeTab === 'survivors' && <SurvivorListView />}
      {activeTab === 'priority-engine' && <PriorityEngineView />}
      {activeTab === 'replay' && <MissionReplayView />}
      {activeTab === 'analytics' && <AnalyticsView />}
      {activeTab === 'reports' && <MissionReportsView />}

      {/* Global Modals & Overlays */}
      <SystemStatusDrawer />
      <ToastContainer />
      <DemoRunnerModal />
    </CommandLayout>
  );
};

export const App: React.FC = () => {
  return (
    <MissionProvider>
      <AppContent />
    </MissionProvider>
  );
};

export default App;
