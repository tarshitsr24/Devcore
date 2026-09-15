import React from 'react';

export default function Home() {
  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F4F4F6]">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tight leading-none">
            <span className="text-slate-800 !text-[#27272A]">Dev</span><span className="text-slate-400 !text-[#9CA3AF]">Core</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Connect skills, opportunities, and careers through intelligent internship matching.
          </p>

          <p className="text-base text-slate-500 font-semibold italic">
            “Connect Skills, Opportunities, and Careers.”
          </p>

          <div className="max-w-3xl mx-auto space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            <p>Discover opportunities that match your skills and career goals.</p>
            <p>Build your professional identity with projects, certifications, internships, and achievements.</p>
            <p>Organizations can find talented individuals and create meaningful internship opportunities.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
