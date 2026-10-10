import React from 'react';
import { CalendarX } from 'lucide-react';

const EmptyState = ({ 
  title = 'No items found', 
  description = 'There are currently no records matching your criteria.',
  icon: Icon = CalendarX,
  actionText,
  onAction 
}) => {
  return (
    <div className="glass-card p-12 rounded-2xl text-center flex flex-col items-center justify-center my-6 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4 shadow-lg">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
      <p className="text-sm text-slate-400 max-w-xs mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md hover:shadow-indigo-500/25"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
