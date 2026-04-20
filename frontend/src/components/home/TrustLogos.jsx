export default function TrustLogos() {
  return (
    <div className="border-y border-white/5 bg-white/[0.02] py-8">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-600 mb-6">
          Powering the next generation of healthcare agencies
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale contrast-200">
          {/* Fake Company Logos using stylized text */}
          <span className="text-xl font-black text-white tracking-tighter">ApexHealth.</span>
          <span className="text-xl font-bold text-white tracking-widest uppercase">NovaBilling</span>
          <span className="text-xl font-serif font-bold text-white italic">OmniCare Solutions</span>
          <span className="text-xl font-mono font-bold text-white">FHIR_SYNC</span>
          <span className="text-xl font-bold text-white tracking-tight border-2 border-white px-2">VANGUARD</span>
        </div>
      </div>
    </div>
  );
}