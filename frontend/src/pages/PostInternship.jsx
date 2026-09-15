import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { PlusCircle, Save, CheckCircle2, AlertCircle, ArrowLeft, Send } from 'lucide-react';

export default function PostInternship() {
  const { id } = useParams(); // If present, edit mode
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [duration, setDuration] = useState('3 Months');
  const [location, setLocation] = useState('Remote');
  const [workMode, setWorkMode] = useState('Remote');
  const [stipend, setStipend] = useState('₹25,000 / month');
  const [eligibility, setEligibility] = useState('Open to all pursuing degree or recent grads');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [openings, setOpenings] = useState('2');
  const [benefits, setBenefits] = useState('Certificate of Completion, PPO Opportunity, Mentorship');
  const [contactDetails, setContactDetails] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchInternshipToEdit();
    }
  }, [id]);

  const fetchInternshipToEdit = async () => {
    try {
      const res = await api.get(`/internships/${id}`);
      if (res.data.success && res.data.internship) {
        const item = res.data.internship;
        setTitle(item.title || '');
        setDescription(item.description || '');
        setResponsibilities(item.responsibilities || '');
        setRequirements(item.requirements || '');
        setRequiredSkills(Array.isArray(item.requiredSkills) ? item.requiredSkills.join(', ') : '');
        setDuration(item.duration || '3 Months');
        setLocation(item.location || 'Remote');
        setWorkMode(item.workMode || 'Remote');
        setStipend(item.stipend || '');
        setEligibility(item.eligibility || '');
        setOpenings(item.openings?.toString() || '2');
        setBenefits(item.benefits || '');
        setContactDetails(item.contactDetails || '');

        if (item.applicationDeadline) {
          setApplicationDeadline(new Date(item.applicationDeadline).toISOString().split('T')[0]);
        }
      }
    } catch (err) {
      console.error('Fetch edit error:', err);
    }
  };

  const handleSaveInternship = async (statusToSet = 'published') => {
    setError('');
    setMessage('');

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    setLoading(true);

    const skillsArray = requiredSkills.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        responsibilities,
        requirements,
        requiredSkills: skillsArray,
        duration,
        location,
        workMode,
        stipend,
        eligibility,
        applicationDeadline: applicationDeadline || null,
        openings: parseInt(openings) || 2,
        benefits,
        contactDetails,
        status: statusToSet
      };

      if (id) {
        const res = await api.put(`/internships/${id}`, payload);
        if (res.data.success) {
          setMessage('Internship updated successfully!');
          setTimeout(() => navigate('/my-internships'), 1200);
        }
      } else {
        const res = await api.post('/internships', payload);
        if (res.data.success) {
          setMessage(res.data.message);
          setTimeout(() => navigate('/my-internships'), 1200);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving internship post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER */}
      <div className="p-6 sm:p-8 rounded-md bg-white border border-[#E4E4E7] flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#F4F4F5] border border-[#E4E4E7] text-[#09090B] text-xs font-semibold">
            <PlusCircle className="w-3.5 h-3.5 text-[#71717A]" />
            <span>Recruiter Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-[#09090B]">
            {id ? 'Edit Internship Posting' : 'Post New Internship Opportunity'}
          </h1>
          <p className="text-xs text-[#71717A]">Specify requirements, required skills, duration, and stipend</p>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form className="p-6 sm:p-8 rounded-md bg-white border border-[#E4E4E7] space-y-6">
        
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#52525B] uppercase tracking-wider">
            Internship Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Full Stack Developer Intern or AI Engineer Intern"
            className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#52525B]">Work Mode</label>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] text-xs focus:bg-white focus:border-[#09090B] focus:outline-none"
            >
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#52525B]">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bengaluru / Remote"
              className="w-full px-3 py-2 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-xs focus:bg-white focus:border-[#09090B] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#52525B]">Duration</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 3 Months"
              className="w-full px-3 py-2 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-xs focus:bg-white focus:border-[#09090B] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#52525B]">Stipend Details</label>
            <input
              type="text"
              value={stipend}
              onChange={(e) => setStipend(e.target.value)}
              placeholder="e.g. ₹25,000 / month"
              className="w-full px-3 py-2 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-xs focus:bg-white focus:border-[#09090B] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#52525B]">Number of Openings</label>
            <input
              type="number"
              value={openings}
              onChange={(e) => setOpenings(e.target.value)}
              placeholder="2"
              className="w-full px-3 py-2 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-xs focus:bg-white focus:border-[#09090B] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#52525B]">Application Deadline</label>
            <input
              type="date"
              value={applicationDeadline}
              onChange={(e) => setApplicationDeadline(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] text-xs focus:bg-white focus:border-[#09090B] focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#52525B]">
            Required Skills (Comma Separated for AI Matching Engine) *
          </label>
          <input
            type="text"
            required
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            placeholder="e.g. Python, React, Node.js, MongoDB, SQL"
            className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#52525B]">Short Description *</label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a compelling overview of the internship role..."
            className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#52525B]">Key Responsibilities</label>
          <textarea
            rows={3}
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            placeholder="List day-to-day responsibilities, tasks, and project deliverables..."
            className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#52525B]">Requirements & Eligibility</label>
          <textarea
            rows={3}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Technical background, degree requirements, or prerequisites..."
            className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#52525B]">Perks & Benefits</label>
          <input
            type="text"
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            placeholder="Certificate, PPO Opportunity, Mentorship"
            className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
          />
        </div>

        {/* Action Buttons: Draft vs Publish */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#E4E4E7]">
          <button
            type="button"
            onClick={() => handleSaveInternship('draft')}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-white hover:bg-[#F4F4F5] text-[#71717A] border border-[#E4E4E7] font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4 text-[#71717A]" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveInternship('published')}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-[#09090B] hover:bg-black text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Send className="w-4 h-4 text-white" />
                <span>Publish Internship Now</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
