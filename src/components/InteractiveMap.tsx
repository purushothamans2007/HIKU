import React, { useState } from 'react';
import { StreetLightPole, FaultReport } from '../types';
import { Layers, ZoomIn, ZoomOut, Compass, Navigation, AlertTriangle, Zap, ShieldCheck, Sun } from 'lucide-react';

interface InteractiveMapProps {
  poles: StreetLightPole[];
  faults: FaultReport[];
  selectedPole: StreetLightPole | null;
  onSelectPole: (pole: StreetLightPole) => void;
  onOpenReportAtLocation?: (lat: number, lng: number, locationName: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  poles,
  faults,
  selectedPole,
  onSelectPole,
  onOpenReportAtLocation
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeLayer, setActiveLayer] = useState<'all' | 'faults' | 'solar' | 'lines'>('all');
  const [hoveredPole, setHoveredPole] = useState<StreetLightPole | null>(null);

  // Approximate Chennai bounds mapping to SVG / relative canvas coordinates
  // Lat: 12.92 to 13.12 (Span ~0.20)
  // Lng: 80.18 to 80.29 (Span ~0.11)
  const getMarkerCoordinates = (lat: number, lng: number) => {
    // Normalizing between 0% and 100%
    const minLat = 12.91;
    const maxLat = 13.11;
    const minLng = 80.18;
    const maxLng = 80.29;

    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;

    // Apply zoom offset
    return {
      top: `${Math.max(10, Math.min(90, y))}%`,
      left: `${Math.max(10, Math.min(90, x))}%`
    };
  };

  const filteredPoles = poles.filter(p => {
    if (activeLayer === 'faults') return p.status === 'fault' || p.status === 'warning' || p.status === 'offline';
    if (activeLayer === 'solar') return p.solarEquipped;
    return true;
  });

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-2xl bg-[#0d0e12] select-none">
      {/* High-tech Satellite / Dark Command Center Map Visual */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out opacity-65"
        style={{ 
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDjolMr0R6Rqdyq1Qc78OCYWhOkniBCeCfZKnEuv5Py7nmC8uU1sMddFEa-HrX2402r3krjvzIp_kar4rkK1-UnCIl0i8k1UMkwk4rdhOSoVQsZF_Ez4QvF3fwn-pxadi3Wn8Jz8ToNPoNAF2lVLrMyQ6Yqm3cwQLirg6qNcjaeERZT1Em0Kgy4HYhw9wvX9AMcS52chBKAmj_qHAZqJqT5yEwmtuccfZT1bkxA3E1ajea2ScoEytA6')`,
          transform: `scale(${zoomLevel})`
        }}
      />

      {/* Grid Overlay & Glow Nodes */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#121317] via-transparent to-[#121317]/50 pointer-events-none" />
      <div className="absolute inset-0 bg-[#121317]/30 pointer-events-none" />

      {/* Cybernetic Power Grid Lines Simulation */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
        <defs>
          <linearGradient id="gridLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#39dcd2" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#4b8eff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffb4ab" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path
          d="M 220 180 Q 420 310 560 420 T 780 620"
          fill="none"
          stroke="url(#gridLineGrad)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          className="animate-pulse"
        />
        <path
          d="M 560 420 L 720 280 L 890 350"
          fill="none"
          stroke="#4b8eff"
          strokeWidth="1"
          strokeOpacity="0.4"
          strokeDasharray="2 4"
        />
        <path
          d="M 320 540 Q 480 500 560 420 T 640 220"
          fill="none"
          stroke="#39dcd2"
          strokeWidth="1.2"
          strokeOpacity="0.5"
          strokeDasharray="3 5"
        />
      </svg>

      {/* Map Interactive Poles */}
      {filteredPoles.map((pole) => {
        const coords = getMarkerCoordinates(pole.lat, pole.lng);
        const isSelected = selectedPole?.id === pole.id;
        
        let markerColorClass = 'bg-[#39dcd2] glow-pulse-green';
        if (pole.status === 'fault' || pole.status === 'offline') {
          markerColorClass = 'bg-[#ffb4ab] glow-pulse-red';
        } else if (pole.status === 'warning') {
          markerColorClass = 'bg-[#ffda6a] glow-pulse-yellow';
        }

        return (
          <div
            key={pole.id}
            style={{ top: coords.top, left: coords.left }}
            className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
              isSelected ? 'scale-150 z-30' : 'hover:scale-135'
            }`}
            onClick={() => onSelectPole(pole)}
            onMouseEnter={() => setHoveredPole(pole)}
            onMouseLeave={() => setHoveredPole(null)}
          >
            {/* Outer Ripple Halo for Selected Node */}
            {isSelected && (
              <div className="absolute -inset-3 rounded-full border-2 border-white/60 animate-ping opacity-60 pointer-events-none" />
            )}
            
            {/* Inner Core Light Node */}
            <div className={`w-4 h-4 rounded-full ${markerColorClass} border border-white/40 shadow-lg relative flex items-center justify-center`}>
              <div className="w-1.5 h-1.5 rounded-full bg-white opacity-90" />
            </div>

            {/* Label tag */}
            <div className={`absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-mono font-medium backdrop-blur-md border transition-all ${
              isSelected 
                ? 'bg-primary text-[#001a41] border-primary font-bold shadow-md' 
                : 'bg-[#1e1f23]/80 text-[#c1c6d7] border-white/10 hover:text-white'
            }`}>
              {pole.id}
            </div>
          </div>
        );
      })}

      {/* Hover Card Preview */}
      {hoveredPole && (
        <div 
          className="absolute z-40 top-4 left-4 frosted-card p-3.5 rounded-2xl max-w-xs pointer-events-none border border-white/25 shadow-[0_16px_36px_rgba(0,0,0,0.7)] transition-all animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-[#adc6ff]">{hoveredPole.id}</span>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
              hoveredPole.status === 'active' ? 'bg-[#39dcd2]/20 text-[#39dcd2] border-[#39dcd2]/30' :
              hoveredPole.status === 'warning' ? 'bg-[#ffda6a]/20 text-[#ffda6a] border-[#ffda6a]/30' :
              'bg-[#ffb4ab]/20 text-[#ffb4ab] border-[#ffb4ab]/30'
            }`}>
              {hoveredPole.status}
            </span>
          </div>
          <p className="text-sm font-semibold text-white">{hoveredPole.location}</p>
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/10 text-xs text-[#c1c6d7]">
            <div>Power: <span className="text-white font-medium">{hoveredPole.powerDraw}W</span></div>
            <div>Lux: <span className="text-white font-medium">{hoveredPole.ambientLux} lx</span></div>
            <div>Temp: <span className="text-white font-medium">{hoveredPole.temperature}°C</span></div>
            <div>Ping: <span className="text-[#39dcd2] font-semibold">{hoveredPole.lastPing}</span></div>
          </div>
        </div>
      )}

      {/* Floating Map Controls (Top Right) */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2.5">
        {/* Layer Selector */}
        <div className="frosted-panel p-1.5 rounded-2xl flex items-center gap-1.5 border border-white/20 shadow-lg">
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all frosted-btn ${
              activeLayer === 'all' 
                ? 'bg-[#4b8eff] text-white font-bold shadow-[0_4px_16px_rgba(75,142,255,0.4)] border border-white/30' 
                : 'text-[#c1c6d7] hover:text-white hover:bg-white/[0.06]'
            }`}
            title="All Poles"
          >
            All Poles ({poles.length})
          </button>
          <button
            onClick={() => setActiveLayer('faults')}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all flex items-center gap-1.5 frosted-btn ${
              activeLayer === 'faults' 
                ? 'bg-[#ffb4ab] text-[#690005] font-bold shadow-[0_4px_16px_rgba(255,180,171,0.4)] border border-white/30' 
                : 'text-[#ffb4ab] hover:bg-[#ffb4ab]/15'
            }`}
            title="Only Anomalies"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Alerts
          </button>
          <button
            onClick={() => setActiveLayer('solar')}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all flex items-center gap-1.5 frosted-btn ${
              activeLayer === 'solar' 
                ? 'bg-[#39dcd2] text-[#003734] font-bold shadow-[0_4px_16px_rgba(57,220,210,0.4)] border border-white/30' 
                : 'text-[#39dcd2] hover:bg-[#39dcd2]/15'
            }`}
            title="Solar Enabled"
          >
            <Sun className="w-3.5 h-3.5" />
            Solar
          </button>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="frosted-panel p-1.5 rounded-2xl flex flex-col gap-1.5 self-end border border-white/20 shadow-lg">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
            className="p-2.5 text-[#c1c6d7] hover:text-white hover:bg-white/10 rounded-xl transition-all frosted-btn"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
            className="p-2.5 text-[#c1c6d7] hover:text-white hover:bg-white/10 rounded-xl transition-all frosted-btn"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-2.5 text-[#c1c6d7] hover:text-white hover:bg-white/10 rounded-xl transition-all frosted-btn"
            title="Reset View"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Map Legend & Status (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-30 hidden sm:flex items-center gap-3.5 frosted-panel px-4 py-2 rounded-full text-xs text-[#c1c6d7] border border-white/20 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#39dcd2] shadow-[0_0_8px_rgba(57,220,210,0.8)]" />
          <span>Nominal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffda6a] shadow-[0_0_8px_rgba(255,218,106,0.8)]" />
          <span>Warning / High Draw</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab] shadow-[0_0_8px_rgba(255,180,171,0.8)]" />
          <span>Critical / Fault</span>
        </div>
      </div>
    </div>
  );
};
