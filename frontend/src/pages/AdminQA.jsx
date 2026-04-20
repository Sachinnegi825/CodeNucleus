import { useState, useEffect } from 'react';
import { encounterService } from '../services/encounterService';
import toast from 'react-hot-toast';
import { 
  FileText, Loader2, ShieldAlert, CheckCircle2, AlertTriangle, XCircle, 
  Download, Search, X, History, Inbox, ChevronLeft, ChevronRight, FileCheck 
} from 'lucide-react';

export default function AdminQA() {
  const [encounters, setEncounters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending_qa');
  const [selectedEncounter, setSelectedEncounter] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [securePdfUrl, setSecurePdfUrl] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchQueue = async (page) => {
    setLoading(true);
    try {
      // Pass both status and page to the service
      const data = await encounterService.getEncounters(activeTab, page);
      setEncounters(data?.encounters || (Array.isArray(data) ? data : [])); // Handle both paginated and non-paginated responses
      setTotalPages(data?.totalPages || 1);
      setTotalResults(data?.totalEncounters || (Array.isArray(data) ? data.length : 0));
    } catch (err) { 
      toast.error("Sync failed"); 
    } finally { 
      setLoading(false); 
    }
  };

  // Reset page when switching tabs
  useEffect(() => {
    setCurrentPage(1);
    fetchQueue(1);
  }, [activeTab]);

  // Fetch when page changes
  useEffect(() => {
    fetchQueue(currentPage);
  }, [currentPage]);

  const handleOpenReview = async (encounter) => {
    setSelectedEncounter(encounter);
    if (activeTab === 'completed') return;
    setLoadingPdf(true);
    try {
      const data = await encounterService.getSecureViewUrl(encounter?._id);
      setSecurePdfUrl(data?.secureUrl);
    } catch (err) { toast.error("PDF Purged for Security"); } finally { setLoadingPdf(false); }
  };

  const closeReview = () => { setSelectedEncounter(null); setSecurePdfUrl(null); };

  const handleReject = async () => {
    if (!selectedEncounter?._id) return;
    setActionLoading(true);
    try {
      await encounterService.updateRecord(selectedEncounter._id, { status: 'returned' });
      toast.success("Returned to coder");
      closeReview(); fetchQueue(currentPage);
    } finally { setActionLoading(false); }
  };

  const handleApprove = async () => {
    if (!selectedEncounter?._id) return;
    setActionLoading(true);
    try {
      const fhirData = await encounterService.exportFHIR(selectedEncounter._id);
      const blob = new Blob([JSON.stringify(fhirData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = `FHIR_${(selectedEncounter?.fileName || 'export').split('.')[0]}.json`;
      link.click();
      toast.success("Purged & Exported!");
      closeReview(); fetchQueue(currentPage);
    } catch (err) { toast.error("Export Failed"); } finally { setActionLoading(false); }
  };

  const filteredEncounters = (encounters || []).filter(enc => 
    enc?.fileName?.toLowerCase().includes(searchTerm?.toLowerCase() || '') || 
    enc?.uploadedBy?.email?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <CheckCircle2 className="text-brand" size={32} /> QA Automation
        </h1>
        <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex">
           <button onClick={() => setActiveTab('pending_qa')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase cursor-pointer transition ${activeTab === 'pending_qa' ? 'bg-brand text-white shadow-lg' : 'text-slate-500'}`}>
             <Inbox size={14} className="inline mr-2" /> Pending
           </button>
           <button onClick={() => setActiveTab('completed')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase cursor-pointer transition ${activeTab === 'completed' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500'}`}>
             <History size={14} className="inline mr-2" /> Completed
           </button>
        </div>
      </div>

      <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" placeholder="Search by file or coder..."
            className="bg-slate-800 border border-slate-700 text-sm rounded-xl pl-10 pr-4 py-2.5 text-white w-full focus:ring-1 focus:ring-brand outline-none"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/80 text-slate-500 text-[10px] uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Document</th>
                <th className="px-6 py-4">Coder</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr><td colSpan="4" className="py-20 text-center"><Loader2 className="animate-spin text-brand mx-auto" /></td></tr>
              ) : (filteredEncounters || []).length > 0 ? (
                (filteredEncounters || []).map((enc) => (
                  <tr key={enc?._id} className="hover:bg-slate-700/10 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-200">{enc?.fileName || 'Unnamed Document'}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">{enc?.uploadedBy?.email || 'Unknown Coder'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${activeTab === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-brand/10 text-brand border-brand/20'}`}>
                        {enc?.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleOpenReview(enc)} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest cursor-pointer active:scale-95 transition ${activeTab === 'completed' ? 'bg-slate-700 text-slate-300' : 'bg-brand text-white shadow-brand/20 shadow-lg'}`}>
                        {activeTab === 'completed' ? 'View Codes' : 'Review'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">
                    <div className="h-[400px] flex flex-col items-center justify-center text-slate-500 bg-slate-900/10">
                       {activeTab === 'pending_qa' ? <FileCheck size={48} className="mb-4 opacity-10" /> : <History size={48} className="mb-4 opacity-10" />}
                       <p className="text-sm font-medium uppercase tracking-widest opacity-40">
                         {activeTab === 'pending_qa' ? 'QA Queue is empty' : 'No history found'}
                       </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION FOOTER (ALWAYS VISIBLE) --- */}
        <div className="p-4 bg-slate-900/50 border-t border-slate-700 flex items-center justify-between">
           <span className="text-xs text-slate-500 font-medium">Page {currentPage || 1} of {totalPages || 1}</span>
           <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1 || loading}
                className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer transition"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={(currentPage || 1) >= (totalPages || 1) || loading}
                className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer transition"
              >
                <ChevronRight size={18} />
              </button>
           </div>
        </div>
      </div>

      {selectedEncounter && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-6">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={closeReview}></div>
          <div className="relative bg-slate-900 border border-slate-700 w-full h-full max-w-[1600px] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/50">
               <span className="text-xs font-bold text-white uppercase tracking-widest">{activeTab === 'completed' ? 'Anonymized Record' : 'QA Audit'}</span>
               <button onClick={closeReview} className="text-slate-500 hover:text-white cursor-pointer"><X size={24} /></button>
            </div>
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
               <div className="w-full lg:w-3/5 bg-slate-950 border-r border-slate-800 relative">
                 {activeTab === 'completed' ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
                     <ShieldAlert size={48} className="text-amber-500 mb-4 opacity-50" />
                     <h3 className="text-white font-bold text-lg italic">PHI Scrubbed Successfully</h3>
                     <p className="text-slate-500 text-sm mt-2">PDF and clinical notes deleted post-export.</p>
                   </div>
                 ) : loadingPdf ? <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-brand" /></div>
                 : <iframe src={`${securePdfUrl}#toolbar=0&view=FitH`} className="w-full h-full border-none" />}
               </div>
               <div className="w-full lg:w-2/5 flex flex-col bg-slate-900">
                  <div className="p-4 border-b border-slate-800 text-xs font-bold uppercase text-slate-500">Extracted ICD-10 & CPT</div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {(selectedEncounter?.aiResults || []).map((res, i) => (
                      <div key={i} className="bg-slate-850 border border-slate-700 p-4 rounded-xl flex gap-3">
                        <div className="text-brand font-mono font-bold text-sm bg-slate-950 p-2 rounded border border-slate-800">{res?.code || 'N/A'}</div>
                        <div className="text-slate-300 text-xs mt-1">{res?.description || 'No description provided'}</div>
                      </div>
                    ))}
                  </div>
                  {activeTab === 'pending_qa' && (
                    <div className="p-6 border-t border-slate-800 flex gap-4">
                       <button disabled={actionLoading} onClick={handleReject} className="flex-1 bg-slate-800 text-slate-400 py-3 rounded-xl font-bold text-[10px] uppercase cursor-pointer hover:bg-red-600 hover:text-white transition">Return</button>
                       <button disabled={actionLoading} onClick={handleApprove} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold text-[10px] uppercase cursor-pointer shadow-lg hover:bg-emerald-500 transition">Approve & Export</button>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}