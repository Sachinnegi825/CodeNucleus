import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Menu, X } from 'lucide-react';

export default function NavbarPublic() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-[100] bg-[#0a0f1d]/60 backdrop-blur-2xl border border-white/5 rounded-3xl px-6 md:px-8 py-4 flex items-center justify-between shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-2">
          <Activity className="text-brand" size={22} />
          <span className="font-black text-white tracking-tighter text-xl uppercase">CodeNucleus<span className="text-brand">™</span></span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em]">
          <a href="#protocol" className="hover:text-brand transition">Protocol</a>
          <a href="#infrastructure" className="hover:text-brand transition">Infrastructure</a>
          <a href="#compliance" className="hover:text-brand transition">Compliance</a>
        </div>

        <div className="hidden md:block">
          <Link to="/login" className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand hover:text-white transition-all active:scale-95">
            Workspace
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white hover:text-brand transition-colors p-2 z-[110]"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <div className={`fixed inset-0 z-[95] bg-[#020617]/95 backdrop-blur-3xl transition-all duration-500 ease-in-out md:hidden flex flex-col items-center justify-center ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <div className="flex flex-col items-center gap-10 text-xs font-bold text-zinc-500 uppercase tracking-[0.4em]">
          <a
            href="#protocol"
            onClick={() => setIsOpen(false)}
            className="hover:text-brand transition-all text-2xl text-white py-2"
          >
            Protocol
          </a>
          <a
            href="#infrastructure"
            onClick={() => setIsOpen(false)}
            className="hover:text-brand transition-all text-2xl text-white py-2"
          >
            Infrastructure
          </a>
          <a
            href="#compliance"
            onClick={() => setIsOpen(false)}
            className="hover:text-brand transition-all text-2xl text-white py-2"
          >
            Compliance
          </a>

          <div className="mt-8">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="bg-brand text-white px-12 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              Workspace
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20">
          <Activity size={100} className="text-brand" />
        </div>
      </div>
    </>
  );
}
