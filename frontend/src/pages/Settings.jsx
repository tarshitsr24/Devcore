import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Settings as SettingsIcon, User, LogOut, Sun, Moon } from 'lucide-react';

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="p-6 sm:p-8 rounded-md bg-white border border-[#E4E4E7] space-y-1.5 shadow-sm">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#F4F4F5] border border-[#E4E4E7] text-[#18181B] text-xs font-semibold">
          <SettingsIcon className="w-3.5 h-3.5 text-[#71717A]" />
          <span>Account Controls</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#09090B] tracking-tight">Account Settings</h1>
        <p className="text-xs sm:text-sm text-[#71717A]">View your active user credentials and session configuration.</p>
      </div>

      <div className="p-6 rounded-md bg-white border border-[#E4E4E7] space-y-6 shadow-sm">
        <h2 className="text-base font-bold text-[#09090B] flex items-center gap-2">
          <User className="w-4 h-4 text-[#71717A]" />
          <span>Account Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded bg-[#FAFAFA] border border-[#E4E4E7]">
            <span className="text-[#71717A] block text-[11px]">Full Name</span>
            <span className="font-bold text-[#09090B] text-xs">{user?.fullName}</span>
          </div>

          <div className="p-3.5 rounded bg-[#FAFAFA] border border-[#E4E4E7]">
            <span className="text-[#71717A] block text-[11px]">Email Address</span>
            <span className="font-bold text-[#09090B] text-xs">{user?.email}</span>
          </div>

          <div className="p-3.5 rounded bg-[#FAFAFA] border border-[#E4E4E7]">
            <span className="text-[#71717A] block text-[11px]">Account Role</span>
            <span className="font-bold text-[#09090B] text-xs capitalize">{user?.role}</span>
          </div>

          <div className="p-3.5 rounded bg-[#FAFAFA] border border-[#E4E4E7]">
            <span className="text-[#71717A] block text-[11px]">Session Status</span>
            <span className="font-bold text-[#065F46] text-xs">JWT Authenticated</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 p-4 rounded bg-[#FAFAFA] border border-[#E4E4E7]">
          <div>
            <span className="font-bold text-[#09090B] text-xs block">Appearance</span>
            <span className="text-xs text-[#71717A]">Choose how DevCore looks on this device.</span>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white border border-[#E4E4E7] text-[#09090B] text-xs font-semibold hover:bg-[#F4F4F5] transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        <div className="pt-4 border-t border-[#E4E4E7] flex justify-end">
          <button
            onClick={logout}
            className="px-4 py-2 rounded bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA] text-xs font-bold transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of DevCore</span>
          </button>
        </div>
      </div>
    </div>
  );
}
