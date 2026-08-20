import React, { useState } from 'react';
import { ArrowLeft, MapPin, Crosshair, Send, Camera, Check, RefreshCw, Sparkles, Droplets } from 'lucide-react';
import { FaultReport, SeverityType } from '../types';

interface ReportFaultScreenProps {
  onBack: () => void;
  onSubmitFault: (newFault: Omit<FaultReport, 'id' | 'ticketNumber' | 'reportedTime' | 'status'>) => void;
  onNavigateToProblems: () => void;
}

export const ReportFaultScreen: React.FC<ReportFaultScreenProps> = ({
  onBack,
  onSubmitFault,
  onNavigateToProblems
}) => {
  const [location, setLocation] = useState('');
  const [issueType, setIssueType] = useState<FaultReport['issueType']>('outage');
  const [severity, setSeverity] = useState<SeverityType>('critical');
  const [description, setDescription] = useState('');
  const [zone, setZone] = useState('Central Grid');
  const [ward, setWard] = useState('Ward 12');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState<string | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const handleAutoDetectLocation = () => {
    setIsDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsDetectingLocation(false);
          setLocation(`13.0450° N, 80.2310° E (Anna Salai Sector 2)`);
          setZone('Central Grid');
          setWard('Ward 12');
        },
        () => {
          // Fallback location for demo in Chennai
          setIsDetectingLocation(false);
          setLocation(`13.0067° N, 80.2025° E (Guindy Industrial Junction)`);
          setZone('Central Grid');
          setWard('Ward 12');
        },
        { timeout: 3000 }
      );
    } else {
      setIsDetectingLocation(false);
      setLocation(`12.9716° N, 80.2428° E (Marina Beach Road)`);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    setIsTransmitting(true);

    const ticketNumber = `HK-${Math.floor(1000 + Math.random() * 9000)}`;

    setTimeout(() => {
      setIsTransmitting(false);
      setGeneratedTicket(ticketNumber);

      const issueTitles: Record<FaultReport['issueType'], string> = {
        outage: 'Complete Outage',
        flickering: 'Flickering LED Array',
        dim: 'Dim Output / Low Luminosity',
        damage: 'Structural Physical Damage',
        sensor: 'Optical Sensor Desynchronization',
        surge: 'Transient Voltage Surge Detected'
      };

      onSubmitFault({
        title: issueTitles[issueType] || 'Street Light Anomaly',
        location: location,
        zone: zone,
        ward: ward,
        severity: severity,
        issueType: issueType,
        description: description || `Reported ${issueType} at ${location}. Verification dispatched.`,
        imageUrl: photoPreview || undefined
      });
    }, 1200);
  };

  const resetForm = () => {
    setGeneratedTicket(null);
    setLocation('');
    setDescription('');
    setPhotoPreview(null);
    setIssueType('outage');
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 md:p-10 pb-32 lg:pb-12 flex flex-col items-center justify-center relative map-bg-grid animate-in fade-in duration-300">
      {/* Back Button Context */}
      <div className="w-full max-w-lg mb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium p-1.5 rounded-lg hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-xs text-emerald-400 font-mono font-semibold">NODE DISPATCH PROTOCOL</span>
      </div>

      {/* Form Container Card in Crystal Liquid Glass */}
      <div className="w-full max-w-lg frosted-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-white/30 shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/40 flex items-center justify-center shadow-md">
              <Droplets className="w-4 h-4 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Report New Fault
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Log a new street light issue for maintenance grid review.
          </p>
        </div>

        {/* The Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Location
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter street address or coordinates"
                  className="w-full frosted-input rounded-2xl py-3 pl-10 pr-4 text-white text-sm placeholder-slate-400 focus:border-white focus:ring-1 focus:ring-white focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleAutoDetectLocation}
                disabled={isDetectingLocation}
                title="Auto-detect location from GPS"
                className="frosted-btn bg-white/15 hover:bg-white text-white hover:text-slate-950 border border-white/30 rounded-2xl px-4 flex items-center justify-center transition-all"
              >
                <Crosshair className={`w-4 h-4 text-emerald-300 ${isDetectingLocation ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Issue Type & Severity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Issue Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Issue Type
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as FaultReport['issueType'])}
                className="w-full frosted-input rounded-2xl py-3 px-3.5 text-white text-sm outline-none cursor-pointer"
              >
                <option value="outage" className="bg-neutral-900">Complete Outage</option>
                <option value="flickering" className="bg-neutral-900">Flickering</option>
                <option value="dim" className="bg-neutral-900">Dim Output</option>
                <option value="damage" className="bg-neutral-900">Physical Damage</option>
                <option value="sensor" className="bg-neutral-900">Sensor Failure</option>
                <option value="surge" className="bg-neutral-900">Voltage Surge</option>
              </select>
            </div>

            {/* Severity Level */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as SeverityType)}
                className="w-full frosted-input rounded-2xl py-3 px-3.5 text-white text-sm outline-none cursor-pointer"
              >
                <option value="critical" className="bg-neutral-900">Critical (Immediate)</option>
                <option value="medium" className="bg-neutral-900">Medium (Within 4h)</option>
                <option value="low" className="bg-neutral-900">Low (Standard)</option>
              </select>
            </div>
          </div>

          {/* Zone and Ward */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Zone
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full frosted-input rounded-2xl py-2.5 px-3 text-white text-xs outline-none"
              >
                <option value="North Grid" className="bg-neutral-900">North Grid</option>
                <option value="Central Grid" className="bg-neutral-900">Central Grid</option>
                <option value="South Sector" className="bg-neutral-900">South Sector</option>
                <option value="East Node" className="bg-neutral-900">East Node</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Ward
              </label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full frosted-input rounded-2xl py-2.5 px-3 text-white text-xs outline-none"
              >
                <option value="Ward 12" className="bg-neutral-900">Ward 12</option>
                <option value="Ward 45" className="bg-neutral-900">Ward 45</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide any additional details about the fault..."
              className="w-full frosted-input rounded-2xl py-2.5 px-3.5 text-white text-sm placeholder-slate-400 focus:border-white focus:ring-1 focus:ring-white focus:outline-none resize-none"
            />
          </div>

          {/* Photo Evidence Upload Box */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Photo Evidence
            </label>
            <label className="border border-dashed border-white/30 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 bg-white/[0.04] hover:bg-white/[0.09] transition-all cursor-pointer group relative overflow-hidden">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              {photoPreview ? (
                <div className="relative w-full h-28 rounded-xl overflow-hidden flex items-center justify-center bg-black/40">
                  <img
                    src={photoPreview}
                    alt="Uploaded Evidence"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <span className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full">
                    Change Image
                  </span>
                </div>
              ) : (
                <>
                  <div className="h-11 w-11 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <Camera className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-white">Click to upload or drag & drop</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">SVG, PNG, JPG or GIF (max. 5MB)</p>
                  </div>
                </>
              )}
            </label>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isTransmitting}
              className="frosted-btn w-full bg-white hover:bg-slate-100 text-slate-950 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(255,255,255,0.4)] border border-white transition-all cursor-pointer"
            >
              {isTransmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>Transmitting Ticket...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-emerald-600" />
                  <span>Report Issue</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Success Overlay */}
        {generatedTicket && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center z-30 animate-in fade-in zoom-in-95 duration-300">
            <div className="h-20 w-20 rounded-full bg-emerald-500/25 border border-emerald-400/50 flex items-center justify-center mb-5 shadow-[0_0_24px_rgba(52,211,153,0.5)]">
              <Check className="w-10 h-10 text-emerald-300" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Fault Reported</h2>
            <p className="text-sm text-slate-300 max-w-xs mb-6">
              Ticket <span className="font-mono font-bold text-emerald-300">#{generatedTicket}</span> has been generated and dispatched to the maintenance grid.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <button
                onClick={resetForm}
                className="flex-1 py-3 px-4 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-semibold transition-all frosted-btn"
              >
                + Report Another
              </button>
              <button
                onClick={onNavigateToProblems}
                className="flex-1 py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold transition-all shadow-[0_4px_16px_rgba(255,255,255,0.4)] border border-white frosted-btn"
              >
                View in Directory
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
