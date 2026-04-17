import { useEffect, useState } from 'react';
import { encounterService } from '../services/encounterService';
import { FileCheck, Download, Calendar, User, Search } from 'lucide-react';

export default function CoderHistory() {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await encounterService.getEncounters('reviewed');
      setHistory(data);
    };
    fetchHistory();
  }, []);

  const handleDownloadAgain = async (id, fileName) => {
    const fhirData = await encounterService.exportFHIR(id);
    const blob = new Blob([JSON.stringify(fhirData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RE_EXPORT_${fileName.split('.')[0]}.json`;
    link.click();
  };

  const filteredHistory = history.filter(item => 
    item.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Completed Claims</h1>
          <p className="text-slate-400 mt-1">Audit-ready archive of all finalized medical records.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" placeholder="Search by filename..."
            className="bg-slate-800 border border-slate-700 text-sm rounded-xl pl-10 pr-4 py-2 text-white w-full md:w-64 focus:ring-1 focus:ring-brand outline-none"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900/50 text-slate-500 text-[10px] uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Document</th>
              <th className="px-6 py-4">Finalized Date</th>
              <th className="px-6 py-4">Codes Extracted</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filteredHistory.map((item) => (
              <tr key={item._id} className="hover:bg-slate-700/20 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                      <FileCheck size={18} />
                    </div>
                    <span className="text-sm font-medium text-slate-200">{item.fileName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2 text-xs text-slate-400">
                     <Calendar size={14} />
                     {new Date(item.updatedAt).toLocaleDateString()}
                   </div>
                </td>
                <td className="px-6 py-4">
                   <span className="bg-slate-900 border border-slate-700 text-brand px-2 py-1 rounded text-[10px] font-bold">
                     {item.aiResults?.length} CODES
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDownloadAgain(item._id, item.fileName)}
                    className="text-slate-400 hover:text-white flex items-center gap-2 ml-auto text-xs font-bold uppercase tracking-tighter transition"
                  >
                    <Download size={14} /> FHIR JSON
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredHistory.length === 0 && (
          <div className="py-20 text-center text-slate-500 italic text-sm">
            No completed claims found.
          </div>
        )}
      </div>
    </div>
  );
}