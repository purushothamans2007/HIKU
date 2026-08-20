import React, { useState } from 'react';
import { Search, Bell, Settings, User, AlertCircle, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { AlertNotification, StreetLightPole, FaultReport } from '../types';

interface HeaderProps {
  notifications: AlertNotification[];
  onOpenSettings: () => void;
  onSelectPoleById?: (poleId: string) => void;
  onSelectFaultById?: (faultId: string) => void;
  poles: StreetLightPole[];
  faults: FaultReport[];
}

export const Header: React.FC<HeaderProps> = ({
  notifications,
  onOpenSettings,
  onSelectPoleById,
  onSelectFaultById,
  poles,
  faults
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const searchResults = searchQuery.trim() ? {
    poles: poles.filter(p => 
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.zone.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    faults: faults.filter(f => 
      f.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
  } : null;

  return (
    <header className="fixed top-0 w-full lg:pl-64 z-[60] h-16 bg-[#0e1019]/60 backdrop-blur-2xl border-b border-white/12 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex items-center justify-between px-4 sm:px-6">
      {/* Left: Branding for mobile & Search Bar */}
      <div className="flex items-center gap-4 flex-1">
        <span className="font-bold text-xl text-[#4b8eff] tracking-tight lg:hidden drop-shadow-[0_0_12px_rgba(75,142,255,0.5)]">
          hiku
        </span>

        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c1c6d7]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ID, Location or Fault (#FLT...)"
            className="w-full frosted-input rounded-full py-2 pl-10 pr-9 text-xs sm:text-sm text-white placeholder-[#c1c6d7]/50 focus:outline-none focus:border-[#4b8eff] focus:ring-1 focus:ring-[#4b8eff]/60 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c1c6d7] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Live Search Overlay Results */}
          {searchResults && (searchResults.poles.length > 0 || searchResults.faults.length > 0) && (
            <div className="absolute top-12 left-0 w-full frosted-panel rounded-2xl p-3 shadow-2xl border border-white/20 max-h-96 overflow-y-auto z-50 space-y-3">
              {searchResults.poles.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-[#4b8eff] uppercase tracking-wider mb-1.5 px-1">
                    Street Light Poles ({searchResults.poles.length})
                  </div>
                  <div className="space-y-1">
                    {searchResults.poles.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectPoleById?.(p.id);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/5 hover:border-white/20 text-left transition-all"
                      >
                        <div>
                          <span className="font-mono font-bold text-xs text-[#4b8eff] mr-2">{p.id}</span>
                          <span className="text-xs text-white">{p.location}</span>
                        </div>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          p.status === 'active' ? 'bg-[#39dcd2]/15 text-[#39dcd2] border-[#39dcd2]/30' : 'bg-[#ffb4ab]/15 text-[#ffb4ab] border-[#ffb4ab]/30'
                        }`}>
                          {p.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.faults.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-[#ffb4ab] uppercase tracking-wider mb-1.5 px-1">
                    Fault Issues ({searchResults.faults.length})
                  </div>
                  <div className="space-y-1">
                    {searchResults.faults.map(f => (
                      <button
                        key={f.id}
                        onClick={() => {
                          onSelectFaultById?.(f.id);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/5 hover:border-white/20 text-left transition-all"
                      >
                        <div>
                          <span className="font-mono font-bold text-xs text-[#ffb4ab] mr-2">{f.id}</span>
                          <span className="text-xs text-white">{f.title}</span>
                          <p className="text-[11px] text-[#c1c6d7]">{f.location}</p>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/15">
                          {f.severity}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 text-[#c1c6d7] hover:text-white hover:bg-white/10 rounded-full transition-all relative border border-transparent hover:border-white/15"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ffb4ab] rounded-full ring-2 ring-[#0b0d13] animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 frosted-panel rounded-2xl p-4 shadow-2xl border border-white/20 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-white">Live Grid Alerts</h3>
                  {unreadCount > 0 && (
                    <span className="bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[#c1c6d7] hover:text-white p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-2 divide-y divide-white/5 max-h-80 overflow-y-auto">
                {notifications.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      if (alert.relatedId) onSelectPoleById?.(alert.relatedId);
                      setShowNotifications(false);
                    }}
                    className={`py-2.5 px-2.5 rounded-xl cursor-pointer transition-all flex items-start gap-3 border border-transparent ${
                      !alert.read ? 'bg-white/[0.07] border-white/10 shadow-sm' : 'hover:bg-white/[0.06] hover:border-white/10'
                    }`}
                  >
                    <div className="mt-0.5">
                      {alert.type === 'critical' ? (
                        <AlertCircle className="w-4 h-4 text-[#ffb4ab]" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-[#39dcd2]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{alert.title}</p>
                      <p className="text-[11px] text-[#c1c6d7] truncate">{alert.subtitle}</p>
                    </div>
                    <span className="text-[10px] text-[#8b90a0] shrink-0">{alert.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 text-[#c1c6d7] hover:text-white hover:bg-white/10 rounded-full transition-all border border-transparent hover:border-white/15"
          title="Grid Configuration & Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User Profile Avatar with dropdown */}
        <div className="relative ml-1">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="w-9 h-9 rounded-full overflow-hidden border border-white/25 hover:border-[#4b8eff] transition-all relative ring-2 ring-transparent hover:ring-[#4b8eff]/40 shadow-md"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrHhDhMLQoTHnuTvLQCLd4VAfzSQ0_3lMUl8gZWQxU8H-i7Db0weWSCNfkXgfuZ4nQFujQkL2onoaVbZWwbBJKgF1C0-nsBW4_aYX0C_UaVROxoPoO1B_91wMNLWSh5OeYlMYh3yBVAyowt1KY7nkWo8RN-9jFkBKu899ahQ5UEywhTvtEq6GQrwrEs6KLf9AYgMr0vVHBMPdRClyXv8x_Vq0iAFnOMaL9R2oiv3dli3BdsT9G9BGv"
              alt="User Engineer Avatar"
              className="w-full h-full object-cover"
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-64 frosted-panel rounded-2xl p-4 shadow-2xl border border-white/20 z-50">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#4b8eff]/60 shadow-inner">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrHhDhMLQoTHnuTvLQCLd4VAfzSQ0_3lMUl8gZWQxU8H-i7Db0weWSCNfkXgfuZ4nQFujQkL2onoaVbZWwbBJKgF1C0-nsBW4_aYX0C_UaVROxoPoO1B_91wMNLWSh5OeYlMYh3yBVAyowt1KY7nkWo8RN-9jFkBKu899ahQ5UEywhTvtEq6GQrwrEs6KLf9AYgMr0vVHBMPdRClyXv8x_Vq0iAFnOMaL9R2oiv3dli3BdsT9G9BGv"
                    alt="Engineer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Eng. Ananya V.</p>
                  <p className="text-[11px] text-[#4b8eff] font-medium">Chief Grid Controller</p>
                </div>
              </div>
              <div className="py-2 text-xs text-[#c1c6d7] space-y-1.5">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span>Sector Authorization:</span>
                  <span className="font-semibold text-white">Chennai Alpha</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Security Level:</span>
                  <span className="font-mono text-[#39dcd2] font-bold">LEVEL-4 ROOT</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
