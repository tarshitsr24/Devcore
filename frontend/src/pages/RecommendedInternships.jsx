import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Sparkles, CheckCircle2, AlertTriangle, BookOpen, ArrowRight, Building2, MapPin, Award } from 'lucide-react';

export default function RecommendedInternships() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/recommendations/internships');
      if (res.data.success) {
        setRecommendations(res.data.recommendations);
      }
    } catch (err) {
      console.error('Fetch recommendations error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-md bg-white border border-[#E4E4E7] space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#F4F4F5] border border-[#E4E4E7] text-[#09090B] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#71717A]" />
          <span>Python AI Engine Analysis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#09090B]">AI Recommended Internships</h1>
        <p className="text-xs sm:text-sm text-[#71717A]">
          Compatibility scores computed using Scikit-Learn TF-IDF vectorization and Skill Set Cosine Similarity.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-[#71717A]">
          Computing live skill vectors & AI compatibility scores...
        </div>
      ) : recommendations.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-md border border-[#E4E4E7] space-y-3">
          <p className="text-[#09090B] font-semibold">No internship recommendations found.</p>
          <p className="text-xs text-[#71717A]">Add technical & soft skills to your profile to generate personalized AI matches!</p>
          <Link to="/my-skills" className="inline-block text-xs font-semibold text-[#09090B] hover:underline">
            Manage My Skills →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {recommendations.map((item, idx) => {
            const internship = item.internship;
            const score = item.compatibility_score;

            return (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-md bg-white border border-[#E4E4E7] hover:border-[#D4D4D8] transition-all space-y-6"
              >
                {/* Header info & Score badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E4E7] pb-4">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-[#09090B]">{internship?.title}</h2>
                    <p className="text-xs text-[#71717A] flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#71717A]" />
                      <span>{internship?.orgName}</span>
                      <span>•</span>
                      <MapPin className="w-3.5 h-3.5 text-[#71717A]" />
                      <span>{internship?.location} ({internship?.workMode})</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-md border border-[#E4E4E7] bg-[#FAFAFA] flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-[#09090B]">{score}%</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">AI Compatibility</span>
                    </div>
                  </div>
                </div>

                {/* Recommendation Reason */}
                <div className="p-3.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#52525B] text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#09090B] flex-shrink-0" />
                  <span><strong className="text-[#09090B]">Why it is recommended:</strong> {item.why_recommended}</span>
                </div>

                {/* Skills Analysis Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Matched Skills */}
                  <div className="p-4 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Matched Skills ({item.matched_skills?.length || 0})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.matched_skills && item.matched_skills.length > 0 ? (
                        item.matched_skills.map((s, sIdx) => (
                          <span key={sIdx} className="text-xs px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                            ✓ {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[#71717A] italic">No direct skill overlap detected yet.</span>
                      )}
                    </div>
                  </div>

                  {/* Missing Skills & Recommended Learning */}
                  <div className="p-4 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Missing Skills to Learn ({item.missing_skills?.length || 0})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.missing_skills && item.missing_skills.length > 0 ? (
                        item.missing_skills.map((s, sIdx) => (
                          <span key={sIdx} className="text-xs px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200 font-medium">
                            + {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-700 italic">You match all required skills!</span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Footer Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <Link to="/get-certified" className="text-xs font-medium text-[#71717A] hover:text-[#09090B] hover:underline flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#71717A]" />
                    <span>View recommended courses for missing skills</span>
                  </Link>

                  <Link
                    to={`/internship/${item.internship_id || internship?._id}`}
                    className="px-6 py-2.5 rounded-md bg-[#09090B] hover:bg-black text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2"
                  >
                    <span>View & Apply</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
