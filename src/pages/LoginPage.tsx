import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, Mail, ArrowRight, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  onGoToRegister: () => void;
  onGoToLanding: () => void;
}

export const LoginPage: React.FC<Props> = ({ onGoToRegister, onGoToLanding }) => {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('farmer@agrivision.ai');
  const [password, setPassword] = useState('agrivision2025');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid email or password. You can use the Demo Farmer credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin();
    } catch (err: any) {
      setError('Failed to initialize demo login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#f9fafb] py-12 sm:px-6 lg:px-8 px-4 font-sans text-gray-900">
      {/* Brand Header */}
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
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Farmer Portal Sign In</h2>
        <p className="mt-1 text-xs text-gray-500">Access your precision GIS zones, IoT telemetry & AI prescriptions</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="grid-card p-6 sm:p-8 space-y-5">
          {/* 1-Click Instant Demo Access Box */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                Hackathon Instant Demo
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded font-mono font-medium">Ready to test</span>
            </div>
            <p className="text-[11px] text-gray-600 mb-2.5 leading-relaxed">
              Login immediately with pre-loaded Salinas Valley farm, GIS zones, IoT sensors & satellite passes.
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium py-2 shadow-2xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>One-Click Demo Sign In</span>
            </button>
          </div>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-400 font-medium">Or enter credentials</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 rounded-md border border-gray-200 bg-white text-gray-900 text-xs placeholder-gray-400 focus:border-emerald-600 focus:outline-hidden"
                  placeholder="farmer@agrivision.ai"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-gray-700">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-emerald-700 hover:text-emerald-600 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 rounded-md border border-gray-200 bg-white text-gray-900 text-xs placeholder-gray-400 focus:border-emerald-600 focus:outline-hidden"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-md bg-[#111827] hover:bg-gray-800 text-white text-xs font-medium py-2.5 shadow-2xs transition-colors flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In as Farmer'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={onGoToRegister}
              className="font-semibold text-emerald-700 hover:text-emerald-600"
            >
              Sign up here
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-xl bg-white border border-gray-200 p-6 shadow-xl text-gray-900">
            <h3 className="font-bold text-sm text-gray-900">Reset Farmer Password</h3>
            <p className="text-xs text-gray-500 mt-1">
              Enter your email to receive a secure recovery code. For demo purposes, the password is: <code className="bg-gray-100 text-emerald-700 px-1 py-0.5 rounded font-mono font-medium">agrivision2025</code>
            </p>

            {forgotSuccess ? (
              <div className="mt-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Password reset instructions dispatched to your mailbox.</span>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <input
                  type="email"
                  defaultValue={email}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:border-emerald-600 focus:outline-hidden"
                  placeholder="name@farm.com"
                />
                <button
                  type="button"
                  onClick={() => setForgotSuccess(true)}
                  className="w-full rounded-md bg-emerald-600 hover:bg-emerald-500 py-2 text-xs font-medium text-white shadow-2xs transition-colors"
                >
                  Send Reset Link
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setShowForgotModal(false);
                setForgotSuccess(false);
              }}
              className="mt-3 w-full rounded-md border border-gray-200 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
