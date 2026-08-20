import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { StreetLightPole, FaultReport } from '../types';
import { 
  ZoomIn, 
  ZoomOut, 
  AlertTriangle, 
  Sun, 
  ExternalLink, 
  MapPin, 
  Compass, 
  Radio, 
  Search, 
  Crosshair, 
  Layers, 
  Sparkles, 
  Zap, 
  Activity, 
  Maximize2,
  Droplets
} from 'lucide-react';

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
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userLocationLayerRef = useRef<L.LayerGroup | null>(null);
  const clickedPinLayerRef = useRef<L.LayerGroup | null>(null);

  const [mapTheme, setMapTheme] = useState<'satellite' | 'dark-water' | 'streets'>('satellite');
  const [activeLayer, setActiveLayer] = useState<'all' | 'faults' | 'solar'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [liveClock, setLiveClock] = useState<string>(new Date().toLocaleTimeString());

  // Live telemetry clock ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClock(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter poles based on layer
  const filteredPoles = useMemo(() => {
    return poles.filter(p => {
      if (activeLayer === 'faults') return p.status === 'fault' || p.status === 'warning' || p.status === 'offline';
      if (activeLayer === 'solar') return p.solarEquipped;
      return true;
    });
  }, [poles, activeLayer]);

  // Tile layer URLs for real-time map views
  const tileLayers = {
    'satellite': {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &mdash; High-Res Real-Time Satellite'
    },
    'dark-water': {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> Water Dark Matter'
    },
    'streets': {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialCenter: [number, number] = selectedPole 
      ? [selectedPole.lat, selectedPole.lng] 
      : [13.0450, 80.2400]; // Chennai Smart Grid Center

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
      maxZoom: 19,
      minZoom: 4
    });

    // Default tile layer (Real-Time High-Res Satellite)
    L.tileLayer(tileLayers['satellite'].url, {
      attribution: tileLayers['satellite'].attribution,
      maxZoom: 19
    }).addTo(map);

    // Layer groups for markers
    const markersGroup = L.layerGroup().addTo(map);
    const userLocGroup = L.layerGroup().addTo(map);
    const clickPinGroup = L.layerGroup().addTo(map);

    markersLayerRef.current = markersGroup;
    userLocationLayerRef.current = userLocGroup;
    clickedPinLayerRef.current = clickPinGroup;
    mapInstanceRef.current = map;

    // Click handler to drop inspection pin
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setClickedCoords({ lat, lng });

      clickPinGroup.clearLayers();

      const pulseIcon = L.divIcon({
        className: 'custom-click-pin',
        html: `
          <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
            <div class="absolute w-8 h-8 rounded-full bg-emerald-400/40 animate-ping"></div>
            <div class="w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-[0_0_15px_#34d399]"></div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const clickMarker = L.marker([lat, lng], { icon: pulseIcon }).addTo(clickPinGroup);
      
      clickMarker.bindPopup(`
        <div class="p-2 min-w-[200px] text-white">
          <div class="flex items-center gap-1.5 text-xs text-emerald-300 font-mono font-bold mb-1">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            REAL-TIME PIN
          </div>
          <p class="text-xs text-white font-mono">${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E</p>
          <div class="mt-2.5 flex items-center gap-2">
            <a 
              href="https://www.google.com/maps/search/?api=1&query=${lat},${lng}" 
              target="_blank" 
              class="text-[11px] px-2.5 py-1 rounded-xl bg-white/20 text-white border border-white/40 font-medium hover:bg-white/30 transition-all flex items-center gap-1 shadow-sm"
            >
              Open Satellite <span class="text-[9px]">↗</span>
            </a>
          </div>
        </div>
      `).openPopup();
    });

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when Map Theme changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const activeConfig = tileLayers[mapTheme];
    L.tileLayer(activeConfig.url, {
      attribution: activeConfig.attribution,
      maxZoom: 19
    }).addTo(map);
  }, [mapTheme]);

  // Update Markers on Pole or Layer Changes with Crystal Water Node Styling
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    filteredPoles.forEach((pole) => {
      const isSelected = selectedPole?.id === pole.id;
      
      let color = '#34d399'; // Emerald-Mint active
      let shadowColor = 'rgba(52, 211, 153, 0.95)';
      let statusBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40';

      if (pole.status === 'fault' || pole.status === 'offline') {
        color = '#f87171'; // Crimson fault
        shadowColor = 'rgba(248, 113, 113, 0.95)';
        statusBadge = 'bg-rose-500/20 text-rose-300 border-rose-400/40';
      } else if (pole.status === 'warning') {
        color = '#fbbf24'; // Amber warning
        shadowColor = 'rgba(251, 191, 36, 0.9)';
        statusBadge = 'bg-amber-500/20 text-amber-300 border-amber-400/40';
      }

      // Crystal Water Droplet Bioluminescent Icon
      const customIcon = L.divIcon({
        className: `pole-node-${pole.id}`,
        html: `
          <div class="relative flex flex-col items-center cursor-pointer transition-transform ${
            isSelected ? 'scale-125 z-40' : 'hover:scale-115 z-20'
          }">
            ${(isSelected || pole.status === 'fault') ? `
              <div class="absolute -inset-2.5 rounded-full water-ripple-anim pointer-events-none" style="background-color: ${color}; opacity: 0.6;"></div>
            ` : ''}
            <div class="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-lg transition-transform" 
                 style="background: radial-gradient(circle, #ffffff 20%, ${color} 80%); box-shadow: 0 0 16px ${shadowColor};">
              <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
            <div class="mt-1 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-tight shadow-md border backdrop-blur-md whitespace-nowrap ${
              isSelected 
                ? 'bg-white text-slate-900 border-white ring-2 ring-emerald-400/70 shadow-lg' 
                : 'bg-[#0a141c]/90 text-slate-100 border-white/30'
            }">
              ${pole.id}
            </div>
          </div>
        `,
        iconSize: [36, 42],
        iconAnchor: [18, 21]
      });

      const marker = L.marker([pole.lat, pole.lng], { icon: customIcon }).addTo(markersGroup);

      // Popup with Crystal Water Glass Theme
      const popupContent = `
        <div class="p-1 min-w-[210px] max-w-[260px] text-white">
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="font-mono text-xs font-bold text-emerald-300">${pole.id}</span>
            <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusBadge}">${pole.status}</span>
          </div>

          <h4 class="font-bold text-sm text-white leading-snug">${pole.name}</h4>
          <p class="text-xs text-slate-300 mt-0.5">${pole.location}</p>

          <div class="grid grid-cols-2 gap-1.5 mt-2.5 pt-2 border-t border-white/15 text-[11px] text-slate-200">
            <div>Power: <strong class="text-white font-mono">${pole.powerDraw}W</strong></div>
            <div>Lux: <strong class="text-white font-mono">${pole.ambientLux} lx</strong></div>
            <div>Temp: <strong class="text-white font-mono">${pole.temperature}°C</strong></div>
            <div>Ping: <strong class="text-emerald-400 font-mono">${pole.lastPing}</strong></div>
          </div>

          <div class="mt-3 flex items-center gap-2">
            <a
              href="https://www.google.com/maps/search/?api=1&query=${pole.lat},${pole.lng}"
              target="_blank"
              class="flex-1 text-center py-1.5 px-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold flex items-center justify-center gap-1 shadow-md border border-white/50"
            >
              <span>Satellite GPS</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        onSelectPole(pole);
      });
    });
  }, [filteredPoles, selectedPole]);

  // Smooth Pan when Selected Pole changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPole) return;

    map.panTo([selectedPole.lat, selectedPole.lng], {
      animate: true,
      duration: 0.8
    });
    if (map.getZoom() < 14) {
      map.setZoom(15);
    }
  }, [selectedPole]);

  // Live Location Finder (GPS)
  const handleLocateMe = () => {
    const map = mapInstanceRef.current;
    const userLocGroup = userLocationLayerRef.current;
    if (!map || !userLocGroup) return;

    setIsLocating(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const { latitude, longitude, accuracy } = pos.coords;

          userLocGroup.clearLayers();

          const userIcon = L.divIcon({
            className: 'user-live-gps',
            html: `
              <div class="relative flex items-center justify-center">
                <div class="absolute w-10 h-10 rounded-full bg-emerald-400/30 animate-ping"></div>
                <div class="w-5 h-5 rounded-full bg-emerald-400 border-2 border-white shadow-[0_0_18px_#34d399] flex items-center justify-center">
                  <div class="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                </div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          L.marker([latitude, longitude], { icon: userIcon })
            .addTo(userLocGroup)
            .bindPopup(`
              <div class="p-1 text-xs text-white">
                <div class="font-bold text-emerald-300">Your Live GPS Location</div>
                <div class="text-[11px] text-slate-300 font-mono mt-0.5">${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E</div>
                <div class="text-[10px] text-slate-400 mt-1">Accuracy: ±${Math.round(accuracy)}m</div>
              </div>
            `)
            .openPopup();

          L.circle([latitude, longitude], {
            radius: Math.min(accuracy, 500),
            color: '#34d399',
            fillColor: '#34d399',
            fillOpacity: 0.12,
            weight: 1.5
          }).addTo(userLocGroup);

          map.flyTo([latitude, longitude], 15, { duration: 1.2 });
        },
        () => {
          setIsLocating(false);
          map.flyTo([13.0450, 80.2400], 14, { duration: 1 });
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();

    const matchedPole = poles.find(
      p => p.id.toLowerCase().includes(query) || p.location.toLowerCase().includes(query) || p.name.toLowerCase().includes(query)
    );

    if (matchedPole) {
      onSelectPole(matchedPole);
      return;
    }

    const locationsMap: Record<string, [number, number]> = {
      'anna nagar': [13.0850, 80.2100],
      'marina beach': [13.0480, 80.2800],
      't nagar': [13.0418, 80.2341],
      'omr': [12.9150, 80.2280],
      'guindy': [13.0067, 80.2020],
      'besant nagar': [12.9980, 80.2680],
      'adyar': [13.0012, 80.2565],
      'mylapore': [13.0335, 80.2677],
      'central': [13.0827, 80.2707],
      'chennai': [13.0450, 80.2400]
    };

    for (const [key, coords] of Object.entries(locationsMap)) {
      if (query.includes(key)) {
        mapInstanceRef.current?.flyTo(coords, 14, { duration: 1 });
        return;
      }
    }

    if (poles.length > 0) {
      onSelectPole(poles[0]);
    }
  };

  const zoomIn = () => mapInstanceRef.current?.zoomIn();
  const zoomOut = () => mapInstanceRef.current?.zoomOut();

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] overflow-hidden rounded-3xl bg-black select-none liquid-frame border border-white/35 shadow-2xl">
      {/* Real-Time Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating High-Contrast Crystal Glass Top Slide Bar (Top Left) */}
      <div className="absolute top-3.5 left-3.5 z-[1000] flex flex-wrap items-center gap-2 pointer-events-auto">
        {/* Live Grid Ticker Pill */}
        <div className="px-3.5 py-1.5 rounded-2xl flex items-center gap-2 bg-white/25 sm:bg-white/20 backdrop-blur-3xl border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white drop-shadow-sm">
            <span className="text-emerald-300 hidden sm:inline">LIVE GRID:</span>
            <span>{liveClock}</span>
          </div>
        </div>

        {/* Real-Time Layer Selector Glass Capsule */}
        <div className="p-1 rounded-2xl flex items-center gap-1 bg-white/20 backdrop-blur-3xl border border-white/45 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
          <button
            onClick={() => setMapTheme('satellite')}
            className={`px-3 py-1 text-xs rounded-xl font-semibold transition-all ${
              mapTheme === 'satellite'
                ? 'bg-white text-slate-900 font-bold shadow-md'
                : 'text-white/80 hover:text-white hover:bg-white/15'
            }`}
            title="Real-Time High-Resolution Photographic Satellite Imagery"
          >
            <span>Real Satellite</span>
          </button>
          <button
            onClick={() => setMapTheme('dark-water')}
            className={`px-3 py-1 text-xs rounded-xl font-semibold transition-all ${
              mapTheme === 'dark-water'
                ? 'bg-white text-slate-900 font-bold shadow-md'
                : 'text-white/80 hover:text-white hover:bg-white/15'
            }`}
            title="Crystal Water Dark Grid with Road Networks"
          >
            <span>Water Dark</span>
          </button>
          <button
            onClick={() => setMapTheme('streets')}
            className={`px-3 py-1 text-xs rounded-xl font-semibold transition-all ${
              mapTheme === 'streets'
                ? 'bg-white text-slate-900 font-bold shadow-md'
                : 'text-white/80 hover:text-white hover:bg-white/15'
            }`}
            title="OpenStreetMap Live Vector Roads"
          >
            <span>Streets</span>
          </button>
        </div>
      </div>

      {/* Floating High-Contrast Crystal Glass Top Slide Bar (Top Right) */}
      <div className="absolute top-3.5 right-3.5 z-[1000] flex items-center gap-2 pointer-events-auto">
        {/* Quick Search Form */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pole or area..."
            className="w-44 lg:w-52 py-1.5 pl-8 pr-3 text-xs rounded-2xl bg-white/20 backdrop-blur-3xl placeholder-white/70 text-white focus:w-60 focus:bg-white/30 transition-all border border-white/45 shadow-[0_8px_30px_rgba(0,0,0,0.6)] outline-none"
          />
          <Search className="w-3.5 h-3.5 text-white absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </form>

        {/* Layer Filters */}
        <div className="p-1 rounded-2xl flex items-center gap-1 bg-white/20 backdrop-blur-3xl border border-white/45 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-2.5 py-1 text-xs rounded-xl font-semibold transition-all ${
              activeLayer === 'all'
                ? 'bg-white text-slate-900 font-bold shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/15'
            }`}
          >
            All ({poles.length})
          </button>
          <button
            onClick={() => setActiveLayer('faults')}
            className={`px-2.5 py-1 text-xs rounded-xl font-semibold flex items-center gap-1 transition-all ${
              activeLayer === 'faults'
                ? 'bg-rose-500 text-white font-bold shadow-sm'
                : 'text-rose-200 hover:text-white hover:bg-white/15'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Faults</span>
          </button>
          <button
            onClick={() => setActiveLayer('solar')}
            className={`px-2.5 py-1 text-xs rounded-xl font-semibold flex items-center gap-1 transition-all ${
              activeLayer === 'solar'
                ? 'bg-emerald-400 text-slate-900 font-bold shadow-sm'
                : 'text-emerald-200 hover:text-white hover:bg-white/15'
            }`}
          >
            <Sun className="w-3 h-3" />
            <span>Solar</span>
          </button>
        </div>
      </div>

      {/* Floating Map Zoom & Live GPS Controls (Bottom Right) */}
      <div className="absolute right-3.5 bottom-24 lg:bottom-28 z-[1000] flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={handleLocateMe}
          disabled={isLocating}
          className="w-10 h-10 rounded-2xl bg-white/25 hover:bg-white/40 backdrop-blur-3xl border border-white/50 text-white flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-95 transition-all"
          title="Detect My Live GPS Position"
        >
          <Crosshair className={`w-5 h-5 ${isLocating ? 'animate-spin text-emerald-300' : 'text-white'}`} />
        </button>

        <div className="flex flex-col rounded-2xl overflow-hidden bg-white/25 backdrop-blur-3xl border border-white/50 shadow-[0_8px_25px_rgba(0,0,0,0.6)]">
          <button
            onClick={zoomIn}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/25 transition-all border-b border-white/20"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={zoomOut}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/25 transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
