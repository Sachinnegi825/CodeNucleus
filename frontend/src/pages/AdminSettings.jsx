import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { orgService } from '../services/orgService';
import toast from 'react-hot-toast';
import { 
  Upload, 
  Image as ImageIcon, 
  CheckCircle, 
  Loader2, 
  RefreshCw, 
  Smartphone, 
  Monitor, 
  Type,
  Layout,
  Palette,
  Sparkles
} from 'lucide-react';

const FONT_OPTIONS = [
  { name: 'Geist', value: "'Geist', sans-serif", description: 'Modern, minimalist, and ultra-sharp.' },
  { name: 'Plus Jakarta Sans', value: "'Plus Jakarta Sans', sans-serif", description: 'Friendly, modern, and highly readable.' },
  { name: 'Outfit', value: "'Outfit', sans-serif", description: 'Clean, geometric, and professional.' },
  { name: 'Inter', value: "'Inter', sans-serif", description: 'The industry standard for clean UI.' },
  { name: 'Poppins', value: "'Poppins', sans-serif", description: 'Playful, geometric, and modern.' },
];

export default function AdminSettings() {
  const { branding, setBranding } = useAuthStore();
  
  // Internal form state for real-time PREVIEW ONLY
  const [previewData, setPreviewData] = useState({
    name: '',
    primaryColor: '#3b82f6',
    fontFamily: 'Inter',
    logoUrl: ''
  });
  
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Load existing branding into local preview state
  useEffect(() => {
    const fetchCurrentBranding = async () => {
      try {
        const data = await orgService.getBranding();
        setPreviewData({
          name: data?.name || '',
          primaryColor: data?.primaryColor || '#3b82f6',
          fontFamily: data?.fontFamily || 'Inter',
          logoUrl: data?.logoUrl || ''
        });
      } catch (err) {
        console.error("Failed to fetch branding:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchCurrentBranding();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPreviewData(prev => ({ ...prev, [name]: value }));
    // NOTE: No global CSS or document.title updates here!
    // They only happen in handleUpdate.
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const updateData = new FormData();
    updateData.append('name', previewData.name);
    updateData.append('primaryColor', previewData.primaryColor);
    updateData.append('fontFamily', previewData.fontFamily);
    if (logoFile) updateData.append('logo', logoFile);

    try {
      const data = await orgService.updateBranding(updateData);
      
      const updatedBranding = {
        name: data?.updatedOrg?.name || previewData.name,
        logoUrl: data?.updatedOrg?.logoUrl || previewData.logoUrl,
        primaryColor: data?.updatedOrg?.settings?.primaryColor || previewData.primaryColor,
        fontFamily: data?.updatedOrg?.settings?.fontFamily || previewData.fontFamily
      };

      // ONLY NOW we update the global store and CSS variables
      setBranding(updatedBranding);
      
      setPreviewData({
        ...previewData,
        logoUrl: data?.updatedOrg?.logoUrl || previewData.logoUrl
      });
      setLogoFile(null);

      toast.success("Branding Synced Globally!");
    } catch (err) { 
      toast.error(err.message || "Failed to sync branding"); 
    } finally { 
      setLoading(false); 
    }
  };

  const getPreviewImage = () => {
    if (logoFile) return URL.createObjectURL(logoFile);
    return previewData.logoUrl;
  };

  if (fetching) return (
    <div className="flex flex-col items-center justify-center h-64 text-slate-500">
      <RefreshCw className="animate-spin mb-4" size={32} />
      <p className="font-mono text-xs uppercase tracking-widest text-center">
        Syncing Identity Assets...
      </p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Agency Branding</h1>
          <p className="text-slate-400 mt-1 text-sm md:text-base">Configure your white-label environment. Changes apply globally after sync.</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          GCP: Connected
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        
        {/* LEFT COLUMN: The Form */}
        <form onSubmit={handleUpdate} className="bg-slate-800 border border-slate-700 p-6 md:p-8 rounded-3xl shadow-xl space-y-8 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand rounded-t-3xl"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="col-span-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4 flex items-center gap-2">
                <Layout size={14} /> Organization Name
              </label>
              <input 
                type="text" 
                name="name"
                value={previewData.name}
                onChange={handleInputChange}
                placeholder="e.g. CodeNucleus Health"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-brand transition-colors font-medium"
              />
            </section>

            <section>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4 flex items-center gap-2">
                <Palette size={14} /> Brand Accent
              </label>
              <div className="flex items-center gap-4 bg-slate-900 p-3 rounded-xl border border-slate-700">
                <input 
                  type="color" 
                  name="primaryColor"
                  value={previewData.primaryColor} 
                  onChange={handleInputChange}
                  className="w-10 h-10 bg-transparent border-none cursor-pointer rounded-lg"
                />
                <div>
                  <p className="text-white font-mono uppercase font-bold text-sm">{previewData.primaryColor}</p>
                  <p className="text-slate-500 text-[10px] uppercase">Hex Code</p>
                </div>
              </div>
            </section>

            <section>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4 flex items-center gap-2">
                <Type size={14} /> Typography
              </label>
              <select 
                name="fontFamily"
                value={previewData.fontFamily}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-brand transition-colors font-medium appearance-none cursor-pointer"
              >
                {FONT_OPTIONS.map(font => (
                  <option key={font.name} value={font.name}>{font.name}</option>
                ))}
              </select>
              <p className="mt-2 text-[10px] text-slate-500 italic">
                {FONT_OPTIONS.find(f => f.name === previewData.fontFamily)?.description}
              </p>
            </section>
          </div>

          <section>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4 flex items-center gap-2">
              <ImageIcon size={14} /> Identity Asset (Logo)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-700 border-dashed rounded-2xl cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition-all hover:border-brand group overflow-hidden">
                {getPreviewImage() ? (
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                     <img src={getPreviewImage()} alt="Preview" className="max-h-full max-w-full object-contain" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Upload className="text-white" />
                     </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-slate-600 mb-2 group-hover:text-brand transition-colors" />
                    <p className="text-sm text-slate-400 group-hover:text-slate-300">Update Logo</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            {logoFile && (
              <div className="mt-3 flex items-center gap-2 text-brand text-[10px] font-bold uppercase tracking-widest">
                <CheckCircle size={14}/> Asset staged for deployment
              </div>
            )}
          </section>

          <button 
            disabled={loading}
            className="w-full bg-brand cursor-pointer text-white py-4 rounded-xl font-bold shadow-xl shadow-brand/20 hover:scale-[1.01] transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? <><Loader2 className="animate-spin" size={20} /> Syncing Cloud...</> : <><Sparkles size={18} /> Apply & Sync Branding</>}
          </button>
        </form>

        {/* RIGHT COLUMN: The Preview (Now isolated with inline styles) */}
        <div className="flex flex-col gap-4">
           <div className="flex items-center justify-between px-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={12} className="text-amber-500" /> Live Canvas Preview
              </label>
              <div className="flex gap-2 text-slate-500">
                <Smartphone size={14} className="xl:hidden" />
                <Monitor size={14} className="hidden xl:block" />
              </div>
           </div>

           <div 
             className="bg-slate-950 rounded-[2.5rem] p-6 md:p-10 border border-slate-800 shadow-2xl relative overflow-hidden h-120 md:h-132.5 w-full max-w-2xl mx-auto xl:max-w-none transition-all duration-500"
             style={{ fontFamily: FONT_OPTIONS.find(f => f.name === previewData.fontFamily)?.value }}
           >
              
              {/* Browser Tab Mockup */}
              <div className="absolute top-0 left-0 w-full bg-slate-900 h-8 flex items-center px-4 gap-2 border-b border-slate-800">
                 <div className="w-2 h-2 rounded-full bg-red-500/40"></div>
                 <div className="w-2 h-2 rounded-full bg-amber-500/40"></div>
                 <div className="bg-slate-800 h-6 px-3 rounded-t-lg flex items-center gap-2 mt-2 border-x border-t border-slate-700 max-w-[150px]">
                     <div className="w-3 h-3 rounded bg-slate-700 shrink-0 overflow-hidden">
                        {getPreviewImage() && <img src={getPreviewImage()} className="w-full h-full object-contain" alt="" />}
                     </div>
                     <span className="text-[9px] text-slate-400 font-medium truncate">{previewData.name || 'Workspace'}</span>
                 </div>
              </div>

              {/* Preview Top Nav */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-900 mt-6">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden border border-slate-800 p-1">
                       {getPreviewImage() ? (
                         <img src={getPreviewImage()} alt="Nav Preview" className="max-w-full max-h-full object-contain" />
                       ) : (
                         <ImageIcon className="text-slate-700" size={18} />
                       )}
                    </div>
                    <span className="font-bold text-white tracking-tighter text-base md:text-xl truncate max-w-[150px] md:max-w-none">
                       {previewData.name || "Agency Workspace"}
                    </span>
                 </div>
              </div>
              
              {/* Mock Content */}
              <div className="mt-10 space-y-6">
                 <div className="h-32 md:h-40 w-full rounded-2xl bg-slate-900/50 border border-slate-800 p-6 space-y-4">
                    <div className="h-2 w-1/3 bg-slate-800 rounded-full"></div>
                    <div className="h-2 w-full bg-slate-800 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]"></div>
                    <div className="h-2 w-4/5 bg-slate-800 rounded-full"></div>
                 </div>
                 
                 {/* Live Button Color Preview */}
                 <div 
                   className="h-12 md:h-14 w-full rounded-2xl shadow-lg flex items-center justify-center font-bold text-xs md:text-sm text-white transition-all hover:opacity-90" 
                   style={{ backgroundColor: previewData.primaryColor }}
                 >
                    Process Medical Claim
                 </div>

                 <div className="flex items-center justify-center gap-4 text-[10px] uppercase font-bold tracking-widest">
                    <span style={{ color: previewData.primaryColor }}>Analytics</span>
                    <span className="text-slate-600">History</span>
                    <span className="text-slate-600">Settings</span>
                 </div>
              </div>

              <p className="absolute bottom-6 left-0 w-full text-center text-[9px] text-slate-800 uppercase tracking-[0.3em] font-bold">
                 White-Label System Preview
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}