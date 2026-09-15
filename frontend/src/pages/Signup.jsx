import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Lock,
  Building2,
  Users,
  Award,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1 Form Data
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 2 Account Purpose
  const [role, setRole] = useState('applicant'); // 'applicant' | 'organization'

  // Step 3 Skills (Optional)
  const [skills, setSkills] = useState([
    { name: 'Python', category: 'Technical', level: 'Intermediate' },
    { name: 'JavaScript', category: 'Technical', level: 'Intermediate' }
  ]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Technical');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');

  const handleNextStep1 = (e) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all basic details.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    setError('');
    if (role === 'applicant') {
      setStep(3);
    } else {
      // Organization signup directly submits
      handleFinalSubmit([]);
    }
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    if (skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      setError(`Skill '${newSkillName.trim()}' is already added.`);
      return;
    }
    setSkills([
      ...skills,
      { name: newSkillName.trim(), category: newSkillCategory, level: newSkillLevel }
    ]);
    setNewSkillName('');
    setError('');
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleFinalSubmit = async (finalSkillsToSave) => {
    setError('');
    setLoading(true);

    try {
      const payload = {
        fullName,
        email,
        password,
        role,
        skills: role === 'applicant' ? finalSkillsToSave : []
      };

      const res = await signup(payload);
      const userRole = res.user.role;

      if (userRole === 'applicant') {
        navigate('/applicant-dashboard');
      } else {
        navigate('/org-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] max-w-7xl lg:max-w-none mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(440px,576px)_minmax(0,1fr)] items-stretch overflow-hidden rounded-md border border-[#E4E4E7] px-4 sm:px-6 lg:px-0 py-12">
      <div
        className="hidden lg:block min-h-[720px] bg-cover bg-center grayscale opacity-80"
        style={{ backgroundImage: "linear-gradient(rgba(244, 244, 246, 0.4), rgba(244, 244, 246, 0.8)), url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80')" }}
        aria-label="Technology server room"
      />

      <div className="w-full bg-white p-8 rounded-none border-y-0 border-x border-[#E4E4E7] shadow-sm relative overflow-hidden space-y-8">

        {/* Header Branding */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-[#09090B] tracking-tight">
            Create your <span className="text-[#09090B]">Dev<span className="text-[#71717A]">Core</span></span> Account
          </h2>
          <p className="text-xs text-[#71717A]">
            Connect Skills, Opportunities, and Careers.
          </p>
        </div>

        {/* Step Progress Tracker Bar */}
        <div className="flex items-center justify-between max-w-sm mx-auto px-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#09090B] font-bold' : 'text-[#A1A1AA]'}`}>
            <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-[#09090B] text-white' : 'bg-[#F4F4F5] text-[#71717A] border border-[#E4E4E7]'}`}>
              1
            </div>
            <span className="text-xs hidden sm:inline">Basic Info</span>
          </div>

          <div className={`h-[1px] w-10 sm:w-16 ${step >= 2 ? 'bg-[#09090B]' : 'bg-[#E4E4E7]'}`}></div>

          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#09090B] font-bold' : 'text-[#A1A1AA]'}`}>
            <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-[#09090B] text-white' : 'bg-[#F4F4F5] text-[#71717A] border border-[#E4E4E7]'}`}>
              2
            </div>
            <span className="text-xs hidden sm:inline">Purpose</span>
          </div>

          {role === 'applicant' && (
            <>
              <div className={`h-[1px] w-10 sm:w-16 ${step >= 3 ? 'bg-[#09090B]' : 'bg-[#E4E4E7]'}`}></div>

              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#09090B] font-bold' : 'text-[#A1A1AA]'}`}>
                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-[#09090B] text-white' : 'bg-[#F4F4F5] text-[#71717A] border border-[#E4E4E7]'}`}>
                  3
                </div>
                <span className="text-xs hidden sm:inline">Skills</span>
              </div>
            </>
          )}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 rounded bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: BASIC DETAILS */}
        {step === 1 && (
          <form onSubmit={handleNextStep1} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#09090B] uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan or TechCorp Inc."
                  className="w-full pl-10 pr-4 py-2.5 rounded bg-white border border-[#E4E4E7] text-[#09090B] text-xs focus:outline-none focus:border-[#09090B] transition-all placeholder:text-[#A1A1AA]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#09090B] uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded bg-white border border-[#E4E4E7] text-[#09090B] text-xs focus:outline-none focus:border-[#09090B] transition-all placeholder:text-[#A1A1AA]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#09090B] uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded bg-white border border-[#E4E4E7] text-[#09090B] text-xs focus:outline-none focus:border-[#09090B] transition-all placeholder:text-[#A1A1AA]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded bg-[#09090B] hover:bg-[#27272A] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Continue to Account Purpose</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: SELECT ACCOUNT PURPOSE */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-[#09090B]">What do you want to use DevCore for?</h3>
              <p className="text-xs text-[#71717A]">Choose your platform role below.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Applicant option */}
              <div
                onClick={() => setRole('applicant')}
                className={`cursor-pointer p-4 rounded border transition-all space-y-2.5 ${
                  role === 'applicant'
                    ? 'bg-[#09090B] text-white border-[#09090B] shadow-sm'
                    : 'bg-[#FAFAFA] border-[#E4E4E7] text-[#09090B] hover:border-[#71717A]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded ${role === 'applicant' ? 'bg-[#27272A] text-white' : 'bg-white border border-[#E4E4E7] text-[#09090B]'}`}>
                    <Users className="w-5 h-5" />
                  </div>
                  {role === 'applicant' && <Check className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${role === 'applicant' ? 'text-white' : 'text-[#09090B]'}`}>Applicant</h4>
                  <p className={`text-xs mt-1 leading-relaxed ${role === 'applicant' ? 'text-[#A1A1AA]' : 'text-[#71717A]'}`}>
                    Find internships, track your skills, manage your career journey, and receive AI recommendations.
                  </p>
                </div>
              </div>

              {/* Organization option */}
              <div
                onClick={() => setRole('organization')}
                className={`cursor-pointer p-4 rounded border transition-all space-y-2.5 ${
                  role === 'organization'
                    ? 'bg-[#09090B] text-white border-[#09090B] shadow-sm'
                    : 'bg-[#FAFAFA] border-[#E4E4E7] text-[#09090B] hover:border-[#71717A]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded ${role === 'organization' ? 'bg-[#27272A] text-white' : 'bg-white border border-[#E4E4E7] text-[#09090B]'}`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  {role === 'organization' && <Check className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${role === 'organization' ? 'text-white' : 'text-[#09090B]'}`}>Organization</h4>
                  <p className={`text-xs mt-1 leading-relaxed ${role === 'organization' ? 'text-[#A1A1AA]' : 'text-[#71717A]'}`}>
                    Post internship opportunities, evaluate applicant compatibility scores, and manage applications.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded bg-[#F4F4F5] text-[#09090B] hover:bg-[#E4E4E7] border border-[#E4E4E7] font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep2}
                disabled={loading}
                className="flex-1 py-2.5 rounded bg-[#09090B] hover:bg-[#27272A] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{role === 'applicant' ? 'Continue to Skills Setup' : 'Complete Registration'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ADD SKILLS (OPTIONAL) */}
        {step === 3 && role === 'applicant' && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-[#09090B] flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-[#71717A]" />
                <span>Add Your Initial Skills (Optional)</span>
              </h3>
              <p className="text-xs text-[#71717A]">
                Skills help DevCore calculate accurate internship recommendations. You can also edit these later.
              </p>
            </div>

            {/* Skill Input Controls */}
            <div className="p-4 rounded bg-[#FAFAFA] border border-[#E4E4E7] space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Skill name (e.g. React, Python)"
                  className="sm:col-span-1 px-3 py-2 rounded bg-white border border-[#E4E4E7] text-xs text-[#09090B] focus:outline-none focus:border-[#09090B]"
                />

                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="px-3 py-2 rounded bg-white border border-[#E4E4E7] text-xs text-[#09090B] focus:outline-none"
                >
                  <option value="Technical">Technical Skill</option>
                  <option value="Soft Skill">Soft Skill</option>
                </select>

                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value)}
                  className="px-3 py-2 rounded bg-white border border-[#E4E4E7] text-xs text-[#09090B] focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleAddSkill}
                className="w-full py-2 rounded bg-[#09090B] hover:bg-[#27272A] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill to List</span>
              </button>
            </div>

            {/* Added Skills List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">
                Current Selected Skills ({skills.length}):
              </p>

              {skills.length === 0 ? (
                <p className="text-xs text-[#A1A1AA] italic text-center py-4">No skills added yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {skills.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded bg-white border border-[#E4E4E7] text-xs">
                      <div>
                        <span className="font-semibold text-[#09090B]">{s.name}</span>
                        <span className="block text-[10px] text-[#71717A]">{s.category} • {s.level}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(idx)}
                        className="text-[#71717A] hover:text-[#DC2626] p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons: Save vs Skip */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleFinalSubmit([])}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2.5 rounded bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#09090B] border border-[#E4E4E7] font-semibold text-xs transition-colors"
              >
                Skip for Now
              </button>

              <button
                type="button"
                onClick={() => handleFinalSubmit(skills)}
                disabled={loading}
                className="flex-1 w-full py-2.5 rounded bg-[#09090B] hover:bg-[#27272A] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Skills & Complete Signup</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Footer Login Link */}
        <p className="text-center text-xs text-[#71717A] pt-2 border-t border-[#E4E4E7]">
          Already have a DevCore account?{' '}
          <Link to="/login" className="text-[#09090B] font-semibold hover:underline">
            Log in instead
          </Link>
        </p>

      </div>

      <div
        className="hidden lg:block min-h-[720px] bg-cover bg-center grayscale opacity-80"
        style={{ backgroundImage: "linear-gradient(rgba(244, 244, 246, 0.4), rgba(244, 244, 246, 0.8)), url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80')" }}
        aria-label="Technology circuit board"
      />
    </div>
  );
}
