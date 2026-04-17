import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';

export default function ProductivityChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl bg-slate-900/50">
        <BarChart3 className="text-slate-700 mb-2" size={40} />
        <p className="text-slate-500 text-sm font-medium">No activity data for the last 7 days.</p>
        <p className="text-slate-600 text-xs">Start processing records to see analytics.</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
          <Area type="monotone" dataKey="records" stroke="#3b82f6" strokeWidth={3} fill="url(#colorRec)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}