import { UploadCloud, FileText } from 'lucide-react';

export default function CoderWorkspace() {
  return (
    <div className="max-w-7xl mx-auto h-[80vh] flex gap-6 mt-4">
      {/* Left Panel: PDF Viewer Dropzone */}
      <div className="flex-1 bg-slate-800 rounded-2xl shadow-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-600 hover:border-brand transition-colors relative overflow-hidden">
        <UploadCloud className="w-20 h-20 text-slate-500 mb-6" />
        <p className="text-slate-300 font-medium text-lg">Drag & Drop Encrypted Medical Record (PDF)</p>
        <p className="text-slate-500 text-sm mt-2 mb-6">Max file size: 50MB. HIPAA Compliant Upload.</p>
        <button className="bg-slate-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-slate-600 transition border border-slate-600 font-semibold flex items-center gap-2">
          <FileText className="w-4 h-4" /> Browse Local Files
        </button>
      </div>

      {/* Right Panel: AI Extraction View */}
      <div className="w-100 bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 flex flex-col relative overflow-hidden">
         {/* Dynamic Brand Accent Line */}
         <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>
        
        <h2 className="text-lg font-bold text-white border-b border-slate-700 pb-3 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
          AI Extraction Engine
        </h2>
        
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-sm italic bg-slate-900/50 rounded-xl border border-slate-700/50 p-4">
           Awaiting document ingestion...
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-700">
          <button className="w-full bg-emerald-600/20 text-emerald-500 border border-emerald-600/50 py-3 rounded-lg font-bold opacity-50 cursor-not-allowed transition">
            Approve & Export (FHIR R4)
          </button>
        </div>
      </div>
    </div>
  );
}