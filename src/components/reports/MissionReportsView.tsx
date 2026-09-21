import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldAlert, 
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';

export const MissionReportsView: React.FC = () => {
  const { addToast } = useMission();
  const [selectedReportId, setSelectedReportId] = useState<string>('REP-2026-0814-04');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const archivedReports = [
    {
      id: 'REP-2026-0814-04',
      missionId: 'MISSION-04',
      title: 'Wayanad Chaliyar Flash Flood Search & Extraction Debrief',
      date: '14 August 2026',
      timeWindow: '14:10 – 14:48 IST',
      location: 'Chaliyar River Basin, Zone Alpha (Kerala)',
      drone: 'ANX-SAR-03 (Valkyrie MK-IV)',
      duration: '38m 14s',
      areaSwept: '8.55 km²',
      alertsFaced: 'Flash Flood & River Inundation Surge (Critical)',
      survivorsFound: 3,
      outcome: 'SUCCESSFUL RESCUE HANDOFF (SURVIVOR S-01 EXTRACTED)',
      routeChanges: 'Shifted corridor 1.8km East to clear surge basin',
    },
    {
      id: 'REP-2026-0812-02',
      missionId: 'MISSION-01',
      title: 'Vythiri Road Access & Clearance Reconnaissance',
      date: '12 August 2026',
      timeWindow: '12:30 – 14:05 IST',
      location: 'Vythiri Highway Sector (Kerala)',
      drone: 'ANX-SAR-01 (Valkyrie MK-IV)',
      duration: '1h 35m',
      areaSwept: '15.0 km²',
      alertsFaced: 'Squall Line & Severe Wind Shear',
      survivorsFound: 1,
      outcome: 'COMPLETED • CLEARANCE CONFIRMED FOR NDRF CONVOY',
      routeChanges: 'Altitude climbed to 95m AGL for squall penetration',
    },
  ];

  const activeReport = archivedReports.find(r => r.id === selectedReportId) || archivedReports[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    addToast({
      type: 'info',
      title: 'Report Export Initiated',
      message: `Downloaded ${activeReport.id}_Tactical_Debrief.json with full MAVLink logs.`,
    });
  };

  const handleGenerateNew = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      addToast({
        type: 'success',
        title: 'Tactical Report Generated',
        message: 'Current mission telemetry, survivor telemetry, and route audit compiled into formal PDF document.',
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
            <h1 className="text-2xl font-black tracking-tight text-[#F8FAFC]">
              MISSION REPORTS & AFTER-ACTION DEBRIEFS
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Standardized tactical debrief documentation for NDRF, State Disaster Authorities, and Civil Aviation Command
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateNew}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-md disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            <span>{isGenerating ? 'Compiling Telemetry...' : 'Generate Live Report'}</span>
          </button>
        </div>
      </div>

      {/* Reports Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Report Archive List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            ARCHIVED SORTIE DEBRIEFS
          </div>

          <div className="space-y-2">
            {archivedReports.map((report) => {
              const isSelected = selectedReportId === report.id;
              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedReportId(report.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xl space-y-2 ${
                    isSelected
                      ? 'bg-[#151E2B] text-white border-[#38BDF8] ring-1 ring-[#38BDF8]/40'
                      : 'bg-[#0D131D] hover:bg-[#111925] border-white/5 hover:border-white/15 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-[#38BDF8] text-slate-950 font-bold' : 'bg-[#111925] text-[#38BDF8] border border-white/10'
                    }`}>
                      {report.missionId}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {report.date}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold leading-snug text-[#F8FAFC]">
                    {report.title}
                  </h4>

                  <div className="text-[11px] flex items-center justify-between pt-1 border-t border-white/5 text-slate-400">
                    <span>{report.duration}</span>
                    <span className="text-[#22C55E] font-bold">
                      {report.survivorsFound} Found
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Formal Tactical Debrief Document View */}
        <div className="lg:col-span-8">
          <div className="bg-[#0D131D] rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 print:shadow-none print:bg-white print:text-black">
            {/* Report Document Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black tracking-tight text-[#F8FAFC]">
                    AERONEX TACTICAL DEBRIEF REPORT
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#111925] text-slate-300 border border-white/10">
                    UNCLASSIFIED / SAR OFFICIAL
                  </span>
                </div>
                <h2 className="text-lg font-black text-white mt-1">
                  {activeReport.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>REPORT ID: {activeReport.id}</span>
                  <span>•</span>
                  <span>DATE: {activeReport.date} ({activeReport.timeWindow})</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 print:hidden">
                <button
                  onClick={handlePrint}
                  className="p-2 rounded-xl bg-[#111925] border border-white/10 hover:bg-white/5 text-slate-300 transition-colors"
                  title="Print Report"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-xl bg-[#111925] border border-white/10 hover:bg-white/5 text-slate-300 transition-colors"
                  title="Download JSON Telemetry"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mission Key Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#111925] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Sortie Duration</span>
                <span className="text-sm font-bold text-white">{activeReport.duration}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#111925] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Area Swept</span>
                <span className="text-sm font-bold text-white">{activeReport.areaSwept}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#111925] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Survivors Found</span>
                <span className="text-sm font-bold text-[#22C55E]">{activeReport.survivorsFound} Verified</span>
              </div>
              <div className="p-3 rounded-xl bg-[#111925] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Assigned Drone</span>
                <span className="text-sm font-bold text-white">{activeReport.drone}</span>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-2 text-xs leading-relaxed">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-white/5 pb-1">
                1.0 OPERATIONAL EXECUTIVE SUMMARY
              </h3>
              <p className="text-slate-300">
                On 14 August 2026 at 14:10 IST, the AERONEX Autonomous Search-and-Rescue System was deployed to conduct low-altitude thermal sweeps over the flooded Chaliyar River drainage basin in Wayanad, Kerala following a flash flood breach. 
              </p>
              <p className="text-slate-300 mt-1">
                The Valkyrie MK-IV hexacopter utilized onboard edge AI inference (Jetson Orin NX) to fuse radiometric long-wave infrared (FLIR Boson 640) and 4K optical zoom streams. The mission successfully localized 3 individuals trapped on inundated sandbars and bamboo clusters, providing centimeter-accurate coordinates directly to the NDRF ground rescue command.
              </p>
            </div>

            {/* Hazard Alerts & Dynamic Rerouting */}
            <div className="space-y-2 text-xs leading-relaxed">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-white/5 pb-1">
                2.0 DISASTER ALERT & DYNAMIC CORRIDOR MODIFICATION
              </h3>
              <div className="p-3.5 rounded-xl bg-[#FF3B4E]/15 border border-[#FF3B4E]/30 text-rose-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#FF3B4E]">
                  <ShieldAlert className="w-4 h-4" />
                  <span>ALERT ENCOUNTERED: {activeReport.alertsFaced}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  At 14:32 IST, SACHET Early Warning CAP feed issued a critical alert for Zone Alpha. AERONEX dynamic hazard clipping detected a 4.8 km² corridor intersection. The system computed and uploaded an autonomous 1.8 km East corridor shift along elevated terrain, preserving continuous thermal sensor visibility without placing the airframe in turbulent gorge winds.
                </p>
              </div>
            </div>

            {/* Manifest */}
            <div className="space-y-2 text-xs">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-white/5 pb-1">
                3.0 VERIFIED SURVIVOR LOCALIZATION MANIFEST
              </h3>
              <div className="space-y-1.5">
                <div className="p-2.5 rounded-xl bg-[#111925] border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">S-01 • Sandbar Root Cluster</span>
                    <span className="text-slate-400 block text-[11px]">MGRS: 43P ET 2243 7621 • AI Confidence: 96.4%</span>
                  </div>
                  <span className="text-[#FF3B4E] font-bold">EXTRACTED (NDRF RAFT)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#111925] border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">S-02 • East Ridge Bamboo Copse</span>
                    <span className="text-slate-400 block text-[11px]">MGRS: 43P ET 2291 7664 • AI Confidence: 88.7%</span>
                  </div>
                  <span className="text-[#FF9F1C] font-bold">IN PROGRESS (SDRF)</span>
                </div>
              </div>
            </div>

            {/* Outcome Sign-off */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">MISSION OUTCOME</span>
                <span className="text-[#22C55E] font-bold text-sm">
                  {activeReport.outcome}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">AUTHORIZED COMMANDER</span>
                <span className="text-white font-bold">Commander K. V. Sharma (NDRF 4th Bn)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
