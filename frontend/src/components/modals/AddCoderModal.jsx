import { useState } from 'react';
import { X, UserPlus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddCoderModal({ isOpen, onClose, onRefresh, createCoderFn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCoderFn(email, password);
      setEmail(''); setPassword('');
      toast.success("Coder access provisioned successfully");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-slate-800 border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>
        
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <h2 className="text-white font-bold flex items-center gap-2 uppercase text-xs tracking-widest">
            <UserPlus size={16} className="text-brand" /> Provision Coder Access
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Corporate Email Address</label>
            <input 
              type="email" required 
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm focus:ring-1 focus:ring-brand outline-none"
              placeholder="employee@agency.com"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Temporary Password</label>
            <input 
              type="text" required 
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white text-sm focus:ring-1 focus:ring-brand outline-none"
              placeholder="Minimum 8 characters"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-brand text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg shadow-brand/20 hover:scale-[1.01] transition active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Initialize Account"}
          </button>
        </form>
      </div>
    </div>
  );
}