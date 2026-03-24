import { History, CheckCircle2 } from 'lucide-react';

export default function CoderHistory() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Completed Claims</h1>
        <p className="text-slate-400 mt-1">History of all encounters you have successfully coded and exported.</p>
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-10 flex flex-col items-center justify-center text-center h-96 shadow-xl">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 border border-slate-700">
          <History className="text-slate-500" size={32} />
        </div>
        <h3 className="text-white font-bold text-lg mb-2">No History Yet</h3>
        <p className="text-slate-400 text-sm max-w-sm">Once you process and approve your first medical record using the AI engine, it will appear here for audit purposes.</p>
      </div>
    </div>
  );
}