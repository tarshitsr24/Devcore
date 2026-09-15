import React from 'react';
import { Code, Users, Trash2, Edit3 } from 'lucide-react';

export default function SkillBadge({ skill, onEdit, onDelete, showActions = false }) {
  const isTechnical = skill.category === 'Technical';

  const levelColor = {
    Beginner: 'bg-[#F4F4F5] text-[#52525B] border-[#E4E4E7]',
    Intermediate: 'bg-[#F4F4F5] text-[#18181B] border-[#E4E4E7]',
    Advanced: 'bg-[#09090B] text-[#FFFFFF] border-[#09090B]'
  }[skill.level] || 'bg-[#F4F4F5] text-[#52525B] border-[#E4E4E7]';

  return (
    <div className="group flex items-center justify-between gap-3 p-3 rounded bg-white border border-[#E4E4E7] hover:border-[#71717A] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded bg-[#F4F4F5] text-[#09090B] border border-[#E4E4E7]">
          {isTechnical ? <Code className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
        </div>
        <div>
          <h4 className="font-semibold text-xs text-[#09090B]">{skill.name}</h4>
          <span className="text-[10px] text-[#71717A]">{skill.category}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={`text-[11px] px-2 py-0.5 rounded border font-medium ${levelColor}`}>
          {skill.level}
        </span>

        {showActions && (
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={() => onEdit(skill)}
                className="p-1 text-[#71717A] hover:text-[#000000] rounded hover:bg-[#F4F4F5] transition-colors"
                title="Edit Skill"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(skill._id || skill.id)}
                className="p-1 text-[#71717A] hover:text-[#DC2626] rounded hover:bg-[#FEF2F2] transition-colors"
                title="Delete Skill"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
