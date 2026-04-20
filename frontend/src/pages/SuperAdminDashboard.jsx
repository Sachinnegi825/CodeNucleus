import { useState } from 'react';
import { userService } from '../services/userService';
import { ShieldAlert, Globe, Palette, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SuperAdminDashboard() {
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
    <div className="max-w-5xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex items-center gap-4 mt-5 border-b border-slate-800 pb-6">
        <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
          <ShieldAlert className="text-red-500" size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">SuperAdmin Portal</h1>
          <p className="text-slate-500 text-sm">Global Agency Provisioning & Instance Management</p>
        </div>
      </div>

      <form onSubmit={handleDeploy} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Agency Config */}
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl space-y-6">
          <h2 className="flex items-center gap-2 text-white font-bold uppercase text-xs tracking-[0.2em] mb-4">
            <Globe size={16} className="text-brand" /> Organization Metadata
          </h2>
          <div className="space-y-4">
            <input 
              type="text" placeholder="Agency Name (e.g. Apollo Coding)" 
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white focus:ring-1 focus:ring-brand"
              value={form.orgName} onChange={e => setForm({...form, orgName: e.target.value})} required
            />
            <input 
              type="text" placeholder="Subdomain (e.g. apollo)" 
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white focus:ring-1 focus:ring-brand"
              value={form.subdomain} onChange={e => setForm({...form, subdomain: e.target.value})} required
            />
            
          </div>

 <h2 className="flex items-center gap-2 text-white font-bold uppercase text-xs tracking-[0.2em] mb-4">
            <UserCircle size={16} className="text-brand" /> Master Admin Credentials
          </h2>
          <div className="space-y-4">
            <input 
              type="email" placeholder="Admin Email" 
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white focus:ring-1 focus:ring-brand"
              value={form.adminEmail} onChange={e => setForm({...form, adminEmail: e.target.value})} required
            />
            <input 
              type="password" placeholder="Master Password" 
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white focus:ring-1 focus:ring-brand"
              value={form.adminPassword} onChange={e => setForm({...form, adminPassword: e.target.value})} required
            />
            <button 
              disabled={loading}
              className="w-full bg-brand text-white py-4 rounded-xl font-bold shadow-lg shadow-brand/20 hover:scale-[1.02] transition active:scale-95 disabled:opacity-50"
            >
              {loading ? "Deploying Instance..." : "Initialize Agency Instance"}
            </button>
          </div>
        </div>

       
      </form>
    </div>
  );
}