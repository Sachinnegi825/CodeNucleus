import { X, AlertTriangle, Loader2 } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  type = "danger", // 'danger' or 'success'
  loading = false 
}) {
  if (!isOpen) return null;

  const colorClass = type === "danger" ? "bg-red-600 hover:bg-red-500 shadow-red-900/20" : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-slate-800 border border-slate-700 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className={`absolute top-0 left-0 w-full h-1 ${type === 'danger' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
        
        <div className="p-6 text-center">
          <div className={`mx-auto w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
            <AlertTriangle size={24} />
          </div>
          
          <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">{message}</p>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-widest hover:bg-slate-600 transition cursor-pointer"
            >
              Cancel
            </button>
            <button 
              disabled={loading}
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 rounded-xl text-white font-bold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 cursor-pointer ${colorClass}`}
            >
              {loading ? <Loader2 className="animate-spin" size={14} /> : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}