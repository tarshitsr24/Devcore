import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { Briefcase, Building2, Calendar, FileText, ExternalLink, Eye } from 'lucide-react';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/applications/my-applications');
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error('Fetch my applications error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER */}
      <div className="p-6 sm:p-8 rounded-md bg-white border border-[#E4E4E7] space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#F4F4F5] border border-[#E4E4E7] text-[#09090B] text-xs font-semibold">
          <Briefcase className="w-3.5 h-3.5 text-[#71717A]" />
          <span>Application Tracker</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#09090B]">My Internship Applications</h1>
        <p className="text-xs sm:text-sm text-[#71717A]">Track submitted applications and real-time status updates from organizations.</p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-[#71717A]">Loading your applications...</div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-md border border-[#E4E4E7] space-y-3">
          <p className="text-[#09090B] font-semibold text-base">You haven't submitted any internship applications yet.</p>
          <p className="text-xs text-[#71717A]">Explore open positions on DevCore and apply with one click!</p>
          <Link to="/find-internships" className="inline-block px-5 py-2.5 rounded-md bg-[#09090B] text-white font-semibold text-xs shadow-sm">
            Find Internships Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="p-6 rounded-md bg-white border border-[#E4E4E7] hover:border-[#D4D4D8] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-[#09090B]">{app.internship?.title || 'Internship Position'}</h3>
                  {app.compatibilityScore > 0 && (
                    <span className="text-[11px] font-semibold text-[#09090B] bg-[#F4F4F5] px-2 py-0.5 rounded border border-[#E4E4E7]">
                      {app.compatibilityScore}% Match
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#71717A] flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-[#71717A]" />
                  <span>{app.internship?.orgName}</span>
                  <span>•</span>
                  <Calendar className="w-3.5 h-3.5 text-[#71717A]" />
                  <span>Applied on {new Date(app.appliedDate).toLocaleDateString()}</span>
                </p>

                <p className="text-[11px] text-[#A1A1AA]">
                  Last status update: {new Date(app.updatedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={app.status} />

                <button
                  onClick={() => openDetailModal(app)}
                  className="px-3.5 py-1.5 rounded-md bg-white hover:bg-[#F4F4F5] text-[#09090B] border border-[#E4E4E7] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5 text-[#71717A]" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* APPLICATION DETAILS MODAL */}
      {selectedApp && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Application Details — ${selectedApp.internship?.title}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#09090B] text-sm">{selectedApp.internship?.orgName}</span>
                <StatusBadge status={selectedApp.status} />
              </div>
              <p className="text-[#71717A]">Applied Date: {new Date(selectedApp.appliedDate).toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-md bg-white border border-[#E4E4E7]">
              <div>
                <span className="text-[#71717A] block font-medium">Applicant Name</span>
                <span className="font-semibold text-[#09090B]">{selectedApp.fullName}</span>
              </div>
              <div>
                <span className="text-[#71717A] block font-medium">Contact Phone</span>
                <span className="font-semibold text-[#09090B]">{selectedApp.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[#71717A] block font-medium">College / Inst.</span>
                <span className="font-semibold text-[#09090B]">{selectedApp.college || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[#71717A] block font-medium">Course / Branch</span>
                <span className="font-semibold text-[#09090B]">{selectedApp.course || 'N/A'}</span>
              </div>
            </div>

            {selectedApp.coverLetter && (
              <div className="space-y-1">
                <span className="font-semibold text-[#09090B] block">Submitted Application Message:</span>
                <p className="p-3 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#52525B] italic">
                  "{selectedApp.coverLetter}"
                </p>
              </div>
            )}

            {selectedApp.resume && (
              <div className="pt-2">
                <a
                  href={selectedApp.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#09090B] hover:underline font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#71717A]" />
                  <span>Preview Submitted Resume Document</span>
                </a>
              </div>
            )}
          </div>
        </Modal>
      )}

    </div>
  );
}
