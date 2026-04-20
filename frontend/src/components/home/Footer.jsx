export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 opacity-50">
          <span className="text-lg">🧬</span>
          <span className="font-bold text-white tracking-tight">CodeNucleus™</span>
        </div>
        <div className="flex gap-6 text-xs font-semibold text-zinc-600 uppercase tracking-widest">
           <span>HIPAA Compliant</span>
           <span>SOC 2 Ready</span>
           <span>GDPR Ready</span>
        </div>
      </div>
    </footer>
  );
}