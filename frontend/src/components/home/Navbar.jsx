import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function NavbarPublic() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 bg-[#0a0f1d]/40 backdrop-blur-2xl border border-white/5 rounded-3xl px-8 py-4 flex items-center justify-between shadow-2xl">
      <div className="flex items-center gap-2">
        <Activity className="text-brand" size={22} />
        <span className="font-black text-white tracking-tighter text-xl uppercase">CodeNucleus<span className="text-brand">™</span></span>
      </div>

      <div className="hidden md:flex items-center gap-10 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em]">
        <a href="#protocol" className="hover:text-brand transition">Protocol</a>
        <a href="#infrastructure" className="hover:text-brand transition">Infrastructure</a>
        <a href="#compliance" className="hover:text-brand transition">Compliance</a>
      </div>

      <Link to="/login" className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand hover:text-white transition-all active:scale-95">
        Workspace
      </Link>
    </nav>
  );
}