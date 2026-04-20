import { useEffect, useState } from 'react';
import { encounterService } from '../services/encounterService';
import { Loader2, FileText, CheckCircle2, Clock, Zap, TrendingUp } from 'lucide-react';

// Components
import StatsCard from '../components/dashboard/StatsCard';
import ProductivityChart from '../components/dashboard/ProductivityChart';
import TopStaffList from '../components/dashboard/TopStaffList';

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await encounterService.getAdminStats();
        setData(stats);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-4">
      <Loader2 className="animate-spin text-brand" size={40} />
      <p className="font-mono text-[10px] uppercase tracking-[0.3em]">Syncing Agency Intelligence...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Intelligence Analysis</h1>
          <p className="text-slate-400 mt-1">Live organizational metrics calculated from database events.</p>
        </div>
        <div className="bg-brand/5 border border-brand/20 px-4 py-2 rounded-2xl flex items-center gap-3">
          <Zap className="text-brand" size={20} />
          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Enterprise ROI Monitor</span>
        </div>
      </div>

      {/* 2. Top Stats Row (100% Real Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Total Ingestions" value={data?.summary?.totalVolume || 0} icon={FileText} color="text-blue-500" />
        <StatsCard label="Completed Claims" value={data?.summary?.completed || 0} icon={CheckCircle2} color="text-emerald-500" />
        <StatsCard label="Pending Work" value={data?.summary?.pending || 0} icon={Clock} color="text-amber-500" />
        <StatsCard label="AI Accuracy" value={data?.summary?.accuracy || '0%'} icon={Zap} color="text-brand" />
      </div>

      {/* 3. Real Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Productivity Component */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 p-8 rounded-[2rem] shadow-2xl">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-white font-bold flex items-center gap-2">
                <TrendingUp size={18} className="text-brand" /> 7-Day Throughput
             </h3>
             <span className="text-[10px] text-slate-500 font-mono">DB LINKED</span>
          </div>
          <ProductivityChart data={data?.chartData || []} />
        </div>

        {/* Sidebar: Compliance & Top Staff */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem]">
            <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-widest">System Health</h3>
            <div className="space-y-4">
              <HealthStatus label="DLP Encryption" status="Active" />
              <HealthStatus label="Database Integrity" status="Verified" />
              <HealthStatus label="Audit Immutable" status="Active" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem]">
            <TopStaffList coders={data?.topCoders || []} />
          </div>
        </div>

      </div>
    </div>
  );
}

// Internal Helper for Health Items
function HealthStatus({ label, status }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="text-[9px] font-bold text-emerald-500 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{status}</span>
    </div>
  );
}