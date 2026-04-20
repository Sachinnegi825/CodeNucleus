import { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddRuleModal({ isOpen, onClose, onRefresh, createRuleFn }) {
  const [formData, setFormData] = useState({ payerName: '', ruleCode: '', requirement: '', severity: 'warning' });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createRuleFn(formData);
      setFormData({ payerName: '', ruleCode: '', requirement: '', severity: 'warning' });
      toast.success("Business rule activated successfully");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error("Error deploying rule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-slate-800 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>
        
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
           <h2 className="text-white font-bold flex items-center gap-2 uppercase text-xs tracking-widest">
              <Plus size={16} className="text-brand" /> Provision Denial Logic
           </h2>
           <button onClick={onClose} className="text-slate-500 hover:text-white transition cursor-pointer">
              <X size={20} />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
           <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Insurance Payer Name</label>
              <input required className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm focus:ring-1 focus:ring-brand outline-none"
                placeholder="e.g. Medicare Part B" value={formData.payerName} onChange={e => setFormData({...formData, payerName: e.target.value})} />
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Medical Code (ICD/CPT)</label>
                <input required className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm font-mono focus:ring-1 focus:ring-brand outline-none uppercase"
                  placeholder="99214" value={formData.ruleCode} onChange={e => setFormData({...formData, ruleCode: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Severity Level</label>
                <select className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm focus:ring-1 focus:ring-brand outline-none cursor-pointer"
                  value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value})}>
                   <option value="warning">Yellow (Reminder)</option>
                   <option value="error">Red (Hard Denial Risk)</option>
                </select>
              </div>
           </div>
           <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Instruction for Coder</label>
              <textarea required rows={3} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm focus:ring-1 focus:ring-brand outline-none"
                placeholder="Describe what the coder must verify..." value={formData.requirement} onChange={e => setFormData({...formData, requirement: e.target.value})} />
           </div>
           <button disabled={loading} className="w-full bg-brand text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg shadow-brand/20 hover:scale-[1.01] transition active:scale-95 mt-4 cursor-pointer flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={16} /> : "Activate Business Rule"}
           </button>
        </form>
      </div>
    </div>
  );
}