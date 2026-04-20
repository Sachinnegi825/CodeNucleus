import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import MedicalAICard from './Medicalaicard';

export default function Hero() {
  const [text, setText] = useState('');
  const fullText = "Automated extraction. Human verification.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 70);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center px-6 pt-20 overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        <div className="space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-brand uppercase tracking-[0.2em]">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
            Enterprise White-Label Platform
          </div>
          <h1 className="text-4xl font-bold leading-[1.1] text-white tracking-tight">
            Scale Your Medical <br /> <span className="text-zinc-500">Coding Agency.</span>
          </h1>
          <p className="text-brand font-mono text-lg md:text-xl typewriter-cursor">{text}</p>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-lg">
            A comprehensive workspace designed for global coding vendors. Provision staff, embed custom payer rules, and leverage AI to instantly redact PHI and extract ICD-10 & CPT codes with guaranteed compliance.
          </p>
          <div className="flex gap-4 pt-4">
            <Link to="/login" className="bg-brand text-white border border-white/10 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-lg shadow-brand/20">
              Access Workspace <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* RESTORED GLASS UI MOCKUP */}
       <MedicalAICard/>
      </div>
    </section>
  );
}