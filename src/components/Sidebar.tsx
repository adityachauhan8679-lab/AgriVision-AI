import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Map as MapIcon,
  Satellite,
  Activity,
  Cpu,
  CloudSun,
  Sparkles,
  Bell,
  FileText,
  User,
  LogOut,
  X,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type NavTab =
  | 'dashboard'
  | 'farms'
  | 'gis'
  | 'satellite'
  | 'crop-health'
  | 'sensors'
  | 'weather'
  | 'recommendations'
  | 'alerts'
  | 'reports'
  | 'profile';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  unreadAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  unreadAlertsCount
}) => {
  const { logout, user } = useAuth();

  const navItems: {
    id: NavTab;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'farms', label: 'My Farms', icon: MapPin },
    { id: 'gis', label: 'GIS Management Map', icon: MapIcon },
    { id: 'satellite', label: 'Satellite Monitoring', icon: Satellite },
    { id: 'crop-health', label: 'AI Crop Health', icon: Activity },
    { id: 'sensors', label: 'IoT Sensors', icon: Cpu, badge: 'Live', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'weather', label: 'Weather Intelligence', icon: CloudSun },
    { id: 'recommendations', label: 'AI Recommendations', icon: Sparkles },
    {
      id: 'alerts',
      label: 'Smart Alerts',
      icon: Bell,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
      badgeColor: 'bg-rose-500 text-white'
    },
    { id: 'reports', label: 'Audit Reports', icon: FileText },
    { id: 'profile', label: 'Farmer Profile', icon: User }
  ];

  const handleItemClick = (id: NavTab) => {
    onSelectTab(id);
    onCloseMobile();
  };

  const content = (
    <div className="flex h-full flex-col justify-between bg-[#111827] text-white border-r border-[#374151]">
      {/* Upper Section */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
        {/* Brand Header */}
        <div className="p-3 mb-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center font-bold text-white text-base shadow-xs shrink-0">
                A
              </div>
              <span className="font-bold text-lg tracking-tight text-white">AgriVision AI</span>
            </div>
            {/* Mobile close button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-white lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 font-semibold tracking-wider mt-1 uppercase">
            SMART AGRICULTURE OS
          </p>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
                className={`flex w-full items-center justify-between px-3 py-2 text-[13px] rounded-lg transition-colors mx-auto ${
                  isActive
                    ? 'bg-[#1f2937] text-white font-medium'
                    : 'text-[#9ca3af] hover:text-white hover:bg-[#1f2937]/50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-gray-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    item.id === 'alerts'
                      ? 'bg-red-500 text-white'
                      : 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/50'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Session & Farmer Profile */}
      <div className="p-3 border-t border-gray-800 bg-[#111827]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-emerald-900 border border-emerald-700/50 flex items-center justify-center text-xs font-semibold text-emerald-200 shrink-0">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'JD'}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-xs font-medium text-gray-200 truncate">{user?.name || 'Farmer Account'}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.farmName || 'Green Valley Farms'}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-gray-800 transition-colors shrink-0"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex w-[220px] flex-col h-screen shrink-0 sticky top-0">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative flex w-[240px] max-w-xs flex-1 flex-col shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
