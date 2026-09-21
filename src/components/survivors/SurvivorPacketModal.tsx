import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Send, 
  UserX, 
  ShieldAlert, 
  Flame, 
  Eye, 
  Cpu, 
  Activity,
  Layers,
  Thermometer
} from 'lucide-react';
import { Survivor } from '../../types/survivor';
import { PriorityBadge, SurvivorStatusBadge } from '../common/Badge';
import { useMission } from '../../context/MissionContext';

export interface SurvivorPacketModalProps {
  survivor: Survivor | null;
  onClose: () => void;
}

export const SurvivorPacketModal: React.FC<SurvivorPacketModalProps> = ({ survivor, onClose }) => {
  const { 
    confirmSurvivorDetection, 
    markFalseDetection, 
    dispatchRescue 
  } = useMission();

  const [sensorView, setSensorView] = useState<'thermal' | 'optical'>('thermal');

  if (!survivor) return null;

  const isDispatched = survivor.status === 'RESCUE_DISPATCHED';
  const isVerified = survivor.status === 'VERIFIED';
  const isFalse = survivor.status === 'FALSE_DETECTION';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 font-mono">
      <div className="bg-[#0D131D] rounded-2xl max-w-3xl w-full max-h-[90vh] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
        {/* Header */}
        <header className="p-5 sm:p-6 bg-[#111925] border-b border-white/10 text-white flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base font-black px-2 py-0.5 rounded bg-blue-600 text-white">
                {survivor.code}
              </span>
              <PriorityBadge priority={survivor.priority} />
              <SurvivorStatusBadge status={survivor.status} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#F8FAFC]">
              Tactical Survivor Intelligence Record
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span>DETECTED: {survivor.detectedAt}</span>
              <span>•</span>
              <span>BY: {survivor.detectedByDroneId}</span>
              <span>•</span>
              <span className="text-[#38BDF8]">ZONE: {survivor.zone}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Dual Sensor Imagery Simulator (FLIR vs 4K Optical) */}
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#070B12]">
            {/* View Mode Toggle Bar */}
            <div className="p-2.5 bg-[#111925] border-b border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSensorView('thermal')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                    sensorView === 'thermal'
                      ? 'bg-[#FF9F1C] text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>FLIR Boson 640 Thermal (Ironbow)</span>
                </button>
                <button
                  onClick={() => setSensorView('optical')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                    sensorView === 'optical'
                      ? 'bg-[#38BDF8] text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Sony 4K Optical Zoom Crop</span>
                </button>
              </div>

              <span className="text-[#22C55E] font-bold hidden sm:inline">
                {survivor.temperatureC}°C HEAT SIGNATURE
              </span>
            </div>

            {/* Canvas Sensor Window */}
            <div className="relative h-64 sm:h-72 w-full flex items-center justify-center overflow-hidden">
              {sensorView === 'thermal' ? (
                // Ironbow Thermal Palette Simulation
                <div className="w-full h-full bg-gradient-to-tr from-purple-950 via-indigo-950 to-amber-950 flex items-center justify-center relative p-6">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] pointer-events-none opacity-40" />

                  <div className="relative flex flex-col items-center">
                    {/* Bounding Box */}
                    <div className="absolute -inset-6 border-2 border-[#FF3B4E] rounded-xl animate-pulse pointer-events-none">
                      <div className="absolute -top-3 left-2 bg-[#FF3B4E] text-white text-[9px] px-1.5 rounded font-bold">
                        HUMAN_HEAT_TARGET: {survivor.aiVerification.fusedConfidence}%
                      </div>
                      <div className="absolute -bottom-3 right-2 bg-[#070B12] text-amber-400 text-[9px] px-1.5 rounded border border-white/10">
                        DELTA: +14.8°C
                      </div>
                    </div>

                    {/* Body Radiance Silhouette */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-300 via-rose-500 to-yellow-200 blur-xs shadow-[0_0_35px_rgba(244,63,94,0.9)]" />
                    <div className="w-20 h-28 -mt-2 rounded-2xl bg-gradient-to-b from-rose-500 via-amber-500 to-yellow-400 blur-xs shadow-[0_0_40px_rgba(245,158,11,0.8)]" />
                  </div>

                  <div className="absolute bottom-2 left-3 text-[10px] text-slate-400">
                    FLIR Boson LWIR • Range: 68m • Palette: IRONBOW
                  </div>
                  <div className="absolute top-2 right-3 text-[10px] text-[#22C55E]">
                    TARGET ACQUISITION LOCKED ({survivor.temperatureC}°C)
                  </div>
                </div>
              ) : (
                // Optical 4K Crop Simulation
                <div className="w-full h-full bg-[#070B12] flex items-center justify-center relative p-6">
                  <div className="relative flex flex-col items-center">
                    <div className="absolute -inset-6 border-2 border-[#38BDF8] rounded-xl pointer-events-none">
                      <div className="absolute -top-3 left-2 bg-[#38BDF8] text-slate-950 text-[9px] px-1.5 rounded font-bold">
                        RGB_OPTICAL_CROP (4K ZOOM)
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700" />
                    <div className="w-16 h-24 -mt-1 rounded-xl bg-slate-800 border border-slate-700" />
                  </div>
                  <div className="absolute bottom-2 left-3 text-[10px] text-slate-400">
                    Sony Exmor 1/1.8&quot; • 4.2x Optical • Day/Night
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Verification & Multi-Frame Analysis Strip */}
          <div className="bg-[#111925] p-4 rounded-2xl border border-white/5 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#F8FAFC] flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#38BDF8]" />
                ONBOARD EDGE AI INFERENCE (NVIDIA ORIN NX)
              </span>
              <span className="font-bold text-[#22C55E]">
                FUSED CONFIDENCE: {survivor.aiVerification.fusedConfidence}%
              </span>
            </div>

            <div className="w-full bg-[#070B12] rounded-full h-2 overflow-hidden border border-white/5">
              <div 
                className="bg-[#22C55E] h-2 rounded-full" 
                style={{ width: `${survivor.aiVerification.fusedConfidence}%` }} 
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-white/5">
              <div>
                <span className="text-[10px] text-slate-400 block">Thermal Sensor</span>
                <span className="font-bold text-white">{survivor.aiVerification.thermalConfidence}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Optical Morphology</span>
                <span className="font-bold text-white">{survivor.aiVerification.morphologyMatchPercent}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Temporal Tracking</span>
                <span className="font-bold text-[#38BDF8]">{survivor.aiVerification.multiFrameTrackingFrames} Frames Consistent</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Consistency Index</span>
                <span className="font-bold text-[#22C55E]">{survivor.aiVerification.multiFrameConsistencyPercent}%</span>
              </div>
            </div>
          </div>

          {/* Coordinates & Logistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#111925] border border-white/5 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                COORDINATES & SECTOR
              </span>
              <div className="flex justify-between">
                <span className="text-slate-400">WGS84 Lat/Lng:</span>
                <span className="font-bold text-white">{survivor.location[0].toFixed(5)}°N, {survivor.location[1].toFixed(5)}°E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">MGRS Grid:</span>
                <span className="font-bold text-[#38BDF8]">{survivor.mgrsGrid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Movement State:</span>
                <span className="font-bold text-[#FF3B4E]">{survivor.movementStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Est. Condition:</span>
                <span className="font-bold text-white">{survivor.estimatedCondition}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#111925] border border-white/5 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                TACTICAL RESCUE LOGISTICS
              </span>
              <div className="flex justify-between">
                <span className="text-slate-400">Nearest Unit:</span>
                <span className="font-bold text-white">{survivor.nearestRescueTeam.teamName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Distance & ETA:</span>
                <span className="font-bold text-[#22C55E]">
                  {survivor.nearestRescueTeam.distanceKm} km ({survivor.nearestRescueTeam.etaMinutes} min)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Asset Profile:</span>
                <span className="font-bold text-white">{survivor.nearestRescueTeam.teamType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Water Margin:</span>
                <span className="font-bold text-[#FF3B4E]">&lt;40m from river surge line</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="p-3.5 rounded-xl bg-[#070B12] border border-white/10 text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-[#38BDF8]">TACTICAL FIELD NOTES: </span>
            {survivor.notes}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {!isFalse && (
                <button
                  onClick={() => {
                    markFalseDetection(survivor.id);
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-xs font-semibold transition-colors w-full sm:w-auto"
                >
                  Mark False Alarm
                </button>
              )}

              {!isVerified && !isDispatched && (
                <button
                  onClick={() => confirmSurvivorDetection(survivor.id)}
                  className="px-4 py-2.5 rounded-xl bg-[#22C55E] hover:bg-emerald-600 text-white text-xs font-bold transition-colors w-full sm:w-auto flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Detection</span>
                </button>
              )}
            </div>

            <button
              onClick={() => {
                dispatchRescue(survivor.id);
                onClose();
              }}
              disabled={isDispatched}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                isDispatched
                  ? 'bg-white/10 text-slate-500 cursor-not-allowed'
                  : 'bg-[#FF3B4E] hover:bg-rose-600 text-white animate-pulse'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{isDispatched ? 'Rescue Already Dispatched' : 'Dispatch Emergency Rescue Unit'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
