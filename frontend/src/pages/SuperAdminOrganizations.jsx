import { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { 
  Building2, ChevronLeft, 
  ChevronRight, UserX, UserCheck, Loader2, KeyRound, Search, X 
} from 'lucide-react';
import ConfirmModal from '../components/modals/ConfirmModal';
import UpdatePasswordModal from '../components/modals/UpdatePasswordModal';
import toast from 'react-hot-toast';

export default function SuperAdminOrganizations() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Password Reset Modal State
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  
  // Confirmation Modal State
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    targetAdmin: null,
    loading: false
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchAgencies = async (page) => {
    setLoading(true);
    try {
      const data = await userService.getAgencies(page, 10);
      setAgencies(data?.agencies || []);
      setTotalPages(data?.totalPages || 1);
      setTotalResults(data?.totalAgencies || 0);
    } catch (err) {
      toast.error("Failed to sync agency records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies(currentPage);
  }, [currentPage]);

  const promptToggleStatus = (admin) => {
    setConfirmState({
      isOpen: true,
      targetAdmin: admin,
      loading: false
    });
  };

  const handleToggleStatus = async () => {
    const admin = confirmState.targetAdmin;
    const action = admin?.status === 'active' ? 'Suspend' : 'Activate';
    
    setConfirmState(prev => ({ ...prev, loading: true }));

    const statusPromise = userService.toggleStatus(admin?._id);

    toast.promise(statusPromise, {
      loading: `Processing ${action}...`,
      success: (data) => `Agency Admin ${admin?.email || 'Unknown'} is now ${data?.status || 'updated'}`,
      error: `Could not update agency status`,
    });

    try {
      await statusPromise;
      setConfirmState({ isOpen: false, targetAdmin: null, loading: false });
      fetchAgencies(currentPage);
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
            <Building2 className="text-red-500" size={32} /> Organization Management
          </h1>
          <p className="text-slate-400 mt-1">
            Access control for <span className="text-white font-bold">{totalResults || 0}</span> enterprise identities.
          </p>
        </div>
      </div>

      {/* SEARCH BOX */}
      <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" placeholder="Search by email or organization..."
            className="bg-slate-800 border border-slate-700 text-sm rounded-xl pl-10 pr-4 py-2.5 text-white w-full focus:ring-1 focus:ring-red-500 outline-none"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
      </div>

      {/* FULL WIDTH TABLE */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/80 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">
              <tr>
                <th className="px-6 py-4">Organization & Admin</th>
                <th className="px-6 py-4">Subdomain</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Global Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="flex justify-center items-center gap-3 text-slate-500 font-mono text-xs italic">
                      <Loader2 className="animate-spin text-red-500" size={16} />
                      Fetching Global Directory...
                    </div>
                  </td>
                </tr>
              ) : agencies.length > 0 ? (
                agencies.filter(a => 
                  a?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) || 
                  a?.organizationId?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
                ).map((admin) => (
                <tr 
                  key={admin?._id} 
                  className={`transition-colors group ${
                    admin?.status === 'suspended' ? 'bg-red-500/5' : 'hover:bg-slate-700/10'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold shadow-inner transition-colors ${
                        admin?.status === 'active' ? 'bg-slate-900 border-slate-700 text-red-500' : 'bg-red-950 border-red-900 text-red-500'
                      }`}>
                        {(admin?.organizationId?.name?.[0] || admin?.email?.[0] || 'O').toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-200">{admin?.organizationId?.name || 'N/A'}</span>
                        <span className="text-[10px] text-slate-500 font-mono italic">{admin?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-700">
                      {admin?.organizationId?.subdomain || 'none'}.codenucleus.com
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 font-bold text-[10px] uppercase ${
                      admin?.status === 'active' ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${admin?.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                      {admin?.status || 'unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setIsPassModalOpen(true);
                        }}
                        className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-red-500 hover:border-red-500 transition cursor-pointer active:scale-90"
                        title="Reset Admin Password"
                      >
                        <KeyRound size={14} />
                      </button>

                      <button 
                        onClick={() => promptToggleStatus(admin)}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition flex items-center gap-2 border cursor-pointer active:scale-95 ${
                          admin?.status === 'active' 
                          ? 'border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white' 
                          : 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                        }`}
                      >
                        {admin?.status === 'active' ? <><UserX size={12} /> Deactivate</> : <><UserCheck size={12} /> Activate</>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-slate-500 italic text-sm">
                    No organizations matching "{searchTerm || ''}"
                  </td>
                </tr>
              )}
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

      {/* --- CONFIRM DEACTIVATE MODAL --- */}
      <ConfirmModal 
        isOpen={confirmState.isOpen}
        loading={confirmState.loading}
        title={confirmState.targetAdmin?.status === 'active' ? "Deactivate Agency?" : "Restore Agency?"}
        message={`This will immediately ${confirmState.targetAdmin?.status === 'active' ? 'block' : 'grant'} login permissions for the admin of ${confirmState.targetAdmin?.organizationId?.name}.`}
        confirmText={confirmState.targetAdmin?.status === 'active' ? "Deactivate" : "Activate"}
        type={confirmState.targetAdmin?.status === 'active' ? "danger" : "success"}
        onClose={() => setConfirmState({ isOpen: false, targetAdmin: null, loading: false })}
        onConfirm={handleToggleStatus}
      />

      {/* --- UPDATE PASSWORD MODAL --- */}
      <UpdatePasswordModal 
        isOpen={isPassModalOpen}
        onClose={() => {
          setIsPassModalOpen(false);
          setSelectedAdmin(null);
        }}
        coder={selectedAdmin}
      />

    </div>
  );
}
