import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { encounterService } from '../services/encounterService';
import toast from 'react-hot-toast';
import { 
  UploadCloud, FileText, Loader2, 
  ShieldAlert, Lock, CheckCircle2, 
  Trash2, Plus, AlertTriangle, ActivitySquare,
  ChevronRight, ArrowRight, ClipboardList, Send
} from 'lucide-react';

export default function CoderWorkspace() {
  const { user } = useAuthStore();
  const [encounters, setEncounters] = useState([]);
  const [selectedEncounter, setSelectedEncounter] = useState(null);
  const [editableCodes, setEditableCodes] = useState([]);
  
  const [uploading, setUploading] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const[securePdfUrl, setSecurePdfUrl] = useState(null);

  const fetchRecords = async () => {
    try {
      const data = await encounterService.getEncounters('active');
      setEncounters(data);
    } catch (err) { toast.error("Failed to sync workspace"); }
  };

  useEffect(() => { fetchRecords(); },[]);

  useEffect(() => {
    if (selectedEncounter?.aiResults) setEditableCodes(selectedEncounter.aiResults);
    else setEditableCodes([]);
  }, [selectedEncounter]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') return toast.error("Please upload a PDF.");
    setUploading(true);
    try {
      await encounterService.uploadRecord(file);
      fetchRecords();
      toast.success("Document securely ingested");
    } catch (err) { toast.error("Upload failed"); } 
    finally { setUploading(false); }
  };

  const handleViewRecord = async (encounter) => {
    setSelectedEncounter(encounter);
    setLoadingPdf(true);
    setSecurePdfUrl(null);
    try {
      const data = await encounterService.getSecureViewUrl(encounter._id);
      setSecurePdfUrl(data.secureUrl);
    } catch (err) { toast.error("Secure Link Failed."); } 
    finally { setLoadingPdf(false); }
  };

  const handleScrub = async () => {
    setIsScrubbing(true);
    try {
      const data = await encounterService.scrubRecord(selectedEncounter._id);
      const updated = { ...selectedEncounter, status: data.status, scrubbedText: data.scrubbedText };
      setSelectedEncounter(updated);
      setEncounters(encounters.map(enc => enc._id === updated._id ? updated : enc));
      toast.success("PHI successfully redacted");
    } catch (err) { toast.error("DLP Scrubbing Failed."); } 
    finally { setIsScrubbing(false); }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const data = await encounterService.analyzeRecord(selectedEncounter._id);
      const updated = { ...selectedEncounter, status: data.status, aiResults: data.results };
      setSelectedEncounter(updated);
      setEncounters(encounters.map(enc => enc._id === updated._id ? updated : enc));
      toast.success("AI extraction complete");
    } catch (err) { toast.error("AI Analysis Failed."); } 
    finally { setIsAnalyzing(false); }
  };

  const handleCodeChange = (index, field, value) => {
    const updated = [...editableCodes];
    updated[index][field] = value;
    setEditableCodes(updated);
  };

  const removeCode = (index) => setEditableCodes(editableCodes.filter((_, i) => i !== index));
  const addManualCode = () => setEditableCodes([{ code: '', description: '', type: 'ICD-10-CM', confidence: 1.0 }, ...editableCodes]);

  // 🔴 UPDATED: Submit to QA instead of Exporting
  const handleSubmitToQA = async () => {
    const promise = encounterService.updateRecord(selectedEncounter._id, {
      aiResults: editableCodes,
      status: 'pending_qa' // Sends to Boss
    });

    toast.promise(promise, {
      loading: 'Submitting to QA...',
      success: 'Sent to Admin for final review!',
      error: 'Submission failed.'
    });

    try {
      await promise;
      setSelectedEncounter(null); // Clear screen
      fetchRecords(); // Remove from Coder's queue
    } catch (err) { console.error(err); }
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-4 animate-in fade-in duration-500 pb-4">
      {/* LEFT PANEL: QUEUE */}
      <div className="w-full lg:w-1/5 flex flex-col gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>
          <label className="flex items-center justify-center w-full h-16 border border-slate-700 border-dashed rounded-lg cursor-pointer hover:bg-slate-900 transition-colors">
            {uploading ? <Loader2 className="animate-spin text-brand" size={20} /> : <UploadCloud className="text-slate-500" size={20} />}
            <input type="file" className="hidden" accept="application/pdf" onChange={handleUpload} />
          </label>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl flex-1 shadow-lg flex flex-col overflow-hidden min-h-[100px] sm:min-h-[400px]">
          <div className="p-3 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
             <h3 className="font-bold text-white text-[10px] uppercase tracking-widest">Active Queue</h3>
             <span className="text-brand text-[10px] font-bold">{encounters.length} Files</span>
          </div>
          <div className="flex-1 overflow-y-auto p-1 space-y-1 custom-scrollbar">
            {encounters.map((enc) => (
              <div key={enc._id} onClick={() => handleViewRecord(enc)}
                className={`p-3 rounded-lg cursor-pointer border transition-all flex flex-col gap-1 group ${
                  selectedEncounter?._id === enc._id ? 'bg-slate-900 border-brand' : 'border-transparent hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 truncate">
                     <FileText size={14} className={selectedEncounter?._id === enc._id ? 'text-brand' : 'text-slate-600'} />
                     <span className="text-xs font-medium text-slate-300 truncate">{enc.fileName}</span>
                  </div>
                  <ChevronRight size={12} className="text-slate-700" />
                </div>
                {/* Show if Boss returned it */}
                {enc.status === 'returned' && (
                  <span className="text-[9px] text-red-500 font-bold uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded w-fit mt-1">
                    Needs Correction
                  </span>
                )}
              </div>
            ))}
            {encounters.length === 0 && <p className="text-center text-xs text-slate-500 p-4">Queue is empty</p>}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: WORKSPACE */}
      <div className="w-full lg:w-4/5 flex flex-col gap-4">
        {/* PDF Viewer */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl flex-1 shadow-xl flex flex-col overflow-hidden min-h-[400px]">
          <div className="h-10 border-b border-slate-700 bg-slate-950/50 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <ShieldAlert size={12} className="text-emerald-500" />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Medical Record Vault</span>
            </div>
          </div>
          <div className="flex-1 bg-slate-950 flex items-center justify-center">
            {!selectedEncounter ? (
              <p className="text-slate-700 text-[10px] uppercase font-bold tracking-widest">Select Patient to Begin</p>
            ) : loadingPdf ? (
              <Loader2 className="animate-spin text-brand" size={24} />
            ) : (
              <div className="w-full h-full overflow-auto">
                <iframe src={`${securePdfUrl}#toolbar=0&view=FitH&zoom=page-width`} className="border-none w-full h-full scale-[0.95] sm:scale-100 origin-top" style={{ minHeight: "500px" }} />
              </div>
            )}
          </div>
        </div>
        
        {/* ACTION PANEL */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-2xl relative overflow-hidden transition-all">
           {!selectedEncounter ? (
              <p className="text-center text-slate-600 text-[10px] font-mono tracking-widest">SYSTEM IDLE</p>
           ) : selectedEncounter.status === 'pending' ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-500"><Lock size={20} /></div>
                  <div><h4 className="text-white text-sm font-bold">Step 1: Security Redaction</h4></div>
                </div>
                <button onClick={handleScrub} disabled={isScrubbing} className="bg-amber-500 text-slate-950 px-5 py-2.5 rounded-lg font-bold text-[11px] uppercase flex items-center gap-2 hover:bg-amber-400 cursor-pointer disabled:opacity-50 transition"><ArrowRight size={14} /> Scrub PHI</button>
              </div>
           ) : selectedEncounter.status === 'scrubbed' ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-brand/10 rounded-xl border border-brand/20 text-brand"><ActivitySquare size={20} /></div>
                  <div><h4 className="text-white text-sm font-bold">Step 2: AI Coding Pipeline</h4></div>
                </div>
                <button onClick={handleAnalyze} disabled={isAnalyzing} className="bg-brand text-white px-5 py-2.5 rounded-lg font-bold text-[11px] uppercase flex items-center gap-2 hover:opacity-90 cursor-pointer disabled:opacity-50 transition"><ArrowRight size={14} /> Run AI Coding</button>
              </div>
           ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                  <h4 className="text-blue-500 font-bold flex items-center gap-2 text-xs uppercase tracking-wider">
                    <ClipboardList size={16} /> Human Review Workspace
                  </h4>
                  <button onClick={addManualCode} className="text-[10px] bg-slate-700/50 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg cursor-pointer transition flex items-center gap-2">
                    <Plus size={14} /> Add Code
                  </button>
                </div>

                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                  {editableCodes.map((res, i) => (
                    <div key={i} className="bg-slate-900/60 border border-slate-700 p-3 rounded-xl hover:border-slate-500 transition-colors">
                      <div className="flex gap-3 items-center">
                        <div className="flex flex-col gap-1">
                           <span className="text-[8px] uppercase font-bold text-slate-500 tracking-tighter">Code</span>
                           <input className="bg-slate-950 border border-slate-700 text-brand font-mono font-bold text-xs w-24 p-1.5 rounded-lg outline-none focus:border-brand" value={res.code} onChange={(e) => handleCodeChange(i, 'code', e.target.value)} />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                           <span className="text-[8px] uppercase font-bold text-slate-500 tracking-tighter">Clinical Description</span>
                           <input className="w-full bg-slate-950 border border-slate-700 text-slate-300 text-[11px] p-1.5 rounded-lg outline-none focus:border-slate-500" value={res.description} onChange={(e) => handleCodeChange(i, 'description', e.target.value)} />
                        </div>
                        <button onClick={() => removeCode(i)} className="text-slate-600 hover:text-red-500 cursor-pointer transition mt-4 self-center"><Trash2 size={14} /></button>
                      </div>
                      {res.denialRisk && (
                        <div className="mt-2 flex items-center gap-2 bg-red-500/5 border border-red-500/10 p-2 rounded-lg">
                          <AlertTriangle size={10} className="text-red-500" />
                          <span className="text-[9px] text-red-400 font-bold uppercase tracking-tight">{res.denialRisk.reason}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 🔴 NEW: Submit to QA Button */}
                <button
                  onClick={handleSubmitToQA}
                  className="w-full bg-brand hover:scale-105 text-white py-3 rounded-xl cursor-pointer font-bold uppercase tracking-widest text-[11px] transition flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 active:scale-[0.98]"
                >
                  <Send size={16} /> Submit to Admin for QA
                </button>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}