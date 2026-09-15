import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import {
  GraduationCap,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Award,
  BookOpen,
  Briefcase,
  Code,
  Trophy,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function MyJourney() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [type, setType] = useState('Education');
  const [title, setTitle] = useState('');
  const [organizationOrInstitute, setOrganizationOrInstitute] = useState('');
  const [description, setDescription] = useState('');
  const [dateOrPeriod, setDateOrPeriod] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJourney();
  }, []);

  const fetchJourney = async () => {
    setLoading(true);
    try {
      const res = await api.get('/journey');
      if (res.data.success) {
        setRecords(res.data.records);
      }
    } catch (err) {
      console.error('Fetch journey error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingRecord(null);
    setType('Project');
    setTitle('');
    setOrganizationOrInstitute('');
    setDescription('');
    setDateOrPeriod('');
    setEvidenceUrl('');
    setIsVerified(false);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (rec) => {
    setEditingRecord(rec);
    setType(rec.type);
    setTitle(rec.title);
    setOrganizationOrInstitute(rec.organizationOrInstitute || '');
    setDescription(rec.description || '');
    setDateOrPeriod(rec.dateOrPeriod || '');
    setEvidenceUrl(rec.evidenceUrl || '');
    setIsVerified(rec.isVerified || false);
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    try {
      const payload = {
        type,
        title: title.trim(),
        organizationOrInstitute: organizationOrInstitute.trim(),
        description: description.trim(),
        dateOrPeriod: dateOrPeriod.trim(),
        evidenceUrl: evidenceUrl.trim(),
        isVerified
      };

      if (editingRecord) {
        const res = await api.put(`/journey/${editingRecord._id}`, payload);
        if (res.data.success) {
          setMessage('Record updated!');
          setIsModalOpen(false);
          fetchJourney();
        }
      } else {
        const res = await api.post('/journey', payload);
        if (res.data.success) {
          setMessage('Record added!');
          setIsModalOpen(false);
          fetchJourney();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving journey record.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record from your journey?')) return;
    try {
      const res = await api.delete(`/journey/${id}`);
      if (res.data.success) {
        setMessage('Record deleted!');
        fetchJourney();
      }
    } catch (err) {
      console.error('Delete journey error:', err);
    }
  };

  const getTypeIcon = (recType) => {
    switch (recType) {
      case 'Education': return <GraduationCap className="w-5 h-5 text-indigo-400" />;
      case 'Project': return <Code className="w-5 h-5 text-brand-400" />;
      case 'Certification': return <Award className="w-5 h-5 text-emerald-400" />;
      case 'Experience': return <Briefcase className="w-5 h-5 text-amber-400" />;
      case 'Workshop': return <BookOpen className="w-5 h-5 text-cyan-400" />;
      case 'Competition': return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'Achievement': return <ShieldCheck className="w-5 h-5 text-rose-400" />;
      default: return <GraduationCap className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER */}
      <div className="p-6 sm:p-8 rounded-md bg-white border border-[#E4E4E7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#F4F4F5] border border-[#E4E4E7] text-[#09090B] text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5 text-[#71717A]" />
            <span>Academic & Professional History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#09090B]">My Career Journey Timeline</h1>
          <p className="text-xs sm:text-sm text-[#71717A]">Showcase your education, projects, certifications, work experiences, workshops, and achievements.</p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-md bg-[#09090B] hover:bg-black text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add Journey Record</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* TIMELINE LIST */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#71717A]">Loading career journey timeline...</div>
      ) : records.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-md border border-[#E4E4E7] space-y-3">
          <p className="text-[#09090B] font-semibold">Your career journey timeline is empty.</p>
          <p className="text-xs text-[#71717A]">Add your projects, hackathons, and certifications to highlight your credentials to organizations!</p>
          <button onClick={openAddModal} className="px-4 py-2 rounded-md bg-[#09090B] text-white font-semibold text-xs shadow-sm">
            + Add First Journey Entry
          </button>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#E4E4E7] space-y-8">
          {records.map((rec) => (
            <div key={rec._id} className="relative group">
              
              {/* Timeline Icon Node */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-1 w-9 h-9 rounded-md bg-white border border-[#E4E4E7] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                {getTypeIcon(rec.type)}
              </div>

              {/* Record Content Box */}
              <div className="p-6 rounded-md bg-white border border-[#E4E4E7] hover:border-[#D4D4D8] transition-all space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-[#F4F4F5] text-[#09090B] border border-[#E4E4E7]">
                        {rec.type}
                      </span>
                      {rec.isVerified ? (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#71717A] bg-[#FAFAFA] px-2 py-0.5 rounded border border-[#E4E4E7]">
                          Self-Added
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-[#09090B] mt-1">{rec.title}</h3>
                    {rec.organizationOrInstitute && (
                      <p className="text-xs text-[#52525B] font-medium">{rec.organizationOrInstitute}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(rec)}
                      className="p-1.5 text-[#71717A] hover:text-[#09090B] rounded hover:bg-[#F4F4F5]"
                      title="Edit Record"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(rec._id)}
                      className="p-1.5 text-[#71717A] hover:text-rose-600 rounded hover:bg-rose-50"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {rec.dateOrPeriod && (
                  <p className="text-xs text-[#71717A] italic">{rec.dateOrPeriod}</p>
                )}

                {rec.description && (
                  <p className="text-xs text-[#52525B] leading-relaxed">{rec.description}</p>
                )}

                {rec.evidenceUrl && (
                  <div className="pt-2">
                    <a
                      href={rec.evidenceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#09090B] hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#71717A]" />
                      <span>Preview Certificate / Project Evidence</span>
                    </a>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT JOURNEY MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRecord ? 'Edit Journey Record' : 'Add New Journey Entry'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-semibold text-[#52525B]">Category Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] focus:bg-white focus:border-[#09090B] focus:outline-none"
              >
                <option value="Education">Education</option>
                <option value="Project">Project</option>
                <option value="Certification">Certification</option>
                <option value="Experience">Previous Internship / Work</option>
                <option value="Workshop">Workshop</option>
                <option value="Competition">Competition / Hackathon</option>
                <option value="Achievement">Achievement / Honor</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-[#52525B]">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. B.Tech Computer Science or DevCore Platform"
                className="w-full px-3 py-2 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] focus:bg-white focus:border-[#09090B] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-semibold text-[#52525B]">Organization / Institute</label>
              <input
                type="text"
                value={organizationOrInstitute}
                onChange={(e) => setOrganizationOrInstitute(e.target.value)}
                placeholder="e.g. IIT Bombay, Hackathon Name"
                className="w-full px-3 py-2 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] focus:bg-white focus:border-[#09090B] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-[#52525B]">Date or Period</label>
              <input
                type="text"
                value={dateOrPeriod}
                onChange={(e) => setDateOrPeriod(e.target.value)}
                placeholder="e.g. 2024 - 2026 or Sept 2026"
                className="w-full px-3 py-2 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] focus:bg-white focus:border-[#09090B] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-semibold text-[#52525B]">Description & Key Highlights</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your learnings, technology stack used, or awards won..."
              className="w-full px-3 py-2 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] focus:bg-white focus:border-[#09090B] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-semibold text-[#52525B]">Certificate / Project Link / Evidence URL</label>
            <input
              type="text"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              placeholder="https://github.com/myproject or https://coursera.org/verify/..."
              className="w-full px-3 py-2 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] focus:bg-white focus:border-[#09090B] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="verifyCheck"
              checked={isVerified}
              onChange={(e) => setIsVerified(e.target.checked)}
              className="w-4 h-4 rounded bg-white border-[#E4E4E7] text-[#09090B] accent-black"
            />
            <label htmlFor="verifyCheck" className="text-[#52525B] cursor-pointer font-medium">
              Mark as verified record (Includes valid proof or institutional credential)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E4E4E7]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-md bg-white hover:bg-[#F4F4F5] text-[#71717A] border border-[#E4E4E7] font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-[#09090B] hover:bg-black text-white font-semibold shadow-sm"
            >
              {editingRecord ? 'Update Record' : 'Save to Journey'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
