import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  Building2,
  PlusCircle,
  Briefcase,
  FileText,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

export default function OrganizationDashboard() {
  const { user, profile } = useAuth();

  const [posts, setPosts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrgDashboard();
  }, []);

  const fetchOrgDashboard = async () => {
    setLoading(true);
    try {
      const [postsRes, appsRes] = await Promise.allSettled([
        api.get('/internships/organization/my-posts'),
        api.get('/applications/received')
      ]);

      if (postsRes.status === 'fulfilled' && postsRes.value.data.success) {
        setPosts(postsRes.value.data.internships);
      }
      if (appsRes.status === 'fulfilled' && appsRes.value.data.success) {
        setApplications(appsRes.value.data.applications);
      }
    } catch (err) {
      console.error('Fetch org dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPosts = posts.length;
  const activePosts = posts.filter(p => p.status === 'published').length;
  const closedPosts = posts.filter(p => p.status === 'closed').length;
  const totalAppsReceived = applications.length;
  const shortlistedApps = applications.filter(a => a.status === 'Shortlisted' || a.status === 'Selected').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* WELCOME BANNER */}
      <div className="p-6 sm:p-8 rounded-md bg-white border border-[#E4E4E7] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#F4F4F5] border border-[#E4E4E7] text-[#09090B] text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-[#71717A]" />
            <span>Organization Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#09090B]">
            {user?.fullName || profile?.orgName || 'Organization Dashboard'}
          </h1>
          <p className="text-xs sm:text-sm text-[#71717A]">
            Post opportunities, evaluate AI candidate scores, and hire top engineering talent.
          </p>
        </div>

        <Link
          to="/post-internship"
          className="px-5 py-2.5 rounded-md bg-[#09090B] hover:bg-black text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-all"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          <span>Post New Internship</span>
        </Link>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-md bg-white border border-[#E4E4E7] space-y-1">
          <span className="text-xs text-[#71717A] font-semibold block">Total Postings</span>
          <span className="text-2xl font-bold text-[#09090B]">{totalPosts}</span>
        </div>

        <div className="p-5 rounded-md bg-white border border-[#E4E4E7] space-y-1">
          <span className="text-xs text-[#71717A] font-semibold block">Active Internships</span>
          <span className="text-2xl font-bold text-emerald-700">{activePosts}</span>
        </div>

        <div className="p-5 rounded-md bg-white border border-[#E4E4E7] space-y-1">
          <span className="text-xs text-[#71717A] font-semibold block">Closed Internships</span>
          <span className="text-2xl font-bold text-[#71717A]">{closedPosts}</span>
        </div>

        <div className="p-5 rounded-md bg-white border border-[#E4E4E7] space-y-1">
          <span className="text-xs text-[#71717A] font-semibold block">Applications Received</span>
          <span className="text-2xl font-bold text-[#09090B]">{totalAppsReceived}</span>
        </div>

        <div className="col-span-2 lg:col-span-1 p-5 rounded-md bg-white border border-[#E4E4E7] space-y-1">
          <span className="text-xs text-[#71717A] font-semibold block">Shortlisted Applicants</span>
          <span className="text-2xl font-bold text-[#09090B]">{shortlistedApps}</span>
        </div>
      </div>

      {/* MAIN DASHBOARD CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT 2 COLS: RECENT APPLICATIONS RECEIVED */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-md bg-white border border-[#E4E4E7] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#71717A]" />
                <h3 className="text-lg font-bold text-[#09090B]">Recent Applications Received</h3>
              </div>
              <Link to="/applications-received" className="text-xs font-semibold text-[#09090B] hover:underline flex items-center gap-1">
                <span>Manage All Applications</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#71717A]" />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-[#71717A]">Loading received applications...</div>
            ) : applications.length === 0 ? (
              <p className="text-xs text-[#71717A] italic py-6 text-center">No applications received yet for your postings.</p>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 5).map((app) => (
                  <div key={app._id} className="p-4 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[#09090B] text-sm">{app.fullName}</h4>
                        <span className="text-xs font-semibold text-[#09090B] bg-[#F4F4F5] px-2 py-0.5 rounded border border-[#E4E4E7]">
                          {app.compatibilityScore || 80}% Match
                        </span>
                      </div>
                      <p className="text-xs text-[#71717A]">{app.internship?.title} • {app.college || 'Applicant'}</p>
                    </div>

                    <StatusBadge status={app.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COL: MY INTERNSHIP POSTS SNAPSHOT */}
        <div className="space-y-6">
          <div className="p-6 rounded-md bg-white border border-[#E4E4E7] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#71717A]" />
                <h3 className="text-base font-bold text-[#09090B]">My Internship Posts</h3>
              </div>
              <Link to="/my-internships" className="text-xs font-semibold text-[#09090B] hover:underline">View All</Link>
            </div>

            <div className="space-y-3">
              {posts.slice(0, 4).map((p) => (
                <div key={p._id} className="p-3.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-[#09090B] text-xs truncate max-w-[180px]">{p.title}</h4>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-[11px] text-[#71717A]">{p.location} • {p.stipend}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
