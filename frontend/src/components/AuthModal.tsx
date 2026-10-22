'use client';

import React, { useState } from 'react';
import { loginUser } from '../lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginUser(email, password);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (asAdmin: boolean) => {
    setError(null);
    setLoading(true);
    try {
      if (asAdmin) {
        await loginUser('admin@pahadfootprint.gov.in', 'PahadAdmin2026!');
      } else {
        await loginUser('tourist@pahadfootprint.org', 'PahadTourist2026!');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-card border border-[#D8E8DF] p-6 max-w-md w-full shadow-elevated relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#4B5563] hover:text-[#111827] text-[18px] font-bold"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#1B4332] text-white flex items-center justify-center">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L4 15h4v5h8v-5h4L12 2z" />
            </svg>
          </div>
          <h2 className="text-[18px] font-bold text-[#111827]">Sign In to Pahad Footprint</h2>
        </div>
        <p className="text-[12.5px] text-[#4B5563] mb-4">
          Authenticate to log persistent trip telemetry or access the Regional Auditor portal.
        </p>

        {error && (
          <div className="mb-4 p-2.5 bg-[#FFDAD6] border border-[#BA1A1A]/30 rounded-btn text-[12px] text-[#BA1A1A]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 mb-4">
          <div>
            <label className="block text-[12.5px] font-semibold text-[#111827] mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. auditor@pahadfootprint.gov.in"
              className="w-full h-10 px-3 bg-[#F8FAF9] border border-[#D8E8DF] rounded-input text-[13px] text-[#111827]"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-[#111827] mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-3 bg-[#F8FAF9] border border-[#D8E8DF] rounded-input text-[13px] text-[#111827]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#1B4332] hover:bg-[#143225] text-white font-semibold text-[13px] rounded-btn shadow transition-colors"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="border-t border-[#D8E8DF] pt-3 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#4B5563] mb-2">
            One-Click Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin(true)}
              className="py-1.5 px-2 bg-[#EDF6F0] hover:bg-[#D8E8DF] text-[#1B4332] border border-[#D8E8DF] rounded-btn text-[11.5px] font-semibold"
            >
              🛡️ Regional Auditor
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin(false)}
              className="py-1.5 px-2 bg-[#F8FAF9] hover:bg-[#D8E8DF] text-[#4B5563] border border-[#D8E8DF] rounded-btn text-[11.5px] font-semibold"
            >
              🌲 Tourist Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
