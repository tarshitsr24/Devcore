import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { getAssetUrl } from '../services/api';
import MySkills from './MySkills';
import ImageCropModal from '../components/ImageCropModal';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Linkedin,
  Github,
  Globe,
  FileText,
  Briefcase,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Upload,
  Link as LinkIcon
} from 'lucide-react';

export default function ApplicantProfile() {
  const { user, profile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [resume, setResume] = useState('');
  const [interests, setInterests] = useState('');
  const [preferredDomain, setPreferredDomain] = useState('');
  const [preferredJobRole, setPreferredJobRole] = useState('');
  const [preferredWorkMode, setPreferredWorkMode] = useState('Remote');
  const [locationPreference, setLocationPreference] = useState('');

  // Education history items
  const [educationHistory, setEducationHistory] = useState([]);
  const [newCollege, setNewCollege] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [newGradYear, setNewGradYear] = useState('');
  const [newGrade, setNewGrade] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [cropImage, setCropImage] = useState(null);

  useEffect(() => {
    setFullName(user?.fullName || '');
    fetchProfile();
  }, [user?.fullName]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile/applicant');
      if (res.data.success && res.data.profile) {
        const p = res.data.profile;
        setBio(p.bio || '');
        setPhone(p.phone || '');
        setAvatar(p.avatar || '');
        setPhotoPreview(getAssetUrl(p.avatar || ''));
        setLinkedin(p.links?.linkedin || '');
        setGithub(p.links?.github || '');
        setPortfolio(p.links?.portfolio || '');
        setResume(p.links?.resume || '');
        setEducationHistory(p.educationHistory || []);

        if (p.careerDetails) {
          setInterests(Array.isArray(p.careerDetails.interests) ? p.careerDetails.interests.join(', ') : '');
          setPreferredDomain(p.careerDetails.preferredDomain || '');
          setPreferredJobRole(p.careerDetails.preferredJobRole || '');
          setPreferredWorkMode(p.careerDetails.preferredWorkMode || 'Remote');
          setLocationPreference(p.careerDetails.locationPreference || '');
        }
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
    }
  };

  const handleAddEducation = () => {
    if (!newCollege.trim() || !newCourse.trim()) {
      setError('Please provide both College/University and Course/Branch.');
      return;
    }
    setEducationHistory([
      ...educationHistory,
      { college: newCollege.trim(), course: newCourse.trim(), graduationYear: newGradYear.trim(), grade: newGrade.trim() }
    ]);
    setNewCollege('');
    setNewCourse('');
    setNewGradYear('');
    setNewGrade('');
    setError('');
  };

  const handleRemoveEducation = (index) => {
    setEducationHistory(educationHistory.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    setError('');

    try {
      const res = await api.post('/profile/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setResume(res.data.url);
        setMessage('File uploaded successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCropImage({ file, url: URL.createObjectURL(file) });
    e.target.value = '';
  };

  const handleCroppedAvatarUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    setError('');

    try {
      const res = await api.post('/profile/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setAvatar(res.data.url);
        setPhotoPreview(URL.createObjectURL(file));
        setMessage('Profile photo uploaded successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Profile photo upload failed.');
    } finally {
      setUploading(false);
      if (cropImage?.url) URL.revokeObjectURL(cropImage.url);
      setCropImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const formattedInterests = interests.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const payload = {
        fullName,
        bio,
        phone,
        avatar,
        educationHistory,
        links: {
          linkedin,
          github,
          portfolio,
          resume
        },
        careerDetails: {
          interests: formattedInterests,
          preferredDomain,
          preferredJobRole,
          preferredWorkMode,
          locationPreference
        }
      };

      const res = await api.put('/profile/applicant', payload);
      if (res.data.success) {
        setMessage('Profile updated successfully!');
        await refreshProfile();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const completionPct = user?.completionPercentage || profile?.completionPercentage || 45;
  const profileInitials = fullName.trim().split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER & COMPLETION BAR */}
      <div className="p-6 sm:p-8 rounded-md bg-white border border-[#E4E4E7] space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#E4E4E7]"
                onError={() => setPhotoPreview('')}
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#09090B] flex items-center justify-center font-bold text-white text-2xl">
                {profileInitials}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-[#09090B]">Editable Applicant Profile</h1>
              <p className="text-xs text-[#71717A]">Keep your details up-to-date for better AI compatibility scores</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#09090B] bg-[#F4F4F5] px-3 py-1.5 rounded border border-[#E4E4E7]">
            {completionPct}% Complete
          </span>
        </div>

        {/* Completion Bar */}
        <div className="w-full bg-[#F4F4F5] h-2 rounded-full overflow-hidden border border-[#E4E4E7]">
          <div
            className="bg-[#09090B] h-full rounded-full transition-all duration-1000"
            style={{ width: `${completionPct}%` }}
          ></div>
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

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: BASIC INFORMATION */}
        <div className="p-6 rounded-md bg-white border border-[#E4E4E7] space-y-5">
          <h3 className="text-base font-bold text-[#09090B] flex items-center gap-2">
            <User className="w-5 h-5 text-[#71717A]" />
            <span>Basic Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#52525B]">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#52525B]">Email Address (From Signup)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 rounded-md bg-[#F4F4F5] border border-[#E4E4E7] text-[#71717A] text-sm cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#52525B]">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#52525B]">Profile Photo</label>
              <div className="flex items-center gap-3">
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="w-12 h-12 shrink-0 rounded-full object-cover border border-[#E4E4E7]"
                    onError={() => setPhotoPreview('')}
                  />
                )}
                <div className="flex min-w-0 flex-1 gap-2">
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => {
                      setAvatar(e.target.value);
                      setPhotoPreview(e.target.value);
                    }}
                    placeholder="https://example.com/avatar.jpg"
                    className="min-w-0 flex-1 px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
                  />
                  <label className="shrink-0 cursor-pointer px-3 py-2.5 rounded-md bg-[#09090B] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-white" />
                    <span>From device</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
              <p className="text-[11px] text-[#71717A]">Upload a JPG, PNG, or WebP image.</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#52525B]">About / Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell organizations about your technical passion, career ambitions, and strengths..."
              className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
            />
          </div>
        </div>

        {/* SECTION 2: EDUCATION HISTORY */}
        <div className="p-6 rounded-md bg-white border border-[#E4E4E7] space-y-5">
          <h3 className="text-base font-bold text-[#09090B] flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#71717A]" />
            <span>Education & Academic Background</span>
          </h3>

          {/* Added education items */}
          <div className="space-y-3">
            {educationHistory.map((edu, index) => (
              <div key={index} className="p-4 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-[#09090B] text-sm">{edu.college}</h4>
                  <p className="text-xs text-[#71717A]">{edu.course} • Class of {edu.graduationYear || 'N/A'}</p>
                  {edu.grade && <p className="text-xs text-[#09090B] font-medium mt-0.5">Grade: {edu.grade}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveEducation(index)}
                  className="p-1.5 text-[#71717A] hover:text-rose-600 hover:bg-rose-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add new education input form */}
          <div className="p-4 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] space-y-3">
            <h4 className="text-xs font-bold text-[#52525B] uppercase tracking-wider">Add Education Record</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newCollege}
                onChange={(e) => setNewCollege(e.target.value)}
                placeholder="College / University Name"
                className="px-3 py-2 rounded-md bg-white border border-[#E4E4E7] text-xs text-[#09090B] placeholder:text-[#A1A1AA] focus:border-[#09090B] focus:outline-none"
              />
              <input
                type="text"
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                placeholder="Course / Branch (e.g. B.Tech CSE)"
                className="px-3 py-2 rounded-md bg-white border border-[#E4E4E7] text-xs text-[#09090B] placeholder:text-[#A1A1AA] focus:border-[#09090B] focus:outline-none"
              />
              <input
                type="text"
                value={newGradYear}
                onChange={(e) => setNewGradYear(e.target.value)}
                placeholder="Graduation Year (e.g. 2026)"
                className="px-3 py-2 rounded-md bg-white border border-[#E4E4E7] text-xs text-[#09090B] placeholder:text-[#A1A1AA] focus:border-[#09090B] focus:outline-none"
              />
              <input
                type="text"
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
                placeholder="Grade / CGPA (e.g. 8.5 CGPA)"
                className="px-3 py-2 rounded-md bg-white border border-[#E4E4E7] text-xs text-[#09090B] placeholder:text-[#A1A1AA] focus:border-[#09090B] focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleAddEducation}
              className="py-2 px-4 rounded-md bg-white hover:bg-[#F4F4F5] text-[#09090B] border border-[#E4E4E7] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Education Record</span>
            </button>
          </div>
        </div>

        {/* SECTION 3: PROFESSIONAL LINKS & RESUME UPLOAD */}
        <div className="p-6 rounded-md bg-white border border-[#E4E4E7] space-y-5">
          <h3 className="text-base font-bold text-[#09090B] flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-[#71717A]" />
            <span>Professional Links & Resume</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#52525B]">LinkedIn Profile</label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#52525B]">GitHub Profile</label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#52525B]">Portfolio Website</label>
              <input
                type="url"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://myportfolio.dev"
                className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#52525B]">Resume Link or Upload</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="https://drive.google.com/resume.pdf"
                  className="flex-1 px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
                />
                <label className="cursor-pointer px-4 py-2.5 rounded-md bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#09090B] text-xs font-semibold flex items-center gap-1.5 border border-[#E4E4E7]">
                  <Upload className="w-4 h-4 text-[#71717A]" />
                  <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                  <input type="file" onChange={handleFileUpload} accept=".pdf,.doc,.docx" className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: CAREER DETAILS & PREFERENCES */}
        <div className="p-6 rounded-md bg-white border border-[#E4E4E7] space-y-5">
          <h3 className="text-base font-bold text-[#09090B] flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#71717A]" />
            <span>Career Preferences & Interests</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#52525B]">Preferred Domain</label>
              <input
                type="text"
                value={preferredDomain}
                onChange={(e) => setPreferredDomain(e.target.value)}
                placeholder="e.g. Web Development, Data Science, AI"
                className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#52525B]">Preferred Job Role</label>
              <input
                type="text"
                value={preferredJobRole}
                onChange={(e) => setPreferredJobRole(e.target.value)}
                placeholder="e.g. Full Stack Developer Intern"
                className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#52525B]">Preferred Work Mode</label>
              <select
                value={preferredWorkMode}
                onChange={(e) => setPreferredWorkMode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
              >
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#52525B]">Location Preference</label>
              <input
                type="text"
                value={locationPreference}
                onChange={(e) => setLocationPreference(e.target.value)}
                placeholder="e.g. Bengaluru, Mumbai, Remote"
                className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#52525B]">Career Interests (Comma Separated)</label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Full Stack, Cloud Infrastructure, Machine Learning"
              className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-md bg-[#09090B] hover:bg-black text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Save className="w-4 h-4 text-white" />
              <span>Save & Update Profile</span>
            </>
          )}
        </button>

      </form>

      {cropImage && (
        <ImageCropModal
          image={cropImage}
          onCancel={(cropError) => {
            if (cropImage.url) URL.revokeObjectURL(cropImage.url);
            setCropImage(null);
            if (cropError) setError(cropError);
          }}
          onComplete={handleCroppedAvatarUpload}
        />
      )}

      <MySkills />
    </div>
  );
}
