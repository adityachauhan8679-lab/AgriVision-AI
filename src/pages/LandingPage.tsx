import React from 'react';
import {
  Sprout,
  Satellite,
  Activity,
  Cpu,
  Bell,
  CloudSun,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  MapPin,
  LineChart,
  ChevronRight,
  TrendingUp,
  Droplets
} from 'lucide-react';
import { DemoModeBadge } from '../components/DemoModeBadge';

interface LandingPageProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
  onInstantDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToLogin,
  onGoToRegister,
  onInstantDemo
}) => {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-900 selection:bg-emerald-500 selection:text-white font-sans">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-2xs">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-gray-900">AgriVision</span>
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">AI</span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium hidden sm:block">Precision Farming & Remote Sensing</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-7 text-xs font-medium text-gray-600">
            <a href="#features" className="hover:text-emerald-700 transition-colors">Features</a>
            <a href="#gis-zones" className="hover:text-emerald-700 transition-colors">GIS Management</a>
            <a href="#satellite" className="hover:text-emerald-700 transition-colors">Satellite NDVI</a>
            <a href="#how-it-works" className="hover:text-emerald-700 transition-colors">How It Works</a>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onInstantDemo}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              1-Click Demo
            </button>

            <button
              type="button"
              onClick={onGoToLogin}
              className="text-xs font-medium text-gray-700 hover:text-gray-900 px-2.5 py-1.5"
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={onGoToRegister}
              className="rounded-md bg-emerald-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-2xs hover:bg-emerald-500 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium mb-5 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Next-Gen Agricultural Intelligence Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Turn Your Farm Data Into{' '}
              <span className="text-emerald-700">Smarter Decisions</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Crop health varies significantly within the same field. AgriVision AI combines satellite multi-spectral remote sensing, IoT soil telemetries, and computer vision to partition your farm into geotagged management zones with zone-specific precision farming prescriptions.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onInstantDemo}
                className="flex items-center gap-2 rounded-md bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-500 transition-colors"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onGoToRegister}
                className="flex items-center gap-2 rounded-md bg-white border border-gray-300 px-5 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-2xs transition-colors"
              >
                <span>Create Farmer Account</span>
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> No Hardware Required to Test
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Sentinel-2 10m NDVI
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Real-time IoT Simulation
              </span>
            </div>
          </div>

          {/* Interactive UI Mockup Showcase */}
          <div className="mt-12 rounded-xl border border-gray-200 bg-white p-2.5 shadow-md">
            <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              {/* Toolbar */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-[#111827] px-4 py-2 text-white">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-mono text-gray-400">agrivision.ai/dashboard • Green Horizon Wheat Fields</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-300 font-medium bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Live GIS Multi-Zone Active
                  </span>
                </div>
              </div>

              {/* Showcase Grid */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-2xs">
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-gray-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">GIS Zones</span>
                    <span className="badge health-80">4 Sectors</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between p-2 rounded bg-emerald-50 border border-emerald-100 text-xs">
                      <span className="font-semibold text-emerald-900 text-[11px]">Zone 1: North Plateau</span>
                      <span className="badge health-80">92% • Healthy</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-amber-50 border border-amber-100 text-xs">
                      <span className="font-semibold text-amber-900 text-[11px]">Zone 2: Central Basin</span>
                      <span className="badge health-50">68% • Mod. Stress</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-red-50 border border-red-100 text-xs">
                      <span className="font-semibold text-red-900 text-[11px]">Zone 3: South Hill slope</span>
                      <span className="badge health-30">41% • Deficit</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-2xs">
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-gray-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">IoT Soil Telemetry</span>
                    <span className="text-xs font-bold text-emerald-700">Node #704 Online</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 p-2 rounded border border-gray-200">
                      <span className="text-gray-500 text-[10px] block">Soil Moisture</span>
                      <p className="font-bold text-gray-900 text-base mt-0.5">31.4%</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded border border-gray-200">
                      <span className="text-gray-500 text-[10px] block">Root Temp</span>
                      <p className="font-bold text-gray-900 text-base mt-0.5">21.8°C</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded border border-gray-200">
                      <span className="text-gray-500 text-[10px] block">Soil pH</span>
                      <p className="font-bold text-gray-900 text-base mt-0.5">6.8</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded border border-gray-200">
                      <span className="text-gray-500 text-[10px] block">Canopy Lux</span>
                      <p className="font-bold text-gray-900 text-base mt-0.5">68,500</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-2xs">
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-gray-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">AI Agronomy Engine</span>
                    <span className="text-xs font-bold text-emerald-700">Yield +14%</span>
                  </div>
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs">
                    <p className="text-emerald-900 font-semibold mb-1 text-[11px]">Prescription Generated:</p>
                    <p className="text-gray-700 text-[11px] leading-relaxed">
                      "Direct 22,500L irrigation exclusively to Zone 3. Avoid whole-field uniform spraying: Zone 1 & 4 are in peak vigor, saving 65% water & fertilizer costs."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Six Feature Cards Section */}
      <section id="features" className="py-16 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Core Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">Comprehensive Precision Agriculture Suite</h2>
            <p className="text-gray-500 text-xs mt-2">
              Replacing intuition with multispectral telemetry and autonomous agronomy modeling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1 */}
            <div className="grid-card p-5 hover:border-emerald-300 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 mb-3.5">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">AI Crop Health Analysis</h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Calculates holistic Crop Health Scores (0-100), disease probabilities, pest infestation risks, and nutrient deficiencies with zone-specific prescriptions.
              </p>
            </div>

            {/* Card 2 */}
            <div className="grid-card p-5 hover:border-emerald-300 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 mb-3.5">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">GIS Management Zones</h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Partitions fields into Green (Healthy), Yellow (Moderate Stress), and Red (Severe Stress) polygons on interactive Leaflet maps with boundary drawing.
              </p>
            </div>

            {/* Card 3 */}
            <div className="grid-card p-5 hover:border-emerald-300 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 mb-3.5">
                <Satellite className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Satellite Monitoring & NDVI</h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Sentinel-2 multi-spectral remote sensing tracking NDVI vegetation indexes over 7, 15, and 30-day passes with pixel heatmaps and water stress tracking.
              </p>
            </div>

            {/* Card 4 */}
            <div className="grid-card p-5 hover:border-emerald-300 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 mb-3.5">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">IoT Sensor Telemetry</h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Live simulated readings for Soil Moisture, Soil Temperature, Air Temperature, Humidity, Soil pH, Cumulative Rainfall, and Solar Insolation.
              </p>
            </div>

            {/* Card 5 */}
            <div className="grid-card p-5 hover:border-emerald-300 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 mb-3.5">
                <Bell className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Smart Alert Intelligence</h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Color-coded triage across Critical, Warning, Advisory, and Information severities with immediate corrective actions and notification badges.
              </p>
            </div>

            {/* Card 6 */}
            <div className="grid-card p-5 hover:border-emerald-300 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 mb-3.5">
                <CloudSun className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Weather Intelligence</h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Microclimate 5-day forecasts, rainfall probabilities, and evapotranspiration rates directly adjusting irrigation volumes ahead of rainfall events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <footer className="border-t border-gray-200 bg-[#111827] text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sprout className="h-5 w-5 text-emerald-400" />
            <span className="font-extrabold text-lg text-white">AgriVision AI</span>
          </div>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Empowering sustainable precision farming with remote sensing and autonomous machine intelligence.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={onInstantDemo}
              className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-500 transition-colors shadow-2xs"
            >
              Open Live Working Demo
            </button>
            <button
              type="button"
              onClick={onGoToLogin}
              className="rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-xs font-medium text-gray-200 hover:bg-gray-700 transition-colors"
            >
              Sign In to Account
            </button>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-5 text-[11px] text-gray-500">
            &copy; 2025 AgriVision AI • Precision Agriculture & Remote Sensing
          </div>
        </div>
      </footer>
    </div>
  );
};
