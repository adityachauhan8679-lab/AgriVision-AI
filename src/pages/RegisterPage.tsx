import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, User, Mail, Phone, Lock, MapPin, Building, ArrowRight, AlertCircle } from 'lucide-react';

interface Props {
  onGoToLogin: () => void;
  onGoToLanding: () => void;
}

export const RegisterPage: React.FC<Props> = ({ onGoToLogin, onGoToLanding }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+1 (555) 234-5678',
    password: '',
    location: 'Salinas Valley, CA',
    farmName: 'Sunrise Organic Acres'
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(formData);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to register account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#f9fafb] py-12 sm:px-6 lg:px-8 px-4 font-sans text-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <button
          type="button"
          onClick={onGoToLanding}
          className="inline-flex items-center gap-2 mb-3 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-2xs group-hover:bg-emerald-500 transition-colors">
            <Sprout className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">AgriVision AI</span>
        </button>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Create Farmer Account</h2>
        <p className="mt-1 text-xs text-gray-500">Initialize your digital twin farm with GIS zone partitioning</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="grid-card p-6 sm:p-8 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full pl-9 pr-3 py-2 rounded-md border border-gray-200 bg-white text-gray-900 text-xs placeholder-gray-400 focus:border-emerald-600 focus:outline-hidden"
                    placeholder="E.g. Elena Rostova"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="block w-full pl-9 pr-3 py-2 rounded-md border border-gray-200 bg-white text-gray-900 text-xs placeholder-gray-400 focus:border-emerald-600 focus:outline-hidden"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full pl-9 pr-3 py-2 rounded-md border border-gray-200 bg-white text-gray-900 text-xs placeholder-gray-400 focus:border-emerald-600 focus:outline-hidden"
                  placeholder="elena@precisionfarm.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-9 pr-3 py-2 rounded-md border border-gray-200 bg-white text-gray-900 text-xs placeholder-gray-400 focus:border-emerald-600 focus:outline-hidden"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Farm Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Building className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.farmName}
                    onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                    className="block w-full pl-9 pr-3 py-2 rounded-md border border-gray-200 bg-white text-gray-900 text-xs placeholder-gray-400 focus:border-emerald-600 focus:outline-hidden"
                    placeholder="E.g. Green Valley Farm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Location / Region</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="block w-full pl-9 pr-3 py-2 rounded-md border border-gray-200 bg-white text-gray-900 text-xs placeholder-gray-400 focus:border-emerald-600 focus:outline-hidden"
                    placeholder="E.g. Salinas, CA"
                  />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 mt-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              Registration automatically creates your initial Farm Digital Twin with 4 geotagged management zones, simulated IoT telemetry, and Sentinel-2 remote sensing feeds.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium py-2.5 shadow-2xs transition-colors flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onGoToLogin}
              className="font-semibold text-emerald-700 hover:text-emerald-600"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
