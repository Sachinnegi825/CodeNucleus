import { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { 
  Users, Loader2, Search, X, ChevronLeft, ChevronRight, Building2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SuperAdminCoders() {
  const [coders, setCoders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchCoders = async (page) => {
    setLoading(true);
    try {
      const data = await userService.getGlobalCoders(page, 10);
      setCoders(data?.coders || []);
      setTotalPages(data?.totalPages || 1);
      setTotalResults(data?.totalCoders || 0);
    } catch (err) {
      toast.error("Failed to sync global coder records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoders(currentPage);
  }, [currentPage]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="text-red-500" size={32} /> Global Coders
          </h1>
          <p className="text-slate-400 mt-1">
            Visibility across <span className="text-white font-bold">{totalResults || 0}</span> total medical coders on the platform.
          </p>
        </div>
      </div>

      {/* SEARCH BOX */}
      <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" placeholder="Search by email..."
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
                <th className="px-6 py-4">Employee Identity</th>
                <th className="px-6 py-4">Agency / Organization</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Onboarded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="flex justify-center items-center gap-3 text-slate-500 font-mono text-xs italic">
                      <Loader2 className="animate-spin text-red-500" size={16} />
                      Syncing Global Directory...
                    </div>
                  </td>
                </tr>
              ) : (coders || []).filter(c => c?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase())).length > 0 ? (
                (coders || []).filter(c => c?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase())).map((coder) => (
                <tr 
                  key={coder?._id} 
                  className={`transition-colors group ${
                    coder?.status === 'suspended' ? 'bg-red-500/5' : 'hover:bg-slate-700/10'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold shadow-inner transition-colors ${
                        coder?.status === 'active' ? 'bg-slate-900 border-slate-700 text-red-500' : 'bg-red-950 border-red-900 text-red-500'
                      }`}>
                        {(coder?.email?.[0] || 'U').toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-200">{coder?.email || 'No Email'}</span>
                        <span className="text-[9px] text-slate-500 font-mono italic uppercase tracking-tighter">Verified Identity</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-slate-500" />
                        <div className="flex flex-col">
                            <span className="text-sm text-slate-300 font-medium">{coder?.organizationId?.name || 'Unknown'}</span>
                            <span className="text-[9px] text-slate-500 uppercase">{coder?.organizationId?.subdomain || 'N/A'}</span>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 font-bold text-[10px] uppercase ${
                      coder?.status === 'active' ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${coder?.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                      {coder?.status || 'unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                    {coder?.createdAt ? new Date(coder.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-slate-500 italic text-sm">
                    No coders matching "{searchTerm || ''}"
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
    </div>
  );
}
