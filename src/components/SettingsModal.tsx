import React, { useState } from 'react';
import { X, Settings, Check, Droplets } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [luxThreshold, setLuxThreshold] = useState(25);
  const [ecoDimmingEnabled, setEcoDimmingEnabled] = useState(true);
  const [autoDispatchCritical, setAutoDispatchCritical] = useState(true);
  const [voltageAlertThreshold, setVoltageAlertThreshold] = useState(210);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="w-full max-w-lg frosted-panel rounded-3xl p-6 sm:p-8 border border-white/30 shadow-[0_32px_80px_rgba(0,0,0,0.85)] relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-white to-teal-300 shadow-[0_0_12px_rgba(255,255,255,0.8)]" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/15">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white/10 border border-white/30 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.25)]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Grid Matrix Settings</h2>
              <p className="text-xs text-slate-300">Municipal telemetry & automation parameters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/15 rounded-full transition-all frosted-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="py-5 space-y-5 overflow-y-auto pr-1 text-xs">
          {/* Photocell Dusk Sensitivity */}
          <div className="frosted-card rounded-2xl p-4 border border-white/20 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase tracking-wider">
                Photocell Dusk Lux Trigger
              </span>
              <span className="font-mono text-emerald-300 font-bold bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/20">
                {luxThreshold} lx
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={luxThreshold}
              onChange={(e) => setLuxThreshold(Number(e.target.value))}
              className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-emerald-400 border border-white/20"
            />
            <p className="text-[11px] text-slate-400">
              Activates automated dusk illumination when natural sunlight falls below this threshold.
            </p>
          </div>

          {/* Eco Dimming */}
          <div className="frosted-card rounded-2xl p-4 border border-white/20 flex items-center justify-between shadow-sm">
            <div>
              <p className="font-bold text-white uppercase tracking-wider">
                Adaptive Midnight Eco Dimming (50%)
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automatically dims low-traffic highway sectors between 00:00 and 04:30.
              </p>
            </div>
            <button
              onClick={() => setEcoDimmingEnabled(!ecoDimmingEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border border-white/30 ${
                ecoDimmingEnabled ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-black/50'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 shadow-md transform transition-transform ${
                  ecoDimmingEnabled ? 'translate-x-6 bg-slate-950' : 'translate-x-0 bg-white'
                }`}
              />
            </button>
          </div>

          {/* Auto Dispatch Critical Alerts */}
          <div className="frosted-card rounded-2xl p-4 border border-white/20 flex items-center justify-between shadow-sm">
            <div>
              <p className="font-bold text-white uppercase tracking-wider">
                Auto-Dispatch Critical Alerts
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automatically triggers SMS and radio dispatch when zero-current outage occurs.
              </p>
            </div>
            <button
              onClick={() => setAutoDispatchCritical(!autoDispatchCritical)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border border-white/30 ${
                autoDispatchCritical ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-black/50'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full transform transition-transform ${
                  autoDispatchCritical ? 'translate-x-6 bg-slate-950' : 'translate-x-0 bg-white'
                }`}
              />
            </button>
          </div>

          {/* Low Voltage Threshold */}
          <div className="frosted-card rounded-2xl p-4 border border-white/20 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase tracking-wider">
                Feeder Voltage Alert Threshold
              </span>
              <span className="font-mono text-emerald-300 font-bold bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/20">
                {voltageAlertThreshold}V
              </span>
            </div>
            <input
              type="range"
              min="180"
              max="240"
              value={voltageAlertThreshold}
              onChange={(e) => setVoltageAlertThreshold(Number(e.target.value))}
              className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-emerald-400 border border-white/20"
            />
            <p className="text-[11px] text-slate-400">
              Flags warning state if feeder bus bar drops below target line voltage.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/15 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors frosted-btn"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="frosted-btn px-6 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold shadow-[0_4px_20px_rgba(255,255,255,0.4)] border border-white transition-all flex items-center gap-1.5"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Config Applied</span>
              </>
            ) : (
              <span>Save Telemetry Profile</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
