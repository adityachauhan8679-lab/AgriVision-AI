import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  ShieldCheck,
  Cpu,
  Satellite,
  Layers,
  LogOut,
  CheckCircle2
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, logout, farms } = useAuth();

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Farmer Account & Agronomist Profile</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage your precision farming credentials and telemetry gateways</p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors shadow-2xs"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="grid-card space-y-5">
        <div className="flex items-center gap-3.5 border-b border-gray-100 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#111827] text-white font-bold text-base shadow-2xs">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'AG'}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">{user?.name || 'Farmer Account'}</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
              <Building className="h-3.5 w-3.5 text-emerald-600" />
              <span>{user?.farmName || 'Primary Farm Hub'}</span>
              <span>•</span>
              <MapPin className="h-3.5 w-3.5 text-gray-400" />
              <span>{user?.location || 'Salinas, CA'}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg bg-gray-50 p-3 border border-gray-200">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Email Address</span>
            <p className="font-bold text-gray-900 text-xs mt-1">{user?.email}</p>
          </div>

          <div className="rounded-lg bg-gray-50 p-3 border border-gray-200">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Contact Phone</span>
            <p className="font-bold text-gray-900 text-xs mt-1">{user?.phone || '+1 (555) 234-5678'}</p>
          </div>

          <div className="rounded-lg bg-gray-50 p-3 border border-gray-200">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Registered Plots</span>
            <p className="font-bold text-gray-900 text-xs mt-1">{farms.length} Farmland Estates</p>
          </div>

          <div className="rounded-lg bg-gray-50 p-3 border border-gray-200">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Role & Clearance</span>
            <p className="font-bold text-emerald-700 text-xs mt-1">{user?.role || 'FARMER'} (Full Telemetry Access)</p>
          </div>
        </div>
      </div>

      {/* System & Architecture Status */}
      <div className="grid-card space-y-3.5">
        <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider border-b border-gray-100 pb-2">
          Precision Agriculture Engine Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-950">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-xs">Sentinel-2 Sync</p>
              <p className="text-[11px] text-emerald-800">10m Multi-spectral NIR active</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-950">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-xs">IoT In-Situ Gateways</p>
              <p className="text-[11px] text-emerald-800">LoRaWAN 915MHz • 8s Polling</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-950">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-xs">Computer Vision</p>
              <p className="text-[11px] text-emerald-800">Leaf Pathology CNN online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
