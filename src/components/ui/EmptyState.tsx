import React from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="bg-slate-800/50 rounded-full p-5 mb-4 text-slate-500">
      {icon ?? <PackageOpen size={32} />}
    </div>
    <h3 className="text-slate-300 font-semibold text-lg mb-1">{title}</h3>
    {description && <p className="text-slate-500 text-sm max-w-sm">{description}</p>}
  </div>
);

export default EmptyState;
