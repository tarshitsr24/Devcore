import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShieldCheck, CheckCircle2, XCircle, Users, Building2, Briefcase, FileText, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, orgsRes] = await Promise.allSettled([
        api.get('/admin/stats'),
        api.get('/admin/organizations')
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
        setStats(statsRes.value.data.stats);
      }
      if (orgsRes.status === 'fulfilled' && orgsRes.value.data.success) {
        setOrganizations(orgsRes.value.data.organizations);
      }
    } catch (err) {
      console.error('Fetch admin data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVerify = async (orgId, currentVerificationStatus) => {
    try {
      const res = await api.patch(`/admin/organizations/${orgId}/verify`, {
        isVerified: !currentVerificationStatus
      });
      if (res.data.success) {
        setMessage(res.data.message);
        fetchAdminData();
      }
    } catch (err) {
      console.error('Verify org error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-md bg-white border border-[#E4E4E7] space-y-1.5 shadow-sm">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#F4F4F5] border border-[#E4E4E7] text-[#18181B] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#71717A]" />
          <span>Platform Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#09090B] tracking-tight">DevCore Admin Dashboard</h1>
        <p className="text-xs sm:text-sm text-[#71717A]">Verify organization accounts, monitor platform statistics, and review content.</p>
      </div>

      {message && (
        <div className="p-3.5 rounded bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* STATS CARDS */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-md bg-white border border-[#E4E4E7] shadow-sm">
            <span className="text-xs text-[#71717A] block font-medium">Total Users</span>
            <span className="text-xl font-black text-[#09090B]">{stats.totalUsers}</span>
          </div>

          <div className="p-4 rounded-md bg-white border border-[#E4E4E7] shadow-sm">
            <span className="text-xs text-[#71717A] block font-medium">Applicants</span>
            <span className="text-xl font-black text-[#09090B]">{stats.totalApplicants}</span>
          </div>

          <div className="p-4 rounded-md bg-white border border-[#E4E4E7] shadow-sm">
            <span className="text-xs text-[#71717A] block font-medium">Organizations</span>
            <span className="text-xl font-black text-[#09090B]">{stats.totalOrganizations}</span>
          </div>

          <div className="p-4 rounded-md bg-white border border-[#E4E4E7] shadow-sm">
            <span className="text-xs text-[#71717A] block font-medium">Total Internships</span>
            <span className="text-xl font-black text-[#09090B]">{stats.totalInternships}</span>
          </div>

          <div className="p-4 rounded-md bg-white border border-[#E4E4E7] shadow-sm">
            <span className="text-xs text-[#71717A] block font-medium">Active Posts</span>
            <span className="text-xl font-black text-[#065F46]">{stats.activeInternships}</span>
          </div>

          <div className="p-4 rounded-md bg-white border border-[#E4E4E7] shadow-sm">
            <span className="text-xs text-[#71717A] block font-medium">Applications</span>
            <span className="text-xl font-black text-[#09090B]">{stats.totalApplications}</span>
          </div>
        </div>
      )}

      {/* ORGANIZATION VERIFICATION TABLE */}
      <div className="p-6 rounded-md bg-white border border-[#E4E4E7] space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-[#09090B] flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#71717A]" />
          <span>Organization Verification Queue</span>
        </h2>

        {loading ? (
          <div className="py-8 text-center text-xs text-[#71717A]">Loading organizations...</div>
        ) : organizations.length === 0 ? (
          <p className="text-xs text-[#71717A] italic py-4">No organization accounts registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#09090B]">
              <thead className="bg-[#FAFAFA] text-[#71717A] font-semibold uppercase tracking-wider border-b border-[#E4E4E7]">
                <tr>
                  <th className="p-3">Organization Name</th>
                  <th className="p-3">Official Email</th>
                  <th className="p-3">Industry</th>
                  <th className="p-3">Verification Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7]">
                {organizations.map((org) => (
                  <tr key={org._id} className="hover:bg-[#F4F4F5] transition-colors">
                    <td className="p-3 font-bold text-[#09090B]">{org.orgName}</td>
                    <td className="p-3 text-[#52525B]">{org.officialEmail}</td>
                    <td className="p-3 text-[#52525B]">{org.industry || 'Technology'}</td>
                    <td className="p-3">
                      {org.isVerified ? (
                        <span className="text-[#065F46] font-semibold bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="text-[#713F12] font-semibold bg-[#FEF9C3] px-2 py-0.5 rounded border border-[#FEF08A]">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => toggleVerify(org._id, org.isVerified)}
                        className={`px-2.5 py-1 rounded font-semibold text-xs transition-colors ${
                          org.isVerified
                            ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA] hover:bg-[#FEE2E2]'
                            : 'bg-[#09090B] text-white hover:bg-[#27272A]'
                        }`}
                      >
                        {org.isVerified ? 'Revoke Verification' : 'Verify Account'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
