import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      const userRole = res.user.role;

      if (userRole === 'applicant') {
        navigate('/applicant-dashboard');
      } else if (userRole === 'organization') {
        navigate('/org-dashboard');
      } else if (userRole === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Preset quick login for demo testing
  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[80vh] max-w-7xl lg:max-w-none mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(360px,448px)_minmax(0,1fr)] items-stretch overflow-hidden rounded-md border border-[#E4E4E7] px-4 sm:px-6 lg:px-0 py-12">
      <div
        className="hidden lg:block min-h-[620px] bg-cover bg-center grayscale opacity-80"
        style={{ backgroundImage: "linear-gradient(rgba(244, 244, 246, 0.4), rgba(244, 244, 246, 0.8)), url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80')" }}
        aria-label="Technology server room"
      />

      <div className="w-full space-y-8 bg-white p-8 rounded-none border-y-0 border-x border-[#E4E4E7] shadow-sm relative overflow-hidden">
        
        {/* DevCore Branding Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-[#09090B] tracking-tight">
            Log in to <span className="text-[#09090B]">Dev<span className="text-[#71717A]">Core</span></span>
          </h2>
          <p className="text-xs text-[#71717A]">
            One single login portal for Applicants & Organizations
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#09090B] uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded bg-white border border-[#E4E4E7] text-[#09090B] text-xs focus:outline-none focus:border-[#09090B] transition-all placeholder:text-[#A1A1AA]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#09090B] uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded bg-white border border-[#E4E4E7] text-[#09090B] text-xs focus:outline-none focus:border-[#09090B] transition-all placeholder:text-[#A1A1AA]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded bg-[#09090B] hover:bg-[#27272A] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Login Quick Fill Shortcuts */}
        <div className="pt-4 border-t border-[#E4E4E7] space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A] text-center">
            Hackathon Presentation Quick Demo Fill:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('applicant@devcore.com')}
              className="px-2.5 py-1.5 rounded bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#09090B] border border-[#E4E4E7] text-left transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#09090B]" />
              <span className="truncate text-xs font-medium">Applicant Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('techcorp@devcore.com')}
              className="px-2.5 py-1.5 rounded bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#09090B] border border-[#E4E4E7] text-left transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#09090B]" />
              <span className="truncate text-xs font-medium">Organization Demo</span>
            </button>
          </div>
        </div>

        {/* Signup Redirect Link */}
        <p className="text-center text-xs text-[#71717A]">
          Don't have a DevCore account yet?{' '}
          <Link to="/signup" className="text-[#09090B] font-semibold hover:underline">
            Sign up now
          </Link>
        </p>

      </div>

      <div
        className="hidden lg:block min-h-[620px] bg-cover bg-center grayscale opacity-80"
        style={{ backgroundImage: "linear-gradient(rgba(244, 244, 246, 0.4), rgba(244, 244, 246, 0.8)), url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80')" }}
        aria-label="Technology circuit board"
      />
    </div>
  );
}
