import React from 'react';
import {
  Sprout,
  Bell,
  ScanLine,
  ChevronDown,
  Menu,
  MapPin,
  Sparkles,
  Layers,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DemoModeBadge } from './DemoModeBadge';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  onOpenLeafDoctor: () => void;
  onNavigateToAlerts: () => void;
  unreadAlertsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileMenu,
  onOpenLeafDoctor,
  onNavigateToAlerts,
  unreadAlertsCount
}) => {
  const { user, farms, selectedFarm, selectedFarmId, setSelectedFarmId, logout } = useAuth();
  const [showFarmDropdown, setShowFarmDropdown] = React.useState(false);
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 shadow-2xs">
      {/* Left: Mobile trigger & Overview Status */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 lg:hidden"
          title="Open Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold text-gray-800 truncate max-w-[150px] sm:max-w-none">
            Overview: {selectedFarm ? selectedFarm.name : 'Central Hub'}
          </span>
          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
            DEMO MODE ACTIVE
          </span>
        </div>
      </div>

      {/* Middle/Right: Farm Selector & Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Weather pill */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-600 font-medium bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
          <span>Cloudy, 24°C</span>
        </div>

        {/* Farm Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFarmDropdown(!showFarmDropdown)}
            className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            <span className="max-w-[110px] sm:max-w-[160px] truncate font-semibold">
              {selectedFarm ? selectedFarm.name : 'Select Farm'}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>

          {showFarmDropdown && (
            <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl border border-gray-200 bg-white p-2 shadow-xl z-50">
              <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Active Farmlands ({farms.length})
              </div>
              <div className="space-y-1 mt-1 max-h-60 overflow-y-auto">
                {farms.map((farm) => (
                  <button
                    key={farm.id}
                    onClick={() => {
                      setSelectedFarmId(farm.id);
                      setShowFarmDropdown(false);
                    }}
                    className={`flex w-full items-start justify-between rounded-lg p-2 text-left text-xs transition-colors ${
                      farm.id === selectedFarmId
                        ? 'bg-emerald-50 text-emerald-950 font-medium'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{farm.name}</p>
                      <p className="text-[11px] text-gray-500">
                        {farm.cropType} • {farm.areaAcres} Acres
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block text-[11px] font-bold px-1.5 py-0.5 rounded ${
                        farm.overallHealthScore >= 80 ? 'bg-emerald-100 text-emerald-800' :
                        farm.overallHealthScore >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {farm.overallHealthScore}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Leaf Doctor Button */}
        <button
          type="button"
          onClick={onOpenLeafDoctor}
          className="flex items-center gap-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3.5 py-1.5 font-medium shadow-2xs transition-colors"
          title="Upload crop leaf photo for AI pathogen & disease detection"
        >
          <ScanLine className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Leaf Doctor AI</span>
          <span className="sm:hidden">Scan</span>
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={onNavigateToAlerts}
          className="relative rounded-md border border-gray-200 p-1.5 text-gray-600 hover:bg-gray-50 transition-colors"
          title="Farm Health Alerts"
        >
          <Bell className="h-4 w-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        {/* Farmer Profile Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 rounded-md p-1 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111827] text-white font-semibold text-xs shadow-xs">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'JD'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-gray-900 leading-tight">{user?.name || 'Farmer Account'}</p>
              <p className="text-[10px] text-gray-500 leading-tight">Agronomist Pro</p>
            </div>
            <ChevronDown className="hidden lg:block h-3.5 w-3.5 text-gray-400" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-gray-200 bg-white p-2 shadow-xl z-50">
              <div className="border-b border-gray-100 px-3 py-2">
                <p className="text-xs font-semibold text-gray-900">{user?.name}</p>
                <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                <p className="mt-1 text-[10px] text-emerald-700 font-medium">{user?.farmName}</p>
              </div>
              <div className="mt-1 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
