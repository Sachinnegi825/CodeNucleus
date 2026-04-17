import { useState, useEffect } from 'react';
import { payerRuleService } from '../services/payerRuleService';
import { BookOpen, Plus, Trash2, ChevronLeft, ChevronRight, Loader2, ShieldAlert } from 'lucide-react';
import AddRuleModal from '../components/modals/AddRuleModal';

export default function AdminPayerRules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchRules = async (page) => {
    setLoading(true);
    try {
      const data = await payerRuleService.getRules(page, 10);
      setRules(data?.rules);
      setTotalPages(data?.totalPages);
      setTotalResults(data?.totalRules);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchRules(currentPage); }, [currentPage]);

  const handleDelete = async (id) => {
    if (!confirm("Remove this billing rule?")) return;
    await payerRuleService.deleteRule(id);
    fetchRules(currentPage);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BookOpen className="text-brand" size={32} /> Denial Intelligence
          </h1>
          <p className="text-slate-400 mt-1">Manage <span className="text-white font-bold">{totalResults}</span> automated billing triggers.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-brand text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-105 transition shadow-lg shadow-brand/20 active:scale-95 cursor-pointer">
          <Plus size={18} /> Add New Rule
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/80 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">
              <tr>
                <th className="px-6 py-4">Payer</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Requirement</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr><td colSpan="4" className="py-20 text-center"><Loader2 className="animate-spin text-brand mx-auto" /></td></tr>
              ) : rules.length > 0 ? (
                rules.map((rule) => (
                  <tr key={rule?._id} className="hover:bg-slate-700/10 transition-colors group">
                    <td className="px-6 py-4 font-bold text-white text-sm">{rule?.payerName}</td>
                    <td className="px-6 py-4 font-mono text-brand text-sm font-bold">{rule?.ruleCode}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs truncate max-w-xs">{rule?.requirement}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(rule?._id)} className="text-slate-600 hover:text-red-500 transition p-2 cursor-pointer">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                /* 🚀 FIXED HEIGHT EMPTY STATE BOX */
                <tr>
                  <td colSpan="4">
                    <div className="h-[400px] flex flex-col items-center justify-center text-slate-500 bg-slate-900/20">
                       <ShieldAlert size={48} className="mb-4 opacity-10" />
                       <p className="text-sm font-medium uppercase tracking-widest opacity-40">No intelligence rules deployed</p>
                    </div>
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
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1 || loading} className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || loading} className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer">
                <ChevronRight size={18} />
              </button>
           </div>
        </div>
      </div>

      <AddRuleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={() => fetchRules(1)} createRuleFn={payerRuleService.createRule} />
    </div>
  );
}