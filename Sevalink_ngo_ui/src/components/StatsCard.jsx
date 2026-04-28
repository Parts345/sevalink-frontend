import React from 'react';

const StatsCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5">
    <div className={`p-4 ${color} rounded-2xl`}>{icon}</div>
    <div>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">{title}</p>
      <p className="text-3xl font-extrabold text-slate-900">{value}</p>
    </div>
  </div>
);

export default StatsCard;