import { useEffect, useState } from 'react';
import { encounterService } from '../services/encounterService';
import { BarChart3, CheckCircle2, Clock, Zap, Target } from 'lucide-react';

export default function CoderAnalytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await encounterService.getCoderStats();
      setStats(data);
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="p-10 text-slate-500 animate-pulse">Calculating metrics...</div>;

  const cards = [
    { label: 'Total Encounters', value: stats.totalUploaded, icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Completion Rate', value: `${Math.round((stats.completed / stats.totalUploaded) * 100) || 0}%`, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Avg AI Confidence', value: `${Math.round(stats.avgConfidence * 100)}%`, icon: Target, color: 'text-brand', bg: 'bg-brand/10' },
    { label: 'Pending Queue', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Personal Performance</h1>
        <p className="text-slate-400 mt-1">Real-time insights into your medical coding efficiency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-brand opacity-20"></div>
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{card.label}</p>
                 <h3 className="text-3xl font-bold text-white mt-2">{card.value}</h3>
               </div>
               <div className={`p-3 rounded-xl ${card.bg}`}>
                 <card.icon className={card.color} size={20} />
               </div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
           <BarChart3 size={48} className="text-slate-700" />
           <h4 className="text-white font-bold">Productivity Timeline</h4>
           <p className="text-slate-500 text-sm max-w-sm">Detailed day-by-day charts will be available once you reach 50 completed claims.</p>
        </div>
        
        <div className="bg-brand/5 border border-brand/20 p-8 rounded-3xl">
           <h4 className="text-brand font-bold text-sm uppercase tracking-widest mb-4">Coder Tip</h4>
           <p className="text-slate-300 text-sm leading-relaxed italic">
             "Using the 'Scrub PHI' feature before running AI analysis improves ICD-10 extraction accuracy by 14% by reducing clinical noise."
           </p>
        </div>
      </div>
    </div>
  );
}