import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAssetUrl } from '../services/api';
import {
  LayoutDashboard,
  Search,
  Sparkles,
  Briefcase,
  BookOpen,
  User,
  PlusCircle,
  Building2,
  FileText,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';

export default function Navbar() {
  const { user, profile, isAuthenticated, logout, isApplicant, isOrganization, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileImageFailed, setProfileImageFailed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const initials = (name = '') => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0]?.slice(0, 2) || 'U').toUpperCase();
  };

  const profileImage = getAssetUrl(profile?.avatar || profile?.logo);
  const showProfileImage = profileImage && !profileImageFailed;

  useEffect(() => {
    setProfileImageFailed(false);
  }, [profileImage]);

  const navLinkClass = (path) =>
    `flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium transition-colors rounded ${
      isActive(path)
        ? 'text-[#000000] bg-[#E4E4E7]/70 font-semibold'
        : 'text-[#71717A] hover:text-[#000000] hover:bg-[#E4E4E7]/40'
    }`;

  return (
    <nav className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-1">
              {/* Common Dashboard link */}
              <Link
                to={isApplicant ? '/applicant-dashboard' : isOrganization ? '/org-dashboard' : '/admin-dashboard'}
                className={navLinkClass(isApplicant ? '/applicant-dashboard' : isOrganization ? '/org-dashboard' : '/admin-dashboard')}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              {/* Applicant Navigation Items */}
              {isApplicant && (
                <>
                  <Link to="/find-internships" className={navLinkClass('/find-internships')}>
                    <Search className="w-4 h-4" />
                    <span>Find Internships</span>
                  </Link>
                  <Link to="/recommended" className={navLinkClass('/recommended')}>
                    <Sparkles className="w-4 h-4 text-[#71717A]" />
                    <span>Recommended</span>
                  </Link>
                  <Link to="/my-applications" className={navLinkClass('/my-applications')}>
                    <Briefcase className="w-4 h-4" />
                    <span>My Applications</span>
                  </Link>
                  <Link to="/my-journey" className={navLinkClass('/my-journey')}>
                    <GraduationCap className="w-4 h-4" />
                    <span>My Journey</span>
                  </Link>
                  <Link to="/get-certified" className={navLinkClass('/get-certified')}>
                    <BookOpen className="w-4 h-4 text-[#71717A]" />
                    <span>Get Certified</span>
                  </Link>
                </>
              )}

              {/* Organization Navigation Items */}
              {isOrganization && (
                <>
                  <Link to="/post-internship" className={navLinkClass('/post-internship')}>
                    <PlusCircle className="w-4 h-4 text-[#71717A]" />
                    <span>Post Internship</span>
                  </Link>
                  <Link to="/my-internships" className={navLinkClass('/my-internships')}>
                    <Briefcase className="w-4 h-4" />
                    <span>My Internship Posts</span>
                  </Link>
                  <Link to="/applications-received" className={navLinkClass('/applications-received')}>
                    <FileText className="w-4 h-4 text-[#71717A]" />
                    <span>Applications Received</span>
                  </Link>
                  <Link to="/org-profile" className={navLinkClass('/org-profile')}>
                    <Building2 className="w-4 h-4" />
                    <span>Organization Profile</span>
                  </Link>
                </>
              )}

              {/* Admin Navigation Items */}
              {isAdmin && (
                <>
                  <Link to="/admin-dashboard" className={navLinkClass('/admin-dashboard')}>
                    <ShieldCheck className="w-4 h-4 text-[#71717A]" />
                    <span>Admin Approvals</span>
                  </Link>
                </>
              )}
            </div>
          )}

          {/* User Profile & Action Menu */}
          <div className="hidden lg:flex items-center gap-3">
            {location.pathname !== '/' && (
              <Link
                to="/"
                className="text-xs font-medium text-[#71717A] hover:text-[#000000] transition-colors"
              >
                Home
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-3 border-l border-[#E4E4E7]">
                {/* Profile Completion Indicator Badge for Applicants */}
                {isApplicant && user?.completionPercentage !== undefined && (
                  <div className="flex items-center gap-1.5 bg-[#F4F4F5] px-2.5 py-1 rounded border border-[#E4E4E7]" title="Profile Completion Percentage">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#09090B]"></div>
                    <span className="text-[11px] font-medium text-[#52525B]">
                      Profile: <span className="font-semibold text-[#09090B]">{user.completionPercentage}%</span>
                    </span>
                  </div>
                )}

                <Link
                  to={isApplicant ? '/profile' : isOrganization ? '/org-profile' : '/settings'}
                  className="flex items-center p-1 rounded hover:bg-[#F4F4F5] text-[#09090B] transition-colors"
                  title="Open profile"
                >
                  {showProfileImage ? (
                    <img
                      src={profileImage}
                      alt="User profile"
                      onError={() => setProfileImageFailed(true)}
                      className="w-8 h-8 rounded-full object-cover border border-[#E4E4E7]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#09090B] flex items-center justify-center font-semibold text-white text-xs">
                      {initials(user?.fullName)}
                    </div>
                  )}
                </Link>

                <Link to="/settings" className="p-1.5 text-[#71717A] hover:text-[#000000] hover:bg-[#F4F4F5] rounded transition-colors" title="Settings">
                  <Settings className="w-4 h-4" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F4F4F5] text-[#52525B] hover:text-[#000000] hover:bg-[#E4E4E7] border border-[#E4E4E7] text-xs font-medium transition-all"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-medium text-[#52525B] hover:text-[#000000] px-3 py-1.5 rounded hover:bg-[#F4F4F5] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="text-xs font-semibold text-white bg-[#09090B] hover:bg-[#27272A] px-3.5 py-1.5 rounded transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/95 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {location.pathname !== '/' && (
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass('/')}
            >
              <span>Home</span>
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <div className="p-3 mb-2 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-slate-100">{user.fullName}</p>
                  <p className="text-xs text-slate-400">{user.email} • ({user.role})</p>
                </div>
                {isApplicant && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
                    {user.completionPercentage}% Complete
                  </span>
                )}
              </div>

              <Link
                to={isApplicant ? '/applicant-dashboard' : isOrganization ? '/org-dashboard' : '/admin-dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass(isApplicant ? '/applicant-dashboard' : isOrganization ? '/org-dashboard' : '/admin-dashboard')}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              {isApplicant && (
                <>
                  <Link to="/find-internships" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/find-internships')}>
                    <Search className="w-4 h-4" />
                    <span>Find Internships</span>
                  </Link>
                  <Link to="/recommended" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/recommended')}>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Recommended</span>
                  </Link>
                  <Link to="/my-applications" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/my-applications')}>
                    <Briefcase className="w-4 h-4" />
                    <span>My Applications</span>
                  </Link>
                  <Link to="/my-journey" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/my-journey')}>
                    <GraduationCap className="w-4 h-4" />
                    <span>My Journey</span>
                  </Link>
                  <Link to="/get-certified" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/get-certified')}>
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>Get Certified</span>
                  </Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/profile')}>
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </Link>
                </>
              )}

              {isOrganization && (
                <>
                  <Link to="/post-internship" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/post-internship')}>
                    <PlusCircle className="w-4 h-4 text-emerald-400" />
                    <span>Post Internship</span>
                  </Link>
                  <Link to="/my-internships" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/my-internships')}>
                    <Briefcase className="w-4 h-4" />
                    <span>My Internship Posts</span>
                  </Link>
                  <Link to="/applications-received" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/applications-received')}>
                    <FileText className="w-4 h-4 text-brand-400" />
                    <span>Applications Received</span>
                  </Link>
                  <Link to="/org-profile" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/org-profile')}>
                    <Building2 className="w-4 h-4" />
                    <span>Organization Profile</span>
                  </Link>
                </>
              )}

              <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/settings')}>
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-sm font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="pt-2 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 text-slate-300 hover:text-brand-300 font-semibold transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 text-slate-300 hover:text-brand-300 font-semibold transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
