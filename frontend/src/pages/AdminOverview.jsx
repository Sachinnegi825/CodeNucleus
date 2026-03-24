import { Users, FileText, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminOverview() {
  const stats = [
    { label: 'Total Employees', value: '12', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Files Processed', value: '842', icon: FileText, color: 'text-brand', bg: 'bg-brand/10' },
    { label: 'Avg. Accuracy', value: '96.4%', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Executive Dashboard</h1>
        <p className="text-slate-400 mt-1">Real-time metrics for your agency coding operations.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item) => (
          <div key={item.label} className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl hover:border-slate-600 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{item.label}</p>
                <h3 className="text-3xl font-bold text-white mt-2">{item.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${item.bg}`}>
                <item.icon className={item.color} size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-500">
              <TrendingUp size={14} />
              <span>+12.5% from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Layout: Info & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl border-dashed flex flex-col items-center justify-center text-center">
          <AlertCircle className="text-slate-600 mb-4" size={48} />
          <h4 className="text-white font-bold italic">Audit Logs Ready</h4>
          <p className="text-slate-500 text-sm mt-2 max-w-xs">Detailed compliance logs will appear here as your coders begin processing medical records.</p>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
          <h3 className="text-white font-bold mb-4 border-b border-slate-700 pb-3">Quick Actions</h3>
          <div className="space-y-3">
             <button className="w-full text-left p-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-brand transition text-sm">Generate HIPAA Report</button>
             <button className="w-full text-left p-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-brand transition text-sm">Review AI Performance</button>
             <button className="w-full text-left p-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-brand transition text-sm">Export Billing Data</button>
          </div>
        </div>
      </div>
    </div>
  );
}