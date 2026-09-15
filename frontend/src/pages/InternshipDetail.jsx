import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { getAssetUrl } from '../services/api';
import Modal from '../components/Modal';
import {
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Send,
  FileText,
  Globe,
  Linkedin,
  Github,
  Award,
  Sparkles
} from 'lucide-react';

export default function InternshipDetail() {
  const { id } = useParams();
  const { user, profile, isApplicant } = useAuth();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [orgProfile, setOrgProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Application Modal States
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isOrgProfileOpen, setIsOrgProfileOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [resume, setResume] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [availability, setAvailability] = useState('Immediate');
  const [consent, setConsent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/internships/${id}`);
      if (res.data.success) {
        setInternship(res.data.internship);
        setOrgProfile(res.data.organizationProfile);
      }
    } catch (err) {
      console.error('Fetch internship detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openApplyModal = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Pre-fill fields from user profile
    setFullName(user.fullName || '');
    setEmail(user.email || '');
    setPhone(profile?.phone || '');
    setCollege(profile?.educationHistory?.[0]?.college || '');
    setCourse(profile?.educationHistory?.[0]?.course || '');
    setResume(profile?.links?.resume || '');
    setGithub(profile?.links?.github || '');
    setLinkedin(profile?.links?.linkedin || '');
    setPortfolio(profile?.links?.portfolio || '');
    setCoverLetter('');
    setConsent(false);
    setErrorMessage('');
    setSuccessMessage('');
    setIsApplyModalOpen(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!consent) {
      setErrorMessage('Please accept the consent checkbox before submitting your application.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        internshipId: id,
        fullName,
        email,
        phone,
        college,
        course,
        resume,
        github,
        linkedin,
        portfolio,
        coverLetter,
        availability
      };

      const res = await api.post('/applications', payload);
      if (res.data.success) {
        setSuccessMessage(res.data.message);
        setTimeout(() => {
          setIsApplyModalOpen(false);
          navigate('/my-applications');
        }, 1800);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-400 text-sm">
        Loading internship details...
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#09090B]">Internship Not Found</h2>
        <Link to="/find-internships" className="inline-block text-xs font-semibold text-[#09090B] hover:underline">
          ← Back to Internship Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Button */}
      <Link to="/find-internships" className="inline-flex items-center gap-2 text-xs font-semibold text-[#71717A] hover:text-[#09090B] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Internship Marketplace</span>
      </Link>

      {/* INTERNSHIP BANNER HEADER */}
      <div className="p-6 sm:p-8 rounded-md bg-white border border-[#E4E4E7] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] flex items-center justify-center font-bold text-[#09090B] text-xl overflow-hidden flex-shrink-0">
              {internship.orgLogo ? (
                <img src={getAssetUrl(internship.orgLogo)} alt={internship.orgName} className="w-full h-full object-cover" />
              ) : (
                internship.orgName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#09090B]">{internship.title}</h1>
              <p className="text-sm font-medium text-[#52525B] flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#71717A]" />
                <span>{internship.orgName}</span>
                {orgProfile?.isVerified && (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified Org
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Action apply button */}
          {isApplicant && (
            <button
              onClick={openApplyModal}
              className="w-full md:w-auto px-8 py-3 rounded-md bg-[#09090B] hover:bg-black text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Send className="w-4 h-4 text-white" />
              <span>Apply Now</span>
            </button>
          )}
        </div>

        {/* Highlight Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-xs">
          <div>
            <span className="text-[#71717A] block text-[11px] uppercase tracking-wider font-semibold">Location & Mode</span>
            <span className="font-semibold text-[#09090B]">{internship.location} ({internship.workMode})</span>
          </div>
          <div>
            <span className="text-[#71717A] block text-[11px] uppercase tracking-wider font-semibold">Stipend</span>
            <span className="font-semibold text-emerald-700">{internship.stipend}</span>
          </div>
          <div>
            <span className="text-[#71717A] block text-[11px] uppercase tracking-wider font-semibold">Duration</span>
            <span className="font-semibold text-[#09090B]">{internship.duration}</span>
          </div>
          <div>
            <span className="text-[#71717A] block text-[11px] uppercase tracking-wider font-semibold">Openings</span>
            <span className="font-semibold text-[#09090B]">{internship.openings} Positions</span>
          </div>
        </div>
      </div>

      {/* MAIN DESCRIPTION CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Description & Requirements */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="p-6 rounded-md bg-white border border-[#E4E4E7] space-y-4">
            <h3 className="text-lg font-bold text-[#09090B]">About the Internship</h3>
            <p className="text-sm text-[#52525B] leading-relaxed whitespace-pre-line">
              {internship.description}
            </p>

            {internship.responsibilities && (
              <div className="pt-4 border-t border-[#E4E4E7] space-y-2">
                <h4 className="text-sm font-semibold text-[#09090B]">Key Responsibilities</h4>
                <p className="text-sm text-[#52525B] leading-relaxed whitespace-pre-line">
                  {internship.responsibilities}
                </p>
              </div>
            )}

            {internship.requirements && (
              <div className="pt-4 border-t border-[#E4E4E7] space-y-2">
                <h4 className="text-sm font-semibold text-[#09090B]">Requirements & Eligibility</h4>
                <p className="text-sm text-[#52525B] leading-relaxed whitespace-pre-line">
                  {internship.requirements}
                </p>
              </div>
            )}

            {internship.benefits && (
              <div className="pt-4 border-t border-[#E4E4E7] space-y-2">
                <h4 className="text-sm font-semibold text-[#09090B]">Perks & Benefits</h4>
                <p className="text-sm text-[#52525B] leading-relaxed">
                  {internship.benefits}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Right Col: Required Skills & Org Information */}
        <div className="space-y-6">
          
          {/* Required Skills Card */}
          <div className="p-6 rounded-md bg-white border border-[#E4E4E7] space-y-4">
            <h3 className="text-base font-bold text-[#09090B] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#71717A]" />
              <span>Required Skills</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {internship.requiredSkills && internship.requiredSkills.map((s, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded bg-[#FAFAFA] text-[#09090B] border border-[#E4E4E7] font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Org Profile Snapshot */}
          <div className="p-6 rounded-md bg-white border border-[#E4E4E7] space-y-4">
            <h3 className="text-base font-bold text-[#09090B] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#71717A]" />
              <span>About Organization</span>
            </h3>

            <p className="text-xs text-[#52525B] leading-relaxed">
              {orgProfile?.description || 'Leading innovative organization recruiting top applicants on DevCore.'}
            </p>

            {orgProfile?.website && (
              <a
                href={orgProfile.website}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-[#09090B] hover:underline flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-[#71717A]" />
                <span>Visit Company Website</span>
              </a>
            )}

            <button
              type="button"
              onClick={() => setIsOrgProfileOpen(true)}
              className="w-full px-4 py-2.5 rounded-md bg-white hover:bg-[#F4F4F5] text-[#09090B] border border-[#E4E4E7] text-xs font-semibold shadow-sm"
            >
              View Company Profile
            </button>
          </div>

        </div>

      </div>

      {/* ORGANIZATION PROFILE MODAL */}
      <Modal
        isOpen={isOrgProfileOpen}
        onClose={() => setIsOrgProfileOpen(false)}
        title={orgProfile?.orgName || internship.orgName}
      >
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            {orgProfile?.logo ? (
              <img src={getAssetUrl(orgProfile.logo)} alt={orgProfile.orgName} className="w-16 h-16 rounded-full object-cover border border-[#E4E4E7]" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#09090B] flex items-center justify-center text-xl font-bold text-white">
                {(orgProfile?.orgName || internship.orgName || 'O').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-[#09090B]">{orgProfile?.orgName || internship.orgName}</h3>
              <p className="text-xs text-[#71717A]">{orgProfile?.industry || 'Organization'}</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-[#52525B]">
            {orgProfile?.description || 'This organization has not added an overview yet.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {orgProfile?.location && <div className="p-3 rounded-md bg-[#FAFAFA] border border-[#E4E4E7]"><span className="text-[#71717A] block">Location</span><span className="text-[#09090B] font-medium">{orgProfile.location}</span></div>}
            {orgProfile?.contactPerson && <div className="p-3 rounded-md bg-[#FAFAFA] border border-[#E4E4E7]"><span className="text-[#71717A] block">Contact Person</span><span className="text-[#09090B] font-medium">{orgProfile.contactPerson}</span></div>}
          </div>
          <div className="flex flex-wrap gap-3">
            {orgProfile?.website && <a href={orgProfile.website} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#09090B] hover:underline">Company Website</a>}
            {orgProfile?.linkedIn && <a href={orgProfile.linkedIn} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#09090B] hover:underline">LinkedIn Company Page</a>}
          </div>
        </div>
      </Modal>

      {/* APPLICATION FORM MODAL */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply for ${internship.title}`}
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          
          {successMessage && (
            <div className="p-4 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#52525B]">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-xs focus:bg-white focus:border-[#09090B] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#52525B]">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-xs focus:bg-white focus:border-[#09090B] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#52525B]">Phone Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-xs focus:bg-white focus:border-[#09090B] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#52525B]">College / University</label>
              <input
                type="text"
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. IIT Bombay"
                className="w-full px-3.5 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-xs focus:bg-white focus:border-[#09090B] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#52525B]">Course / Branch</label>
              <input
                type="text"
                required
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. B.Tech Computer Science"
                className="w-full px-3.5 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-xs focus:bg-white focus:border-[#09090B] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#52525B]">Resume Link or File URL</label>
              <input
                type="text"
                required
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="https://drive.google.com/resume.pdf"
                className="w-full px-3.5 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-xs focus:bg-white focus:border-[#09090B] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#52525B]">GitHub Link</label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-3.5 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-xs focus:bg-white focus:border-[#09090B] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#52525B]">LinkedIn Link</label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3.5 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-xs focus:bg-white focus:border-[#09090B] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#52525B]">Portfolio Link</label>
              <input
                type="url"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://myportfolio.dev"
                className="w-full px-3.5 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-xs focus:bg-white focus:border-[#09090B] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#52525B]">Cover Letter / Application Message</label>
            <textarea
              rows={3}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Why are you a great fit for this internship role?"
              className="w-full px-3.5 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-xs focus:bg-white focus:border-[#09090B] focus:outline-none"
            />
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="consentCheck"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="w-4 h-4 rounded bg-white border-[#E4E4E7] text-[#09090B] accent-black"
            />
            <label htmlFor="consentCheck" className="text-xs text-[#52525B] cursor-pointer">
              I confirm that all details provided above are accurate and grant consent to share my profile with {internship.orgName}.
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E4E4E7]">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="px-4 py-2 rounded-md bg-white hover:bg-[#F4F4F5] text-[#71717A] text-xs font-semibold border border-[#E4E4E7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-md bg-[#09090B] hover:bg-black text-white font-semibold text-xs flex items-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
}
