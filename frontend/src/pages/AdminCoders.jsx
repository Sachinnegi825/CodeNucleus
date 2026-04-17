import { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { 
  Users, UserPlus, ShieldCheck, ChevronLeft, 
  ChevronRight, UserX, UserCheck, Loader2, KeyRound 
} from 'lucide-react';
import AddCoderModal from '../components/modals/AddCoderModal';
import ConfirmModal from '../components/modals/ConfirmModal';
import UpdatePasswordModal from '../components/modals/UpdatePasswordModal'; // 🔵 NEW
import toast from 'react-hot-toast';

export default function AdminCoders() {
  const [coders, setCoders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Password Reset Modal State
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [selectedCoder, setSelectedCoder] = useState(null);
  
  // Confirmation Modal State
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    targetCoder: null,
    loading: false
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchCoders = async (page) => {
    setLoading(true);
    try {
      const data = await userService.getCoders(page, 10);
      setCoders(data.coders);
      setTotalPages(data.totalPages);
      setTotalResults(data.totalCoders);
    } catch (err) {
      toast.error("Failed to sync employee records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoders(currentPage);
  }, [currentPage]);

  const promptToggleStatus = (coder) => {
    setConfirmState({
      isOpen: true,
      targetCoder: coder,
      loading: false
    });
  };

  const handleToggleStatus = async () => {
    const coder = confirmState.targetCoder;
    const action = coder.status === 'active' ? 'Suspend' : 'Activate';
    
    setConfirmState(prev => ({ ...prev, loading: true }));

    const statusPromise = userService.toggleStatus(coder._id);

    toast.promise(statusPromise, {
      loading: `Processing ${action}...`,
      success: (data) => `Account ${coder.email} is now ${data.status}`,
      error: `Could not update account status`,
    });

    try {
      await statusPromise;
      setConfirmState({ isOpen: false, targetCoder: null, loading: false });
      fetchCoders(currentPage);
    } catch (err) {
      setConfirmState(prev => ({ ...prev, loading: false }));
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="text-brand" size={32} /> Coder Management
          </h1>
          <p className="text-slate-400 mt-1">
            Access control for <span className="text-white font-bold">{totalResults}</span> organization identities.
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-brand text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-105 transition shadow-lg shadow-brand/20 active:scale-95 cursor-pointer"
        >
          <UserPlus size={18} /> Provision New Coder
        </button>
      </div>

      {/* FULL WIDTH TABLE */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/80 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">
              <tr>
                <th className="px-6 py-4">Employee Identity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Onboarded</th>
                <th className="px-6 py-4 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="flex justify-center items-center gap-3 text-slate-500 font-mono text-xs italic">
                      <Loader2 className="animate-spin text-brand" size={16} />
                      Syncing Staff Directory...
                    </div>
                  </td>
                </tr>
              ) : coders.map((coder) => (
                <tr 
                  key={coder._id} 
                  className={`transition-colors group ${
                    coder.status === 'suspended' ? 'bg-red-500/5' : 'hover:bg-slate-700/10'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold shadow-inner transition-colors ${
                        coder.status === 'active' ? 'bg-slate-900 border-slate-700 text-brand' : 'bg-red-950 border-red-900 text-red-500'
                      }`}>
                        {coder.email[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-200">{coder.email}</span>
                        <span className="text-[9px] text-slate-500 font-mono italic uppercase tracking-tighter">Verified Identity</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 font-bold text-[10px] uppercase ${
                      coder.status === 'active' ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${coder.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                      {coder.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                    {new Date(coder.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* PASSWORD RESET BUTTON */}
                      <button 
                        onClick={() => {
                          setSelectedCoder(coder);
                          setIsPassModalOpen(true);
                        }}
                        className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-brand hover:border-brand transition cursor-pointer active:scale-90"
                        title="Reset Password"
                      >
                        <KeyRound size={14} />
                      </button>

                      {/* TOGGLE STATUS BUTTON */}
                      <button 
                        onClick={() => promptToggleStatus(coder)}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition flex items-center gap-2 border cursor-pointer active:scale-95 ${
                          coder.status === 'active' 
                          ? 'border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white' 
                          : 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                        }`}
                      >
                        {coder.status === 'active' ? <><UserX size={12} /> Suspend</> : <><UserCheck size={12} /> Activate</>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-4 bg-slate-900/50 border-t border-slate-700 flex items-center justify-between">
           <span className="text-xs text-slate-500 font-medium">Page {currentPage} of {totalPages}</span>
           <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1 || loading}
                className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || loading}
                className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
           </div>
        </div>
      </div>

      {/* --- ADD CODER MODAL --- */}
      <AddCoderModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onRefresh={() => {
            toast.success("New identity provisioned successfully");
            fetchCoders(1);
        }}
        createCoderFn={userService.createCoder}
      />

      {/* --- CONFIRM SUSPEND/ACTIVATE MODAL --- */}
      <ConfirmModal 
        isOpen={confirmState.isOpen}
        loading={confirmState.loading}
        title={confirmState.targetCoder?.status === 'active' ? "Suspend Access?" : "Restore Access?"}
        message={`This will immediately ${confirmState.targetCoder?.status === 'active' ? 'block' : 'grant'} login permissions for ${confirmState.targetCoder?.email}.`}
        confirmText={confirmState.targetCoder?.status === 'active' ? "Suspend Account" : "Activate Account"}
        type={confirmState.targetCoder?.status === 'active' ? "danger" : "success"}
        onClose={() => setConfirmState({ isOpen: false, targetCoder: null, loading: false })}
        onConfirm={handleToggleStatus}
      />

      {/* --- UPDATE PASSWORD MODAL --- */}
      <UpdatePasswordModal 
        isOpen={isPassModalOpen}
        onClose={() => {
          setIsPassModalOpen(false);
          setSelectedCoder(null);
        }}
        coder={selectedCoder}
      />

    </div>
  );
}