import { ShieldAlert, Cpu, DownloadCloud } from 'lucide-react';

export default function HowItWorks() {
  const steps =[
    {
      icon: ShieldAlert, color: 'text-brand',
      title: "1. Zero-Trust Ingestion",
      desc: "PDFs are streamed to private Google Cloud buckets. Cloud DLP instantly redacts PHI and encrypts real identities."
    },
    {
      icon: Cpu, color: 'text-indigo-400',
      title: "2. LLM Extraction",
      desc: "De-identified clinical notes are processed by Groq Llama 3. ICD-10 and CPT codes are extracted in milliseconds."
    },
    {
      icon: DownloadCloud, color: 'text-emerald-500',
      title: "3. Re-Hydrate & Export",
      desc: "Human coders review output. Upon approval, identities are decrypted and packaged into standard FHIR R4 JSON bundles."
    }
  ];

  return (
    <div id="protocol" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">The Secure Pipeline</h2>
        <p className="text-zinc-400 text-sm">A military-grade workflow designed explicitly for medical compliance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <div key={i} className="bg-slate-800/40 border border-white/5 p-8 rounded-3xl hover:bg-white/[0.02] transition">
            <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 ${step.color}`}>
              <step.icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}