import React from 'react';
import { BrainCircuit, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const mockData = [
  { name: 'Mon', LLM: 98.2 },
  { name: 'Tue', LLM: 98.1 },
  { name: 'Wed', LLM: 98.5 },
  { name: 'Thu', LLM: 97.9 },
  { name: 'Fri', LLM: 98.6 },
  { name: 'Sat', LLM: 99.0 },
  { name: 'Sun', LLM: 98.8 },
];

export default function SuperAdminApiMetrics() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="text-red-500" size={28} />
            Global API Accuracy Metrics
          </h1>
          <p className="text-slate-400 mt-1">
            Track unified LLM extraction performance, latency, and accuracy across the platform.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <Activity className="text-red-500" size={24} />
            </div>
            <div>
              <h3 className="text-slate-400 text-sm font-medium">Average Extraction Latency</h3>
              <p className="text-2xl font-bold text-white mt-1">340ms</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <BrainCircuit className="text-green-500" size={24} />
            </div>
            <div>
              <h3 className="text-slate-400 text-sm font-medium">Global AI Accuracy</h3>
              <p className="text-2xl font-bold text-white mt-1">98.4%</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <BrainCircuit className="text-blue-500" size={24} />
            </div>
            <div>
              <h3 className="text-slate-400 text-sm font-medium">Total API Calls (24h)</h3>
              <p className="text-2xl font-bold text-white mt-1">1.2M</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 mt-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BrainCircuit size={20} className="text-slate-400" />
            Model Accuracy Trends (7 Days)
          </h3>
          <p className="text-sm text-slate-500">Comparison of LLM extraction accuracy across all global claims.</p>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={mockData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorLLM" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
              <YAxis domain={['dataMin - 1', 100]} stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '0.5rem' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }}/>
              <Area type="monotone" dataKey="LLM" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorLLM)" name="Unified LLM Engine" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
