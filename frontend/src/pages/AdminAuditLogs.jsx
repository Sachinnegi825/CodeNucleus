import { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { 
  ShieldCheck, Search, ShieldAlert, Clock, 
  User, Fingerprint, ChevronLeft, ChevronRight 
} from 'lucide-react';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchLogs = async (page) => {
    setLoading(true);
    try {
      const data = await userService.getAuditLogs(page, 10);
      setLogs(data.logs);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setTotalResults(data.totalLogs);
    } catch (err) {
      console.error("Logs fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]);

  // Handle Action Styling
  const getActionStyle = (action) => {
    if (action.includes('LOGIN')) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    if (action.includes('SCRUB')) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    if (action.includes('EXPORT')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-brand" size={32} /> Compliance Audit Trail
          </h1>
          <p className="text-slate-400 mt-1">
            Showing <span className="text-white font-bold">{logs.length}</span> of {totalResults} security events.
          </p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/80 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Action Event</th>
                <th className="px-6 py-4">Security ID</th>
                <th className="px-6 py-4">Source IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="flex justify-center items-center gap-3 text-slate-500">
                      <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
                      Fetching Encrypted Logs...
                    </div>
                  </td>
                </tr>
              ) : logs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-700/10 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-[11px] text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{log.userId?.email || 'System'}</span>
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest">{log.userId?.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-tighter ${getActionStyle(log.action)}`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-500">
                    {log._id.substring(0, 12)}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                    {log.ipAddress || 'Internal'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION CONTROLS --- */}
        <div className="p-4 bg-slate-900/50 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-medium">
            Page <span className="text-white">{currentPage}</span> of {totalPages}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Simple Page Numbers */}
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Only show current, first, last, and neighbors (simplified logic)
                if (totalPages > 5 && (pageNum > 2 && pageNum < totalPages - 1 && Math.abs(pageNum - currentPage) > 1)) {
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) return <span key={pageNum} className="text-slate-700">...</span>;
                  return null;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition ${currentPage === pageNum ? 'bg-brand text-white' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || loading}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl flex items-center justify-center gap-3">
         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
         <p className="text-[10px] text-slate-600 uppercase font-bold tracking-[0.2em]">Immutable Log System Active • HIPAA v2.1 Certified Storage</p>
      </div>
    </div>
  );
}