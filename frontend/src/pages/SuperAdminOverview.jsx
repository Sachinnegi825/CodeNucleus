import { useState } from 'react';
import { userService } from '../services/userService';
import { 
  ShieldAlert, 
  Globe, 
  UserCircle, 
  Server, 
  Cpu, 
  Zap, 
  ShieldCheck,
  PlusCircle,
  Building2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SuperAdminOverview() {
  const [form, setForm] = useState({
    orgName: '', subdomain: '', primaryColor: '#3b82f6', adminEmail: '', adminPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleDeploy = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.createAgency(form);
      toast.success(`Agency ${form.orgName} Deployed Successfully!`);
      setForm({ orgName: '', subdomain: '', primaryColor: '#3b82f6', adminEmail: '', adminPassword: '' });
    } catch (err) {
      toast.error(err.message || "Deployment failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-700">
      
      {/* 1. TOP HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-red-500/10 rounded-3xl border border-red-500/20 shadow-lg shadow-red-500/5">
            <ShieldAlert className="text-red-500" size={40} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">System Core</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
              <Server size={14} className="text-red-500/50" /> Global Instance Provisioning Engine
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          
           <div className="px-5 py-2.5 bg-slate-800/50 border border-slate-700 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">API Status</p>
              <p className="text-sm text-emerald-500 font-mono flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Operational
              </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* 2. LEFT COLUMN: PLATFORM CONTEXT & STATS */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white leading-snug">
              Deploying New <br/>
              <span className="text-red-500">Agency Infrastructure</span>
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Initialize fully isolated enterprise instances with dedicated subdomains, custom branding, and administrative root access.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="p-6 bg-slate-800/30 border border-slate-800 rounded-3xl group hover:bg-slate-800/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <Globe className="text-blue-500" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Subdomain Isolation</h4>
                  <p className="text-sm text-slate-500">Automated DNS routing and SSL provisioning for target namespace.</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-800/30 border border-slate-800 rounded-3xl group hover:bg-slate-800/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 group-hover:scale-110 transition-transform">
                  <Cpu className="text-amber-500" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Resource Allocation</h4>
                  <p className="text-sm text-slate-500">Dedicated worker queues and neural pipeline capacity for PHI processing.</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-800/30 border border-slate-800 rounded-3xl group hover:bg-slate-800/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="text-emerald-500" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Zero-Trust Root</h4>
                  <p className="text-sm text-slate-500">Security-first admin provisioning with mandatory encryption-at-rest.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/10 p-6 rounded-3xl relative overflow-hidden">
             <Zap className="absolute -right-4 -bottom-4 text-red-500/5" size={120} />
             <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em] mb-2">Notice</p>
             <p className="text-xs text-slate-400 italic">
               Provisioning actions are logged in the global audit trail. New instances will be active across the edge network within 60 seconds.
             </p>
          </div>
        </div>

        {/* 3. RIGHT COLUMN: THE PROVISIONING FORM */}
        <div className="lg:col-span-7">
          <form onSubmit={handleDeploy} className="bg-slate-800 border border-slate-700 rounded-[2.5rem] shadow-2xl p-8 md:p-10 space-y-10 relative overflow-hidden">
            {/* Form Header Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand/5 blur-3xl pointer-events-none"></div>

            <div className="space-y-8">
              {/* Org Config Section */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-3 text-white font-bold uppercase text-xs tracking-[0.3em]">
                  <Building2 size={16} className="text-red-500" /> Organization Metadata
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Agency Legal Name</label>
                    <input 
                      type="text" placeholder="e.g. Apollo Medical" 
                      className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-slate-600"
                      value={form.orgName} onChange={e => setForm({...form, orgName: e.target.value})} required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Namespace (Subdomain)</label>
                    <div className="relative">
                      <input 
                        type="text" placeholder="apollo" 
                        className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-slate-600 pr-24"
                        value={form.subdomain} onChange={e => setForm({...form, subdomain: e.target.value})} required
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-500 uppercase">.cn.com</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Brand Accent</label>
                    <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 p-2.5 rounded-2xl h-[58px]">
                      <input 
                        type="color" 
                        className="w-10 h-full bg-transparent border-none cursor-pointer rounded-lg"
                        value={form.primaryColor} onChange={e => setForm({...form, primaryColor: e.target.value})}
                      />
                      <span className="text-xs font-mono text-slate-400 uppercase">{form.primaryColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Config Section */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-3 text-white font-bold uppercase text-xs tracking-[0.3em]">
                  <UserCircle size={16} className="text-red-500" /> Root Administrator
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Admin Identity (Email)</label>
                    <input 
                      type="email" placeholder="admin@apollo.com" 
                      className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-slate-600"
                      value={form.adminEmail} onChange={e => setForm({...form, adminEmail: e.target.value})} required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Emergency Root Password</label>
                    <input 
                      type="password" placeholder="••••••••" 
                      className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-slate-600"
                      value={form.adminPassword} onChange={e => setForm({...form, adminPassword: e.target.value})} required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                disabled={loading}
                className="w-full bg-red-600 text-white py-5 rounded-2xl font-bold shadow-xl shadow-red-900/20 hover:bg-red-500 hover:scale-[1.01] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer group"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={20} /> Provisioning Resources...</>
                ) : (
                  <>
                    <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                    Initialize Agency Instance
                  </>
                )}
              </button>
              <p className="text-center text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-6 font-bold">
                Proprietary Extraction Engine v4.0 Active
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Minimal Loader for the button
function Loader2({ className, size }) {
  return (
    <svg 
      className={`animate-spin ${className}`} 
      width={size} height={size} 
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
