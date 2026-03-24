import { BarChart3, TrendingUp } from 'lucide-react';

export default function CoderAnalytics() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">My Performance</h1>
        <p className="text-slate-400 mt-1">AI Acceptance rate and turnaround time metrics.</p>
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-10 flex flex-col items-center justify-center text-center h-96 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 border border-slate-700">
          <BarChart3 className="text-slate-500" size={32} />
        </div>
        <h3 className="text-white font-bold text-lg mb-2">Analytics Engine Offline</h3>
        <p className="text-slate-400 text-sm max-w-sm">Performance metrics will be generated once you have coded a minimum of 10 encounters.</p>
      </div>
    </div>
  );
}