import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { encounterService } from '../services/encounterService';
import { 
  UploadCloud, FileText, Loader2, FileCheck, 
  ShieldAlert, Eye, Lock, CheckCircle2 
} from 'lucide-react';

export default function CoderWorkspace() {
  const { user } = useAuthStore();
  const [encounters, setEncounters] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // Viewer & Scrubbing State
  const [selectedEncounter, setSelectedEncounter] = useState(null);
  const [securePdfUrl, setSecurePdfUrl] = useState(null);
  const[loadingPdf, setLoadingPdf] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false); // NEW

  const fetchRecords = async () => {
    try {
      const data = await encounterService.getEncounters();
      setEncounters(data);
    } catch (err) { console.error("Failed to fetch encounters"); }
  };

  useEffect(() => { fetchRecords(); },[]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') return alert("Only PDF files allowed.");

    setUploading(true);
    try {
      await encounterService.uploadRecord(file);
      await fetchRecords();
    } catch (err) { alert("Upload failed."); } 
    finally { setUploading(false); }
  };

  const handleViewRecord = async (encounter) => {
    setSelectedEncounter(encounter);
    setLoadingPdf(true);
    setSecurePdfUrl(null);

    try {
      const data = await encounterService.getSecureViewUrl(encounter._id);
      setSecurePdfUrl(data.secureUrl);
    } catch (err) { alert("Failed to generate secure viewing link."); } 
    finally { setLoadingPdf(false); }
  };

  // 🔴 NEW: Handle PHI Scrubbing
  const handleScrub = async () => {
    if (!selectedEncounter) return;
    setIsScrubbing(true);
    try {
      const data = await encounterService.scrubRecord(selectedEncounter._id);
      
      // Update local state instantly so the UI reacts
      const updatedEncounter = { 
        ...selectedEncounter, 
        status: data.status, 
        scrubbedText: data.scrubbedText 
      };
      
      setSelectedEncounter(updatedEncounter);
      setEncounters(encounters.map(enc => enc._id === updatedEncounter._id ? updatedEncounter : enc));
      
      alert(`PHI Scrubbed! Google DLP locked ${data.phiMapCount} sensitive data points.`);
    } catch (err) {
      alert("Scrubbing failed. Ensure the PDF has extractable text (not just an image).");
    } finally {
      setIsScrubbing(false);
    }
  };

  return (
    <div className="w-full h-full min-h-[800px] flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">
      
      {/* LEFT PANEL: UPLOAD & QUEUE */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        {/* Upload Zone */}
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
        <div className="bg-slate-800 border border-slate-700 rounded-2xl flex-1 shadow-xl flex flex-col overflow-hidden min-h-[400px]">
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
                   {/* Dynamic Status Badge */}
                   <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-1 rounded-full ${
                     enc.status === 'scrubbed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                     enc.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                     'bg-slate-700 text-slate-300'
                   }`}>
                     {enc.status}
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: VIEWER & ACTION PIPELINE */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        
        {/* PDF Viewer */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl flex-1 shadow-xl flex flex-col overflow-hidden relative min-h-125">
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
                 <iframe src={`${securePdfUrl}#toolbar=0`} className="w-full h-full border-none" title="Medical Record"></iframe>
              ) : (
                 <div className="absolute inset-0 flex items-center justify-center text-red-500">Failed to load document.</div>
              )}
           </div>
        </div>
        
        {/* 🔴 NEW: DYNAMIC ACTION PIPELINE */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex-shrink-0 relative overflow-hidden transition-all duration-300">
           
           {!selectedEncounter ? (
              /* State 0: No Selection */
              <div className="flex flex-col items-center justify-center text-center opacity-50 py-2">
                <h4 className="text-white font-bold text-slate-400">Action Pipeline Offline</h4>
                <p className="text-xs text-slate-500 mt-1">Select a document from the queue to begin processing.</p>
              </div>
           ) : selectedEncounter.status === 'pending' ? (
              /* State 1: Needs Scrubbing */
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                 <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                 <div>
                   <h4 className="text-white font-bold flex items-center gap-2">
                     <Lock size={18} className="text-amber-500" />
                     Step 1: De-Identify Medical Record
                   </h4>
                   <p className="text-xs text-slate-400 mt-1 max-w-md">
                     Scan and redact Protected Health Information (PHI) using Google Cloud DLP before sending to AI.
                   </p>
                 </div>
                 <button
                   onClick={handleScrub}
                   disabled={isScrubbing}
                   className="w-full sm:w-auto cursor-pointer bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                   {isScrubbing ? <><Loader2 className="animate-spin" size={16} /> Scanning via GCP...</> : "Scrub PHI Data"}
                 </button>
              </div>
           ) : (
              /* State 2: Ready for AI (Week 4) */
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                 <div className="absolute top-0 left-0 w-1 h-full bg-brand"></div>
                 <div>
                   <h4 className="text-white font-bold flex items-center gap-2">
                     <CheckCircle2 size={18} className="text-emerald-500" />
                     Step 2: AI Coding Engine Ready
                   </h4>
                   <p className="text-xs text-slate-400 mt-1 max-w-md">
                     PHI successfully redacted. Document is secure and ready for Gemini 1.5 Pro analysis.
                   </p>
                 </div>
                 <button disabled className="w-full sm:w-auto bg-slate-700 text-slate-500 px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs cursor-not-allowed border border-slate-600">
                   Run AI Analysis (Week 4)
                 </button>
              </div>
           )}

        </div>
      </div>
    </div>
  );
}