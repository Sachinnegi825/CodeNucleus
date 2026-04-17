import { Activity } from 'lucide-react';

export default function StatsCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl shadow-xl relative overflow-hidden group hover:border-slate-500 transition-all">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        {Icon ? <Icon size={40} /> : <Activity size={40} />}
      </div>
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{label}</p>
      <h3 className="text-3xl font-bold text-white mt-2 tracking-tight">{value}</h3>
    </div>
  );
}