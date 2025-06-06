
// /components/StatusBadge.tsx

import React from 'react';

interface Props {
  status: string;
}

const statusMap: Record<string, { class: string; label: string }> = {
  'not-started': { class: 'bg-gray-500', label: 'Not Started' },
  'in-progress': { class: 'bg-blue-500', label: 'In Progress' },
  'finished-phase1': { class: 'bg-teal-500', label: 'Phase 1 Completed' },
  'finished': { class: 'bg-green-500', label: 'Completed' },
  'failed': { class: 'bg-red-500', label: 'Failed' },
};

export default function StatusBadge({ status }: Props) {
  const statusInfo = statusMap[status] || { class: 'bg-gray-500', label: status };

  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${statusInfo.class}`}
      style={{
        minWidth: '120px',   // Fixed width based on biggest text (adjust as needed)
        textAlign: 'center',
        display: 'inline-block',
      }}
    >
      {statusInfo.label}
    </span>
  );
}
