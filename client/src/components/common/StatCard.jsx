import React from 'react';

const StatCard = ({ title, value, icon: Icon, change, color = 'indigo', subtitle }) => {
  const colorMap = {
    indigo: 'from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30',
    emerald: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30',
    rose: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30',
    purple: 'from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/30',
    cyan: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30'
  };

  return (
    <div className="glass-card glass-card-hover p-6 rounded-2xl relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-extrabold text-white mt-1 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          {change && (
            <span className="inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              {change}
            </span>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} border flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
