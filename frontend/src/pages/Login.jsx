import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Lock, 
  Mail, 
  Loader2, 
  ChevronRight, 
  ShieldCheck,
  Zap,
  Globe,
  Eye,
  EyeOff,
  ArrowLeft
} from 'lucide-react';
import { authService } from '../services/authService';
import { orgService } from '../services/orgService';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

axios.defaults.withCredentials = true;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, branding, setBranding } = useAuthStore();
  const navigate = useNavigate();

  // 🔴 NEW: Subdomain Detection Logic
  useEffect(() => {
    const fetchSubdomainBranding = async () => {
      const hostname = window.location.hostname; // e.g., "apollo.lvh.me"
      const parts = hostname.split('.');

      // Check if there is a subdomain (ignoring 'www' or 'app')
      if (parts.length > 2 || (parts.length === 2 && parts[1] === 'lvh')) {
        const sub = parts[0];
        if (sub !== 'www' && sub !== 'app') {
          try {
            const data = await orgService.getPublicProfile(sub);
            
            // Apply branding to Zustand and Meta Tags
            setBranding(data);
            document.title = `${data.name} | Secure Access`;
            document.documentElement.style.setProperty('--brand-color', data.primaryColor);
            
            const link = document.querySelector("link[rel~='icon']");
            if (link && data.logoUrl) link.href = data.logoUrl;
            
          } catch (err) {
            console.error("Subdomain branding failed to load");
          }
        }
      }
    };
    fetchSubdomainBranding();
  }, [setBranding]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      login(data.user);
      
      toast.success(`Welcome back, ${data.user.email.split('@')[0]}`);
      
      if (data.user.role === 'superadmin') navigate('/superadmin/dashboard');
      else if (data.user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/workspace');
    } catch (error) {
      toast.error(error.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto flex items-center justify-center p-6 relative overflow-x-hidden scroll-smooth">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] animate-pulse delay-700"></div>
      
      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-slate-800/50 border border-slate-700/50 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-700 relative z-10">
        
        {/* LEFT COLUMN: Visual/Info Section */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900/50 border-r border-slate-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 mb-10 group hover:opacity-80 transition-opacity">
              <div className="p-2.5 bg-brand/10 rounded-xl border border-brand/20 group-hover:border-brand/40 transition-colors">
                {/* 🔴 DYNAMIC LOGO */}
                {branding.logoUrl ? (
                  <img src={branding.logoUrl} className="w-6 h-6 object-contain" alt="Logo" />
                ) : (
                  <Activity className="text-brand w-6 h-6" />
                )}
              </div>
              <span className="text-xl font-bold text-white tracking-tighter">
                {branding.name} {/* 🔴 DYNAMIC NAME */}
              </span>
            </Link>

            <h1 className="text-4xl font-bold text-white leading-tight mb-6">
              Precision AI for <br />
              <span className="text-brand">Medical Intelligence.</span>
            </h1>
            
            <p className="text-slate-400 text-lg max-w-sm mb-12">
              Advanced clinical infrastructure featuring automated DLP scrubbing, extraction, and FHIR interoperability.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                  <ShieldCheck className="text-emerald-500 w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">HIPAA Protected</h4>
                  <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold">Zero-Trust Redaction Active</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                  <Zap className="text-amber-500 w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Neural Pipeline</h4>
                  <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold">Llama 3 & Gemini Extraction</p>
                </div>
              </div>
            </div>
          </div>

         
        </div>

        {/* RIGHT COLUMN: Login Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center relative">
          <Link to="/" className="absolute top-8 left-8 lg:left-16 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Website
          </Link>

          <div className="mb-10 text-center lg:text-left mt-8 lg:mt-0">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Secure Login</h2>
            <p className="text-slate-400 text-sm">Welcome to the {branding.name} gateway.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="w-full bg-slate-950/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-1 focus:ring-brand outline-none transition-all placeholder:text-slate-600 font-medium"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-slate-700 text-white pl-12 pr-12 py-4 rounded-2xl focus:ring-1 focus:ring-brand outline-none transition-all placeholder:text-slate-600 font-medium"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand text-white py-4 rounded-2xl font-bold shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer group mt-8"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={20} /> Authenticating...</>
              ) : (
                <>
                  Access Portal 
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-800/50 text-center">
            <p className="text-slate-500 text-xs uppercase tracking-widest font-bold opacity-40">
               Secured by CodeNucleus Infrastructure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
