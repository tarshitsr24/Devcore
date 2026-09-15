import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { getAssetUrl } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { FileText, CheckCircle2, XCircle, Award, ExternalLink, Filter, User, Building2, Eye } from 'lucide-react';

export default function ApplicationsReceived() {
  const [searchParams] = useSearchParams();
  const filterInternshipId = searchParams.get('internshipId');

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status Filter state
  const [statusFilter, setStatusFilter] = useState('All');

  // Detail Modal state
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [filterInternshipId, statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterInternshipId) params.internshipId = filterInternshipId;
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await api.get('/applications/received', { params });
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error('Fetch received applications error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const res = await api.patch(`/applications/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        fetchApplications();
        if (selectedApp && selectedApp._id === appId) {
          setSelectedApp({ ...selectedApp, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const openModal = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const applicantInitials = (name = '') => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0]?.slice(0, 2) || 'U').toUpperCase();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER */}
      <div className="p-6 sm:p-8 rounded-md bg-white border border-[#E4E4E7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#F4F4F5] border border-[#E4E4E7] text-[#09090B] text-xs font-semibold">
            <FileText className="w-3.5 h-3.5 text-[#71717A]" />
            <span>Applicant Evaluation Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#09090B]">Applications Received</h1>
          <p className="text-xs sm:text-sm text-[#71717A]">Review candidate credentials, AI compatibility scores, and update application statuses.</p>
        </div>

        {/* Status Filter Selector */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-xs text-[#09090B] focus:border-[#09090B] focus:outline-none"
          >
            <option value="All">All Application Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-[#71717A]">Loading received applications...</div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-md border border-[#E4E4E7] space-y-3">
          <p className="text-[#71717A] font-medium text-sm">No candidate applications found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="p-6 rounded-md bg-white border border-[#E4E4E7] hover:border-[#D4D4D8] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Candidate Summary */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  {app.avatar ? (
                    <div className="relative w-10 h-10 shrink-0">
                      <img
                        src={getAssetUrl(app.avatar)}
                        alt={app.fullName}
                        className="w-10 h-10 rounded-full object-cover border border-[#E4E4E7]"
                        onError={(event) => {
                          event.currentTarget.style.display = 'none';
                          event.currentTarget.nextElementSibling.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden absolute inset-0 rounded-full bg-[#09090B] items-center justify-center font-bold text-white text-xs">
                        {applicantInitials(app.fullName)}
                      </div>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#09090B] flex items-center justify-center font-bold text-white text-xs">
                      {applicantInitials(app.fullName)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-[#09090B]">{app.fullName}</h3>
                      <span className="text-xs font-semibold text-[#09090B] bg-[#F4F4F5] px-2 py-0.5 rounded border border-[#E4E4E7]">
                        {app.compatibilityScore || 85}% Match
                      </span>
                    </div>
                    <p className="text-xs text-[#71717A]">
                      Applied for: <span className="text-[#09090B] font-medium">{app.internship?.title}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#71717A] pt-1">
                  <span>{app.college || 'College N/A'} ({app.course || 'Branch N/A'})</span>
                  <span>•</span>
                  <span>Applied {new Date(app.appliedDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Status Badge & Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={app.status} />

                <button
                  onClick={() => openModal(app)}
                  className="px-3 py-1.5 rounded-md bg-white hover:bg-[#F4F4F5] text-[#09090B] border border-[#E4E4E7] text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5 text-[#71717A]" />
                  <span>Review Profile</span>
                </button>

                {/* Quick Status Action Buttons */}
                <button
                  onClick={() => handleUpdateStatus(app._id, 'Shortlisted')}
                  className="px-3 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold"
                  title="Shortlist Applicant"
                >
                  Shortlist
                </button>

                <button
                  onClick={() => handleUpdateStatus(app._id, 'Selected')}
                  className="px-3 py-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold"
                  title="Select Applicant"
                >
                  Select
                </button>

                <button
                  onClick={() => handleUpdateStatus(app._id, 'Rejected')}
                  className="px-3 py-1.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold"
                  title="Reject Applicant"
                >
                  Reject
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* APPLICANT FULL REVIEW MODAL */}
      {selectedApp && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Applicant Profile — ${selectedApp.fullName}`}
        >
          <div className="space-y-5 text-xs">
            
            <div className="p-4 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#09090B] text-sm block">{selectedApp.fullName}</span>
                <span className="text-[#71717A]">{selectedApp.email} • {selectedApp.phone || 'Phone N/A'}</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-[#09090B] block">{selectedApp.compatibilityScore || 85}%</span>
                <span className="text-[10px] uppercase font-semibold text-[#71717A]">AI Compatibility</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-md bg-white border border-[#E4E4E7]">
              <div>
                <span className="text-[#71717A] block font-medium">College / University</span>
                <span className="font-semibold text-[#09090B]">{selectedApp.college || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[#71717A] block font-medium">Course / Branch</span>
                <span className="font-semibold text-[#09090B]">{selectedApp.course || 'N/A'}</span>
              </div>
            </div>

            {selectedApp.coverLetter && (
              <div className="space-y-1">
                <span className="font-semibold text-[#09090B] block">Application Message / Cover Letter:</span>
                <p className="p-3 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#52525B] italic">
                  "{selectedApp.coverLetter}"
                </p>
              </div>
            )}

            {/* Links & Resume */}
            <div className="space-y-2 pt-2 border-t border-[#E4E4E7]">
              <span className="font-semibold text-[#09090B] block">Candidate Links & Documents:</span>
              <div className="flex flex-wrap gap-3">
                {selectedApp.resume && (
                  <a href={selectedApp.resume} target="_blank" rel="noreferrer" className="text-[#09090B] hover:underline flex items-center gap-1 font-semibold">
                    <ExternalLink className="w-3.5 h-3.5 text-[#71717A]" />
                    <span>Download / Preview Resume</span>
                  </a>
                )}
                {selectedApp.github && (
                  <a href={selectedApp.github} target="_blank" rel="noreferrer" className="text-[#71717A] hover:text-[#09090B] hover:underline flex items-center gap-1">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>GitHub Profile</span>
                  </a>
                )}
                {selectedApp.linkedin && (
                  <a href={selectedApp.linkedin} target="_blank" rel="noreferrer" className="text-[#71717A] hover:text-[#09090B] hover:underline flex items-center gap-1">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
              </div>
            </div>

            {/* Decision buttons inside modal */}
            <div className="flex justify-end gap-2 pt-4 border-t border-[#E4E4E7]">
              <button
                onClick={() => handleUpdateStatus(selectedApp._id, 'Shortlisted')}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Shortlist
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedApp._id, 'Selected')}
                className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                Select
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedApp._id, 'Rejected')}
                className="px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-semibold"
              >
                Reject
              </button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
}
