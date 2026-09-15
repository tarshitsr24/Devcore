import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  Sparkles,
  Award,
  Search,
  BookOpen,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  Briefcase,
  User,
  PlusCircle,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function ApplicantDashboard() {
  const { user, profile, refreshProfile } = useAuth();

  const [skills, setSkills] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recentInternships, setRecentInternships] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [skillsRes, recsRes, internshipsRes, appsRes, certsRes] = await Promise.allSettled([
        api.get('/skills'),
        api.get('/recommendations/internships'),
        api.get('/internships'),
        api.get('/applications/my-applications'),
        api.get('/recommendations/certifications')
      ]);

      if (skillsRes.status === 'fulfilled' && skillsRes.value.data.success) {
        setSkills(skillsRes.value.data.skills);
      }
      if (recsRes.status === 'fulfilled' && recsRes.value.data.success) {
        setRecommendations(recsRes.value.data.recommendations.slice(0, 3));
      }
      if (internshipsRes.status === 'fulfilled' && internshipsRes.value.data.success) {
        setRecentInternships(internshipsRes.value.data.internships.slice(0, 4));
      }
      if (appsRes.status === 'fulfilled' && appsRes.value.data.success) {
        setRecentApplications(appsRes.value.data.applications.slice(0, 3));
      }
      if (certsRes.status === 'fulfilled' && certsRes.value.data.success) {
        setCertifications(certsRes.value.data.certifications.slice(0, 3));
      }

      await refreshProfile();
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const completionPct = user?.completionPercentage || profile?.completionPercentage || 40;

  // Chart data calculation
  const techSkillsCount = skills.filter(s => s.category === 'Technical').length;
  const softSkillsCount = skills.filter(s => s.category === 'Soft Skill').length;

  const chartData = [
    { name: 'Technical Skills', value: techSkillsCount || 1, color: '#09090B' },
    { name: 'Soft Skills', value: softSkillsCount || 1, color: '#71717A' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* FEATURED WELCOME BANNER & PROFILE COMPLETION INDICATOR */}
      <div className="p-6 sm:p-8 rounded-md bg-[#09090B] text-white border border-[#09090B] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#27272A] border border-[#3F3F46] text-[#E4E4E7] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#E4E4E7]" />
            <span>Applicant Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-[#A1A1AA] text-xs sm:text-sm">
            Track your skills, application statuses, AI recommendations, and career journey in one platform.
          </p>
        </div>

        {/* Profile Completion Indicator Badge */}
        <div className="w-full md:w-auto p-4 rounded bg-[#18181B] border border-[#27272A] flex items-center gap-4 min-w-[240px]">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle cx="24" cy="24" r="19" stroke="currentColor" strokeWidth="3" className="text-[#27272A]" fill="transparent" />
              <circle
                cx="24"
                cy="24"
                r="19"
                stroke="currentColor"
                strokeWidth="3"
                className="text-white transition-all duration-1000"
                fill="transparent"
                strokeDasharray="119"
                strokeDashoffset={119 - (119 * completionPct) / 100}
              />
            </svg>
            <span className="absolute text-xs font-bold text-white">{completionPct}%</span>
          </div>

          <div>
            <span className="text-xs font-bold text-white block">Profile Completion</span>
            <span className="text-[11px] text-[#A1A1AA]">
              {completionPct < 80 ? 'Complete profile for higher matching!' : 'Your profile is looking great!'}
            </span>
            <Link to="/profile" className="text-xs font-semibold text-white hover:underline block mt-0.5">
              Update Profile →
            </Link>
          </div>
        </div>
      </div>

      {/* QUICK ACTION BUTTONS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Link
          to="/profile"
          className="p-3 rounded bg-white hover:bg-[#F4F4F5] border border-[#E4E4E7] text-[#09090B] text-xs font-semibold flex items-center gap-2 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
        >
          <User className="w-4 h-4 text-[#71717A]" />
          <span>Complete Profile</span>
        </Link>
        <Link
          to="/my-skills"
          className="p-3 rounded bg-white hover:bg-[#F4F4F5] border border-[#E4E4E7] text-[#09090B] text-xs font-semibold flex items-center gap-2 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
        >
          <Award className="w-4 h-4 text-[#71717A]" />
          <span>Add Skills</span>
        </Link>
        <Link
          to="/find-internships"
          className="p-3 rounded bg-white hover:bg-[#F4F4F5] border border-[#E4E4E7] text-[#09090B] text-xs font-semibold flex items-center gap-2 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
        >
          <Search className="w-4 h-4 text-[#71717A]" />
          <span>Find Internships</span>
        </Link>
        <Link
          to="/recommended"
          className="p-3 rounded bg-white hover:bg-[#F4F4F5] border border-[#E4E4E7] text-[#09090B] text-xs font-semibold flex items-center gap-2 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
        >
          <Sparkles className="w-4 h-4 text-[#71717A]" />
          <span>Recommendations</span>
        </Link>
        <Link
          to="/my-journey"
          className="col-span-2 sm:col-span-1 p-3 rounded bg-white hover:bg-[#F4F4F5] border border-[#E4E4E7] text-[#09090B] text-xs font-semibold flex items-center gap-2 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
        >
          <GraduationCap className="w-4 h-4 text-[#71717A]" />
          <span>Update Journey</span>
        </Link>
      </div>

      {/* DASHBOARD MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT TWO COLUMNS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI RECOMMENDED INTERNSHIPS OVERVIEW */}
          <div className="p-6 rounded-md bg-white border border-[#E4E4E7] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#71717A]" />
                <h3 className="text-base font-bold text-[#09090B]">AI Recommended Internships</h3>
              </div>
              <Link to="/recommended" className="text-xs font-semibold text-[#09090B] hover:underline flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-[#71717A]">Calculating compatibility scores...</div>
            ) : recommendations.length === 0 ? (
              <p className="text-xs text-[#71717A] italic py-4">No recommendations found yet. Add more skills to unlock personalized AI matches!</p>
            ) : (
              <div className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="p-4 rounded bg-white border border-[#E4E4E7] hover:border-[#71717A] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#09090B] text-xs">{rec.internship?.title}</span>
                        <span className="text-[10px] font-bold text-[#065F46] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                          {rec.compatibility_score}% Match
                        </span>
                      </div>
                      <p className="text-xs text-[#71717A]">{rec.internship?.orgName} • {rec.internship?.location}</p>
                      <p className="text-xs text-[#52525B] italic">{rec.why_recommended}</p>
                    </div>

                    <Link
                      to={`/internship/${rec.internship_id || rec.internship?._id}`}
                      className="w-full sm:w-auto px-3.5 py-1.5 rounded bg-[#09090B] text-white hover:bg-[#27272A] font-semibold text-xs transition-colors text-center"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RECENT APPLICATIONS & LIVE STATUS */}
          <div className="p-6 rounded-md bg-white border border-[#E4E4E7] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#71717A]" />
                <h3 className="text-base font-bold text-[#09090B]">Recent Applications & Status</h3>
              </div>
              <Link to="/my-applications" className="text-xs font-semibold text-[#09090B] hover:underline flex items-center gap-1">
                <span>My Applications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-[#71717A]">Loading application statuses...</div>
            ) : recentApplications.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <p className="text-xs text-[#71717A] italic">You haven't submitted any internship applications yet.</p>
                <Link to="/find-internships" className="inline-block text-xs font-bold text-[#09090B] hover:underline">
                  Browse Internships & Apply →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentApplications.map((app) => (
                  <div key={app._id} className="p-4 rounded bg-white border border-[#E4E4E7] flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-[#09090B] text-xs">{app.internship?.title || 'Internship Application'}</h4>
                      <p className="text-xs text-[#71717A]">{app.internship?.orgName} • Applied on {new Date(app.appliedDate).toLocaleDateString()}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          
          {/* CURRENT SKILLS SUMMARY & CHART */}
          <div className="p-6 rounded-md bg-white border border-[#E4E4E7] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#71717A]" />
                <h3 className="text-sm font-bold text-[#09090B]">Current Skills Summary</h3>
              </div>
              <Link to="/my-skills" className="text-xs font-semibold text-[#09090B] hover:underline">Manage</Link>
            </div>

            {/* Recharts Skill Category Visualization */}
            {skills.length > 0 && (
              <div className="h-32 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} dataKey="value" innerRadius={25} outerRadius={40} paddingAngle={4}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E4E4E7', borderRadius: '4px', fontSize: '11px', color: '#09090B' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5">
              {skills.length === 0 ? (
                <p className="text-xs text-[#71717A] italic">No skills added yet.</p>
              ) : (
                skills.map((s) => (
                  <span key={s._id} className="text-[11px] px-2.5 py-1 rounded bg-[#F4F4F5] text-[#18181B] border border-[#E4E4E7] font-medium">
                    {s.name} <span className="text-[10px] text-[#71717A]">({s.level})</span>
                  </span>
                ))
              )}
            </div>

            <Link
              to="/my-skills"
              className="w-full block text-center py-2 rounded bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#09090B] border border-[#E4E4E7] font-semibold text-xs transition-colors"
            >
              + Add / Edit Skills
            </Link>
          </div>

          {/* RECOMMENDED CERTIFICATIONS */}
          <div className="p-6 rounded-md bg-white border border-[#E4E4E7] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#71717A]" />
                <h3 className="text-sm font-bold text-[#09090B]">Recommended Certifications</h3>
              </div>
              <Link to="/get-certified" className="text-xs font-semibold text-[#09090B] hover:underline">View All</Link>
            </div>

            <div className="space-y-2.5">
              {certifications.map((c, idx) => (
                <div key={idx} className="p-3 rounded bg-[#FAFAFA] border border-[#E4E4E7] space-y-1">
                  <h4 className="font-semibold text-[#09090B] text-xs">{c.name}</h4>
                  <p className="text-[10px] text-[#71717A]">{c.provider} • {c.duration}</p>
                  <p className="text-[10px] text-[#065F46] font-medium">{c.reason_for_recommendation}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
