import { useEffect, useState } from 'react';
import { encounterService } from '../services/encounterService';
import { BarChart3, CheckCircle2, Clock, Zap, Target } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';

export default function CoderAnalytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await encounterService.getCoderStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-4">
      <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em]">Calculating Performance Metrics...</p>
    </div>
  );

  const cards = [
    { label: 'Total Encounters', value: stats?.totalUploaded || 0, icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Completion Rate', value: `${Math.round(((stats?.completed || 0) / (stats?.totalUploaded || 1)) * 100) || 0}%`, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Avg AI Confidence', value: `${Math.round((stats?.avgConfidence || 0) * 100)}%`, icon: Target, color: 'text-brand', bg: 'bg-brand/10' },
    { label: 'Pending Queue', value: stats?.pending || 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Personal Performance</h1>
        <p className="text-slate-400 mt-1">Real-time insights into your medical coding efficiency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(cards || []).map((card) => (
          <StatsCard 
            key={card?.label || Math.random()}
            label={card?.label || 'Metric'}
            value={card?.value || 0}
            icon={card?.icon || Zap}
            color={card?.color || 'text-slate-500'}
            bg={card?.bg || 'bg-slate-500/10'}
          />
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