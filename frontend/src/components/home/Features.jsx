import { Palette, BookOpen, UserCheck } from 'lucide-react';

export default function Features() {
  return (
    <div id="infrastructure" className="py-12 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="md:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 rounded-[2rem] p-8 md:p-10 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-[80px]"></div>
           <Palette className="text-brand mb-6" size={32} />
           <h3 className="text-2xl font-bold text-white mb-3">Native White-Labeling</h3>
           <p className="text-zinc-400 text-sm leading-relaxed max-w-md">Your brand, your software. Upload your agency logo and set your accent colors. Coders authenticate into a workspace that looks entirely proprietary to your company.</p>
        </div>

        <div className="bg-slate-800/40 border border-white/5 rounded-[2rem] p-8 relative overflow-hidden">
           <BookOpen className="text-indigo-400 mb-6" size={32} />
           <h3 className="text-lg font-bold text-white mb-3">Denial Intelligence</h3>
           <p className="text-zinc-500 text-xs leading-relaxed">Embed custom payer rules. Prevent coding errors before they hit the clearinghouse with real-time UI warnings.</p>
        </div>

        <div className="bg-slate-800/40 border border-white/5 rounded-[2rem] p-8 relative overflow-hidden">
           <UserCheck className="text-emerald-500 mb-6" size={32} />
           <h3 className="text-lg font-bold text-white mb-3">QA Automation</h3>
           <p className="text-zinc-500 text-xs leading-relaxed">Enforce strict Admin approvals. Junior coders submit records, Senior Admins verify, purge data, and export.</p>
        </div>

        <div id="compliance" className="md:col-span-2 bg-slate-800/30 border border-white/5 rounded-[2rem] p-8 md:p-10 flex flex-col justify-center items-center text-center">
           <h3 className="text-2xl font-bold text-white mb-2">Immutable Audit Trails</h3>
           <p className="text-zinc-500 text-sm max-w-lg">Every login, every PHI scrub, and every export is timestamped and cryptographically secured in the dashboard. Be 100% prepared for your next HIPAA audit.</p>
        </div>

      </div>
    </div>
  );
}