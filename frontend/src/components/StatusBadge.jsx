import React from 'react';
import { Clock, Eye, CheckCircle2, Award, XCircle, FileText, CheckCheck } from 'lucide-react';

export default function StatusBadge({ status }) {
  let badgeStyle = 'bg-[#F4F4F5] text-[#52525B] border-[#E4E4E7]';
  let Icon = Clock;

  switch (status) {
    case 'Applied':
      badgeStyle = 'bg-[#F4F4F5] text-[#18181B] border-[#E4E4E7]';
      Icon = Clock;
      break;
    case 'Under Review':
      badgeStyle = 'bg-[#FEF9C3] text-[#713F12] border-[#FEF08A]';
      Icon = Eye;
      break;
    case 'Shortlisted':
      badgeStyle = 'bg-[#09090B] text-[#FFFFFF] border-[#09090B]';
      Icon = CheckCircle2;
      break;
    case 'Selected':
      badgeStyle = 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]';
      Icon = Award;
      break;
    case 'Rejected':
      badgeStyle = 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]';
      Icon = XCircle;
      break;
    case 'published':
      badgeStyle = 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]';
      Icon = CheckCheck;
      break;
    case 'draft':
      badgeStyle = 'bg-[#F4F4F5] text-[#71717A] border-[#E4E4E7]';
      Icon = FileText;
      break;
    case 'closed':
      badgeStyle = 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]';
      Icon = XCircle;
      break;
    default:
      badgeStyle = 'bg-[#F4F4F5] text-[#52525B] border-[#E4E4E7]';
      Icon = Clock;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium border ${badgeStyle}`}>
      <Icon className="w-3 h-3" />
      <span>{status}</span>
    </span>
  );
}
