import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { encounterService } from '../services/encounterService';
import { UploadCloud, FileText, Loader2, FileCheck, ShieldAlert, Eye } from 'lucide-react';

export default function CoderWorkspace() {
  const { user } = useAuthStore();
  const [encounters, setEncounters] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // Viewer State
  const [selectedEncounter, setSelectedEncounter] = useState(null);
  const [securePdfUrl, setSecurePdfUrl] = useState(null);
  const[loadingPdf, setLoadingPdf] = useState(false);

  // Load records on mount
  const fetchRecords = async () => {
    try {
      const data = await encounterService.getEncounters();
      setEncounters(data);
    } catch (err) {
      console.error("Failed to fetch encounters");
    }
  };

  useEffect(() => { fetchRecords(); },[]);

  // Handle PDF Upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert("Only PDF files are supported for medical records.");
      return;
    }

    setUploading(true);
    try {
      await encounterService.uploadRecord(file);
      await fetchRecords(); // Refresh the list
      alert("Medical Record ingested securely.");
    } catch (err) {
      alert("Upload failed. Check console.");
    } finally {
      setUploading(false);
    }
  };

  // Handle Viewing a Record (Generates the 10-minute link)
  const handleViewRecord = async (encounter) => {
    setSelectedEncounter(encounter);
    setLoadingPdf(true);
    setSecurePdfUrl(null); // Clear previous

    try {
      const data = await encounterService.getSecureViewUrl(encounter._id);
      setSecurePdfUrl(data.secureUrl);
    } catch (err) {
      alert("Failed to generate secure viewing link.");
    } finally {
      setLoadingPdf(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-80px)] flex flex-col lg:flex-row gap-6 p-4 md:p-6">
      
      {/* ========================================== */}
      {/* LEFT PANEL: UPLOAD & RECORD LIST           */}
      {/* ========================================== */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        
        {/* Upload Dropzone */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <UploadCloud size={20} className="text-brand" /> Ingest Medical Record
          </h2>
          
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-xl cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition-colors group">
            {uploading ? (
               <div className="flex flex-col items-center gap-2 text-brand">
                 <Loader2 className="animate-spin" size={28} />
                 <span className="text-xs font-bold uppercase tracking-widest">Encrypting to Cloud...</span>
               </div>
            ) : (
               <div className="flex flex-col items-center pt-5 pb-6">
                 <UploadCloud className="w-8 h-8 text-slate-500 mb-2 group-hover:text-brand transition" />
                 <p className="text-sm text-slate-400 group-hover:text-slate-300 font-medium">Click to select PDF</p>
               </div>
            )}
            <input type="file" className="hidden" accept="application/pdf" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

        {/* Record List */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl flex-1 shadow-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
             <h3 className="font-bold text-white text-sm uppercase tracking-widest">Encounter Queue</h3>
             <span className="bg-brand/20 text-brand text-xs px-2 py-1 rounded font-bold">{encounters.length} Files</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {encounters.map((enc) => (
              <div 
                key={enc._id} 
                onClick={() => handleViewRecord(enc)}
                className={`p-4 rounded-xl cursor-pointer border transition-all flex items-center justify-between group ${
                  selectedEncounter?._id === enc._id 
                  ? 'bg-slate-900 border-brand shadow-[0_0_15px_rgba(0,0,0,0.3)]' 
                  : 'bg-slate-900/40 border-slate-700 hover:border-slate-500 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                   <div className={`p-2 rounded-lg ${selectedEncounter?._id === enc._id ? 'bg-brand/20 text-brand' : 'bg-slate-800 text-slate-500'}`}>
                     <FileText size={18} />
                   </div>
                   <div className="flex flex-col truncate">
                     <span className="text-sm font-bold text-white truncate">{enc.fileName}</span>
                     <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                       {new Date(enc.createdAt).toLocaleDateString()}
                     </span>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full">
                     {enc.status}
                   </span>
                   <Eye size={16} className={`transition-opacity ${selectedEncounter?._id === enc._id ? 'text-brand opacity-100' : 'text-slate-600 opacity-0 group-hover:opacity-100'}`} />
                </div>
              </div>
            ))}
            
            {encounters.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-slate-500 text-sm italic">
                No encounters found. Upload a PDF to begin.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* RIGHT PANEL: PDF VIEWER & AI PLACEHOLDER   */}
      {/* ========================================== */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        
        {/* Document Viewer */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl flex-1 shadow-xl flex flex-col overflow-hidden relative">
           
           {/* Top Action Bar */}
           <div className="h-14 border-b border-slate-700 bg-slate-900 flex items-center justify-between px-6 flex-shrink-0">
              <div className="flex items-center gap-2">
                 <ShieldAlert size={16} className="text-emerald-500" />
                 <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">HIPAA Compliant Viewer</span>
              </div>
              {selectedEncounter && (
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                  Temporary Key Generated
                </div>
              )}
           </div>

           {/* PDF Display Area */}
           <div className="flex-1 bg-slate-950 relative">
              {!selectedEncounter ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                    <FileCheck size={48} className="mb-4 opacity-20" />
                    <p className="font-bold uppercase tracking-widest text-sm">Select a record to view</p>
                 </div>
              ) : loadingPdf ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-brand">
                    <Loader2 size={32} className="animate-spin mb-4" />
                    <p className="font-bold uppercase tracking-widest text-xs">Decrypting Document...</p>
                 </div>
              ) : securePdfUrl ? (
                 <iframe 
                   src={`${securePdfUrl}#toolbar=0`} 
                   className="w-full h-full border-none"
                   title="Medical Record"
                 ></iframe>
              ) : (
                 <div className="absolute inset-0 flex items-center justify-center text-red-500">
                    Failed to load document.
                 </div>
              )}
           </div>
        </div>
        
        {/* Bottom AI Action Bar (Placeholder for Week 4) */}
        <div className="h-24 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-between px-6 shadow-xl flex-shrink-0">
           <div>
             <h4 className="text-white font-bold flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-brand animate-pulse"></div>
               AI Extraction Engine (Offline)
             </h4>
             <p className="text-xs text-slate-400 mt-1">Select a document to begin the coding process.</p>
           </div>
           <button disabled className="bg-slate-700 text-slate-500 px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs cursor-not-allowed border border-slate-600">
             Run AI Analysis
           </button>
        </div>

      </div>
    </div>
  );
}