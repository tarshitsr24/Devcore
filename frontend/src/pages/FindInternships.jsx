import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Building2,
  Calendar,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';

export default function FindInternships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [workMode, setWorkMode] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [stipendFilter, setStipendFilter] = useState('All');

  useEffect(() => {
    fetchInternships();
  }, [workMode, stipendFilter]);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.q = searchQuery;
      if (workMode !== 'All') params.workMode = workMode;
      if (locationFilter) params.location = locationFilter;
      if (skillFilter) params.skill = skillFilter;
      if (stipendFilter === 'paid') params.stipend = 'paid';

      const res = await api.get('/internships', { params });
      if (res.data.success) {
        setInternships(res.data.internships);
      }
    } catch (err) {
      console.error('Fetch internships error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInternships();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setWorkMode('All');
    setLocationFilter('');
    setSkillFilter('');
    setStipendFilter('All');
    fetchInternships();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* HEADER & SEARCH BAR */}
      <div className="p-6 sm:p-8 rounded-md bg-white border border-[#E4E4E7] space-y-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#F4F4F5] border border-[#E4E4E7] text-[#18181B] text-xs font-semibold">
            <Search className="w-3.5 h-3.5 text-[#71717A]" />
            <span>Internship Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#09090B] tracking-tight">Find Your Ideal Internship</h1>
          <p className="text-xs sm:text-sm text-[#71717A]">Discover verified opportunities across top engineering, AI, and software domains.</p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, organization, required skills, or keywords..."
              className="w-full pl-10 pr-4 py-2.5 rounded bg-white border border-[#E4E4E7] text-[#09090B] text-xs focus:outline-none focus:border-[#09090B] transition-all placeholder:text-[#A1A1AA]"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded bg-[#09090B] hover:bg-[#27272A] text-white font-bold text-xs shadow-sm transition-all"
          >
            Search
          </button>
        </form>

        {/* Filters Controls */}
        <div className="pt-4 border-t border-[#E4E4E7] grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#71717A] uppercase tracking-wider mb-1">Work Mode</label>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="w-full px-3 py-2 rounded bg-white border border-[#E4E4E7] text-xs text-[#09090B]"
            >
              <option value="All">All Modes</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#71717A] uppercase tracking-wider mb-1">Stipend Filter</label>
            <select
              value={stipendFilter}
              onChange={(e) => setStipendFilter(e.target.value)}
              className="w-full px-3 py-2 rounded bg-white border border-[#E4E4E7] text-xs text-[#09090B]"
            >
              <option value="All">All Internships</option>
              <option value="paid">Paid Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#71717A] uppercase tracking-wider mb-1">Filter by Skill</label>
            <input
              type="text"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              placeholder="e.g. React, Python"
              className="w-full px-3 py-2 rounded bg-white border border-[#E4E4E7] text-xs text-[#09090B]"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={clearFilters}
              className="w-full py-2 rounded bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#09090B] border border-[#E4E4E7] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* MARKETPLACE LISTINGS GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-[#71717A] uppercase tracking-wider">
            Showing {internships.length} Available Opportunities
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-[#71717A]">Searching marketplace for matching posts...</div>
        ) : internships.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-md border border-[#E4E4E7] space-y-3 shadow-sm">
            <p className="text-[#09090B] font-semibold text-sm">No internships match your current search query or filters.</p>
            <p className="text-xs text-[#71717A]">Try resetting filters or searching with broader keywords.</p>
            <button onClick={clearFilters} className="px-4 py-2 rounded bg-[#09090B] hover:bg-[#27272A] text-white text-xs font-bold">
              Show All Internships
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {internships.map((item) => (
              <div
                key={item._id}
                className="p-5 rounded-md bg-white border border-[#E4E4E7] hover:border-[#71717A] transition-all flex flex-col justify-between space-y-4 group shadow-sm"
              >
                {/* Org Logo & Title Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-[#F4F4F5] border border-[#E4E4E7] flex items-center justify-center font-bold text-[#09090B] text-xs overflow-hidden flex-shrink-0">
                        {item.orgLogo ? (
                          <img src={item.orgLogo} alt={item.orgName} className="w-full h-full object-cover" />
                        ) : (
                          item.orgName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#09090B] group-hover:text-[#000000] transition-colors leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#71717A] flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-[#71717A]" />
                          <span>{item.orgName}</span>
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#F4F4F5] text-[#52525B] border border-[#E4E4E7]">
                      {item.workMode}
                    </span>
                  </div>

                  <p className="text-xs text-[#52525B] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#71717A] pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#71717A]" />
                      <span>{item.location}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#71717A]" />
                      <span>{item.duration}</span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#09090B]">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{item.stipend}</span>
                    </span>
                  </div>

                  {/* Skills Required Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.requiredSkills && item.requiredSkills.map((sk, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-[#F4F4F5] text-[#18181B] border border-[#E4E4E7]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-[#E4E4E7] flex items-center justify-between gap-3">
                  <span className="text-[10px] text-[#71717A]">
                    Posted {new Date(item.postedDate).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/internship/${item._id}`}
                      className="px-3 py-1.5 rounded bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#09090B] border border-[#E4E4E7] text-xs font-semibold transition-colors"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/internship/${item._id}`}
                      className="px-3.5 py-1.5 rounded bg-[#09090B] hover:bg-[#27272A] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
