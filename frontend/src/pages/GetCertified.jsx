import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BookOpen, ExternalLink, Award, Sparkles, Clock, BarChart, CheckCircle2 } from 'lucide-react';

export default function GetCertified() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/recommendations/certifications');
      if (res.data.success) {
        setCertifications(res.data.certifications);
      }
    } catch (err) {
      console.error('Fetch certifications error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-md bg-white border border-[#E4E4E7] space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#F4F4F5] border border-[#E4E4E7] text-[#09090B] text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-[#71717A]" />
          <span>AI Skill Gap Analysis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#09090B]">Get Certified & Upskill</h1>
        <p className="text-xs sm:text-sm text-[#71717A]">
          Personalized course and certification recommendations to bridge missing skills for your target internship domain.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-[#71717A]">Analyzing skill gaps and compiling course catalog...</div>
      ) : certifications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-md border border-[#E4E4E7] space-y-3">
          <p className="text-[#71717A] font-medium text-sm">No certifications currently loaded.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert, idx) => (
            <div
              key={idx}
              className="p-6 rounded-md bg-white border border-[#E4E4E7] hover:border-[#D4D4D8] transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#09090B] bg-[#F4F4F5] px-2.5 py-0.5 rounded border border-[#E4E4E7]">
                      {cert.domain || 'Tech Certification'}
                    </span>
                    <h3 className="font-bold text-lg text-[#09090B] mt-2">
                      {cert.name}
                    </h3>
                    <p className="text-xs text-[#71717A] font-medium">{cert.provider}</p>
                  </div>
                </div>

                <p className="text-xs text-[#52525B] leading-relaxed">
                  {cert.description}
                </p>

                {/* AI Reason for Recommendation */}
                <div className="p-3 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-xs text-[#52525B] flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#09090B] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#09090B]">Recommendation Reason: </span>
                    <span>{cert.reason_for_recommendation}</span>
                  </div>
                </div>

                {/* Target Skills Tags */}
                {cert.target_skills && cert.target_skills.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-[#71717A] block">Skills Covered:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {cert.target_skills.map((sk, sIdx) => (
                        <span key={sIdx} className="text-[11px] px-2 py-0.5 rounded bg-[#FAFAFA] text-[#09090B] border border-[#E4E4E7] font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Duration & Difficulty */}
                <div className="flex items-center gap-4 text-xs text-[#71717A] pt-2 border-t border-[#E4E4E7]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#71717A]" />
                    <span>{cert.duration}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart className="w-3.5 h-3.5 text-[#71717A]" />
                    <span>Level: {cert.difficulty}</span>
                  </span>
                </div>
              </div>

              {/* External Link Action */}
              <div className="pt-2">
                <a
                  href={cert.external_link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-md bg-[#09090B] hover:bg-black text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Start Course & Certification</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
