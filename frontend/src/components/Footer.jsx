import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#FFFFFF] border-t border-[#E4E4E7] text-[#71717A] py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Branding & Tagline */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <span className="text-2xl font-black tracking-tight text-[#09090B]">
              Dev<span className="text-[#71717A]">Core</span>
            </span>
          </div>
          <p className="text-sm text-[#52525B] font-medium italic">
            “Connect Skills, Opportunities, and Careers.”
          </p>
          <p className="text-xs text-[#71717A] max-w-md leading-relaxed">
            DevCore is an AI-powered single platform connecting ambitious applicants with top organizations. Discover internships, manage career skills, get certified, and hire verified talent.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase text-[#09090B] tracking-wider mb-4">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/find-internships" className="text-[#52525B] hover:text-[#000000] transition-colors">Find Internships</Link></li>
            <li><Link to="/recommended" className="text-[#52525B] hover:text-[#000000] transition-colors">AI Matching</Link></li>
            <li><Link to="/get-certified" className="text-[#52525B] hover:text-[#000000] transition-colors">Get Certified</Link></li>
            <li><Link to="/my-journey" className="text-[#52525B] hover:text-[#000000] transition-colors">My Career Journey</Link></li>
          </ul>
        </div>

        {/* Organizations & Support */}
        <div>
          <h4 className="text-xs font-bold uppercase text-[#09090B] tracking-wider mb-4">Organizations</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/post-internship" className="text-[#52525B] hover:text-[#000000] transition-colors">Post Internship</Link></li>
            <li><Link to="/applications-received" className="text-[#52525B] hover:text-[#000000] transition-colors">Manage Applicants</Link></li>
            <li><Link to="/login" className="text-[#52525B] hover:text-[#000000] transition-colors">Organization Login</Link></li>
            <li><Link to="/signup" className="text-[#52525B] hover:text-[#000000] transition-colors">Register Company</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-[#E4E4E7] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p className="text-[#71717A]">
          © {new Date().getFullYear()} <span className="font-semibold text-[#09090B]">DevCore Platform</span>. Built for Smart India Hackathon Prototype.
        </p>

        <div className="flex items-center gap-4 text-[#71717A]">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#000000] transition-colors">
            <Github className="w-4 h-4" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#000000] transition-colors">
            <Linkedin className="w-4 h-4" />
          </a>
          <a href="mailto:support@devcore.com" className="hover:text-[#000000] transition-colors">
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
