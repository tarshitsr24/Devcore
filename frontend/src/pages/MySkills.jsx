import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SkillBadge from '../components/SkillBadge';
import Modal from '../components/Modal';
import { Award, Plus, Code, Users, CheckCircle2, AlertCircle } from 'lucide-react';

export default function MySkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Technical');
  const [level, setLevel] = useState('Intermediate');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await api.get('/skills');
      if (res.data.success) {
        setSkills(res.data.skills);
      }
    } catch (err) {
      console.error('Fetch skills error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingSkill(null);
    setName('');
    setCategory('Technical');
    setLevel('Intermediate');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setName(skill.name);
    setCategory(skill.category);
    setLevel(skill.level);
    setError('');
    setIsModalOpen(true);
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!name.trim()) {
      setError('Skill name is required.');
      return;
    }

    try {
      if (editingSkill) {
        // Edit existing skill
        const res = await api.put(`/skills/${editingSkill._id}`, { name, category, level });
        if (res.data.success) {
          setMessage('Skill updated successfully!');
          setIsModalOpen(false);
          fetchSkills();
        }
      } else {
        // Add new skill
        const res = await api.post('/skills', { name, category, level });
        if (res.data.success) {
          setMessage('Skill added successfully!');
          setIsModalOpen(false);
          fetchSkills();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving skill.');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to remove this skill?')) return;
    try {
      const res = await api.delete(`/skills/${skillId}`);
      if (res.data.success) {
        setMessage('Skill deleted successfully!');
        fetchSkills();
      }
    } catch (err) {
      console.error('Delete skill error:', err);
    }
  };

  // Quick preset skills shortcuts
  const presetSkills = [
    { name: 'Python', category: 'Technical' },
    { name: 'JavaScript', category: 'Technical' },
    { name: 'React', category: 'Technical' },
    { name: 'Node.js', category: 'Technical' },
    { name: 'SQL', category: 'Technical' },
    { name: 'MongoDB', category: 'Technical' },
    { name: 'Communication', category: 'Soft Skill' },
    { name: 'Teamwork', category: 'Soft Skill' },
    { name: 'Leadership', category: 'Soft Skill' },
    { name: 'Problem-solving', category: 'Soft Skill' }
  ];

  const handleQuickAddPreset = async (preset) => {
    try {
      await api.post('/skills', { name: preset.name, category: preset.category, level: 'Intermediate' });
      fetchSkills();
    } catch (err) {
      // Ignored if already added
    }
  };

  const technicalSkills = skills.filter(s => s.category === 'Technical');
  const softSkills = skills.filter(s => s.category === 'Soft Skill');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* PAGE HEADER */}
      <div className="p-6 sm:p-8 rounded-md bg-white border border-[#E4E4E7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#F4F4F5] border border-[#E4E4E7] text-[#09090B] text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-[#71717A]" />
            <span>Dedicated Skill Manager</span>
          </div>
          <h1 className="text-2xl font-bold text-[#09090B]">My Skills & Expertise</h1>
          <p className="text-xs text-[#71717A]">Manage technical & soft skills for real-time AI internship matching</p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-md bg-[#09090B] hover:bg-black text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add New Skill</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* QUICK PRESETS PICKER */}
      <div className="p-5 rounded-md bg-white border border-[#E4E4E7] space-y-3">
        <p className="text-xs font-bold text-[#52525B] uppercase tracking-wider">Quick One-Click Popular Skill Presets:</p>
        <div className="flex flex-wrap gap-2">
          {presetSkills.map((preset, idx) => {
            const isAdded = skills.some(s => s.name.toLowerCase() === preset.name.toLowerCase());
            return (
              <button
                key={idx}
                onClick={() => !isAdded && handleQuickAddPreset(preset)}
                disabled={isAdded}
                className={`text-xs px-3 py-1.5 rounded border font-medium transition-all ${
                  isAdded
                    ? 'bg-[#F4F4F5] text-[#A1A1AA] border-[#E4E4E7] cursor-not-allowed'
                    : 'bg-[#FAFAFA] hover:bg-[#F4F4F5] text-[#09090B] border-[#E4E4E7]'
                }`}
              >
                {isAdded ? `✓ ${preset.name}` : `+ ${preset.name}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* SKILLS SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* TECHNICAL SKILLS */}
        <div className="p-6 rounded-md bg-white border border-[#E4E4E7] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E4E4E7] pb-3">
            <Code className="w-5 h-5 text-[#71717A]" />
            <h2 className="text-base font-bold text-[#09090B]">Technical Skills ({technicalSkills.length})</h2>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-[#71717A]">Loading skills...</div>
          ) : technicalSkills.length === 0 ? (
            <p className="text-xs text-[#71717A] italic py-6 text-center">No technical skills added yet.</p>
          ) : (
            <div className="space-y-3">
              {technicalSkills.map((skill) => (
                <SkillBadge
                  key={skill._id}
                  skill={skill}
                  onEdit={openEditModal}
                  onDelete={handleDeleteSkill}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* SOFT SKILLS */}
        <div className="p-6 rounded-md bg-white border border-[#E4E4E7] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E4E4E7] pb-3">
            <Users className="w-5 h-5 text-[#71717A]" />
            <h2 className="text-base font-bold text-[#09090B]">Soft Skills & Leadership ({softSkills.length})</h2>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-[#71717A]">Loading skills...</div>
          ) : softSkills.length === 0 ? (
            <p className="text-xs text-[#71717A] italic py-6 text-center">No soft skills added yet.</p>
          ) : (
            <div className="space-y-3">
              {softSkills.map((skill) => (
                <SkillBadge
                  key={skill._id}
                  skill={skill}
                  onEdit={openEditModal}
                  onDelete={handleDeleteSkill}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ADD/EDIT SKILL MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? 'Edit Skill Level' : 'Add New Skill'}
      >
        <form onSubmit={handleSaveSkill} className="space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#52525B]">Skill Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Python, React, Communication"
              className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] placeholder:text-[#A1A1AA] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#52525B]">Skill Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
              >
                <option value="Technical">Technical Skill</option>
                <option value="Soft Skill">Soft Skill</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#52525B]">Proficiency Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] text-sm focus:bg-white focus:border-[#09090B] focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E4E4E7]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-md bg-white hover:bg-[#F4F4F5] text-[#71717A] text-xs font-semibold border border-[#E4E4E7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-[#09090B] hover:bg-black text-white text-xs font-semibold shadow-sm"
            >
              {editingSkill ? 'Update Skill' : 'Add Skill'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
