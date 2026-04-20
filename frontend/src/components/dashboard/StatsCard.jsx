import { Activity } from 'lucide-react';

export default function StatsCard({ label, value, icon: Icon, color = "text-brand", bg }) {
  // If bg is not provided, try to derive it from color text (e.g., text-blue-500 -> bg-blue-500/10)
  // This is a bit hacky with Tailwind, so we prefer passing bg explicitly if possible.
  // Default fallback bg is brand/10
  const iconBg = bg || (color.replace('text-', 'bg-') + '/10');

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl relative overflow-hidden group hover:border-slate-500 transition-all duration-300">
      {/* Side Border Accent */}
      <div className={`absolute top-0 left-0 w-1 h-full bg-brand opacity-20 group-hover:opacity-100 transition-opacity duration-500 ${color.replace('text-', 'bg-')}`}></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{label}</p>
          <h3 className="text-3xl font-bold text-white mt-2 tracking-tight transition-transform group-hover:scale-105 origin-left duration-300">
            {value}
          </h3>
        </div>
        
        <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg ${iconBg}`}>
          {Icon ? (
            <Icon className={`${color} transition-colors`} size={22} />
          ) : (
            <Activity className={`${color} transition-colors`} size={22} />
          )}
        </div>
      </div>

      {/* Subtle Glow Effect on Hover */}
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none ${color.replace('text-', 'bg-')}`}></div>
    </div>
  );
}