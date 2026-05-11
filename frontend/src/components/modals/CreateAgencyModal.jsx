import { useState } from 'react';
import { X, Building2, UserCircle, Globe, PlusCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateAgencyModal({ isOpen, onClose, onRefresh, createAgencyFn }) {
  const [form, setForm] = useState({
    orgName: '', subdomain: '', primaryColor: '#3b82f6', adminEmail: '', adminPassword: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAgencyFn(form);
      toast.success(`Agency ${form.orgName} Deployed Successfully!`);
      setForm({ orgName: '', subdomain: '', primaryColor: '#3b82f6', adminEmail: '', adminPassword: '' });
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.message || "Deployment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="relative bg-slate-800 border border-slate-700 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600"></div>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/50">
          <h2 className="text-white font-bold flex items-center gap-2 uppercase text-xs tracking-[0.3em]">
            <Building2 size={16} className="text-red-500" /> Provision New Agency Instance
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          <div className="space-y-8">
            {/* 1. Organization Metadata */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-3 text-white font-bold uppercase text-[10px] tracking-[0.2em]">
                <Globe size={14} className="text-red-500" /> Organization Metadata
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Agency Legal Name</label>
                  <input 
                    type="text" placeholder="e.g. Apollo Medical" 
                    className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white text-sm focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-slate-700"
                    value={form.orgName} onChange={e => setForm({...form, orgName: e.target.value})} required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Namespace (Subdomain)</label>
                  <div className="relative">
                    <input 
                      type="text" placeholder="apollo" 
                      className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white text-sm focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-slate-700 pr-24"
                      value={form.subdomain} onChange={e => setForm({...form, subdomain: e.target.value})} required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-500 uppercase">.cn.com</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Brand Accent Color</label>
                  <div className="relative group">
                    <input 
                      type="color" 
                      id="colorPicker"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={form.primaryColor} 
                      onChange={e => setForm({...form, primaryColor: e.target.value})}
                    />
                    <div 
                      className="h-[60px] w-full bg-slate-900 rounded-2xl border border-slate-700 flex items-center justify-between px-6 transition-all group-hover:border-slate-500 shadow-lg"
                    >
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-[0.2em] font-bold">{form.primaryColor}</span>
                      <div 
                        className="w-10 h-10 rounded-xl shadow-2xl border-2 border-white/20 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: form.primaryColor }}
                      ></div>
                    </div>

                  </div>
                </div>

                <div className="flex items-end pb-1">
                   <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold leading-relaxed italic">
                     Click the hex code or the color box to open the system palette and define the agency's primary brand accent.
                   </p>
                </div>
              </div>


            </div>

            {/* 2. Admin Credentials */}
            <div className="space-y-6 pt-4 border-t border-slate-700/30">
              <h3 className="flex items-center gap-3 text-white font-bold uppercase text-[10px] tracking-[0.2em]">
                <UserCircle size={14} className="text-red-500" /> Root Administrator
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Admin Identity (Email)</label>
                  <input 
                    type="email" placeholder="admin@apollo.com" 
                    className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white text-sm focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-slate-700"
                    value={form.adminEmail} onChange={e => setForm({...form, adminEmail: e.target.value})} required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Emergency Root Password</label>
                  <input 
                    type="password" placeholder="••••••••" 
                    className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white text-sm focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-slate-700"
                    value={form.adminPassword} onChange={e => setForm({...form, adminPassword: e.target.value})} required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button 
              disabled={loading}
              className="w-full bg-red-600 text-white py-5 rounded-2xl font-bold shadow-xl shadow-red-900/30 hover:bg-red-500 hover:scale-[1.01] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer group"
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
          </div>
        </form>
      </div>
    </div>
  );
}
