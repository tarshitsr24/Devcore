import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { Briefcase, Edit3, Trash2, PlusCircle, Users, CheckCircle2, Eye, Calendar } from 'lucide-react';

export default function MyInternships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyInternships();
  }, []);

  const fetchMyInternships = async () => {
    setLoading(true);
    try {
      const res = await api.get('/internships/organization/my-posts');
      if (res.data.success) {
        setInternships(res.data.internships);
      }
    } catch (err) {
      console.error('Fetch my internships error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'published' ? 'closed' : 'published';
    try {
      const res = await api.patch(`/internships/${id}/status`, { status: nextStatus });
      if (res.data.success) {
        fetchMyInternships();
      }
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this internship post?')) return;
    try {
      const res = await api.delete(`/internships/${id}`);
      if (res.data.success) {
        fetchMyInternships();
      }
    } catch (err) {
      console.error('Delete post error:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER */}
      <div className="p-6 sm:p-8 rounded-md bg-white border border-[#E4E4E7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#F4F4F5] border border-[#E4E4E7] text-[#09090B] text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5 text-[#71717A]" />
            <span>Recruiter Postings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#09090B]">My Internship Posts</h1>
          <p className="text-xs sm:text-sm text-[#71717A]">Manage published opportunities, drafts, and status toggles.</p>
        </div>

        <Link
          to="/post-internship"
          className="px-4 py-2.5 rounded-md bg-[#09090B] hover:bg-black text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-all"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          <span>Post New Internship</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-[#71717A]">Loading internship posts...</div>
      ) : internships.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-md border border-[#E4E4E7] space-y-3">
          <p className="text-[#09090B] font-semibold text-base">You haven't posted any internships yet.</p>
          <Link to="/post-internship" className="inline-block px-5 py-2.5 rounded-md bg-[#09090B] text-white font-semibold text-xs shadow-sm">
            Create First Internship Post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {internships.map((item) => (
            <div
              key={item._id}
              className="p-6 rounded-md bg-white border border-[#E4E4E7] hover:border-[#D4D4D8] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-[#09090B]">{item.title}</h3>
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-xs text-[#71717A]">
                  {item.location} ({item.workMode}) • Stipend: {item.stipend} • Duration: {item.duration}
                </p>
                <p className="text-[11px] text-[#A1A1AA]">
                  Posted on {new Date(item.postedDate).toLocaleDateString()} • {item.openings} Openings
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusToggle(item._id, item.status)}
                  className="px-3 py-1.5 rounded-md bg-white hover:bg-[#F4F4F5] text-[#09090B] border border-[#E4E4E7] text-xs font-semibold shadow-sm"
                >
                  {item.status === 'published' ? 'Close Post' : 'Publish Post'}
                </button>

                <Link
                  to={`/applications-received?internshipId=${item._id}`}
                  className="px-3 py-1.5 rounded-md bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#09090B] border border-[#E4E4E7] text-xs font-semibold flex items-center gap-1 shadow-sm"
                >
                  <Users className="w-3.5 h-3.5 text-[#71717A]" />
                  <span>Applications</span>
                </Link>

                <Link
                  to={`/edit-internship/${item._id}`}
                  className="p-1.5 text-[#71717A] hover:text-[#09090B] rounded hover:bg-[#F4F4F5]"
                  title="Edit Post"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-1.5 text-[#71717A] hover:text-rose-600 rounded hover:bg-rose-50"
                  title="Delete Post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
