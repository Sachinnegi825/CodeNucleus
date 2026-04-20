import { useEffect, useState } from 'react';
import { FileText, ShieldCheck, Lock, Activity, Zap } from 'lucide-react';

export default function MedicalAICard() {
  const [scanY, setScanY] = useState(12);
  const [confidence, setConfidence] = useState('98.2');

  useEffect(() => {
    let y = 12;
    let dir = 1;
    const scanTimer = setInterval(() => {
      y += dir * 0.9;
      if (y > 82) dir = -1;
      if (y < 10) dir = 1;
      setScanY(y);
    }, 30);

    const confTimer = setInterval(() => {
      setConfidence((97.8 + Math.random() * 0.8).toFixed(1));
    }, 3200);

    return () => {
      clearInterval(scanTimer);
      clearInterval(confTimer);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@700;800&display=swap');

        .mac-enter { animation: macUp 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes macUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .mac-f1 { animation: mF1 5s ease-in-out infinite; }
        .mac-f2 { animation: mF2 7s ease-in-out infinite; }
        .mac-f3 { animation: mF3 6s ease-in-out infinite; animation-delay:-2s; }
        @keyframes mF1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes mF2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes mF3 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

        .mac-breathe { animation: mBreathe 2s ease-in-out infinite; }
        @keyframes mBreathe {
          0%,100%{ opacity:0.55; transform:scale(1); }
          50%{ opacity:1; transform:scale(1.2); }
        }

        .mac-shimmer { position:relative; overflow:hidden; }
        .mac-shimmer::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent);
          animation: mShimmer 2.5s ease-in-out infinite;
        }
        @keyframes mShimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }

        .mac-wbar { animation: mWave 1.2s ease-in-out infinite; }
        @keyframes mWave { 0%,100%{transform:scaleY(0.3)} 50%{transform:scaleY(1)} }

        .mac-tag { animation: mTag 0.4s ease both; }
        @keyframes mTag { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }

        .mac-scan { transition: top 0.03s linear; }
      `}</style>

      {/* ─── Outer shell: transparent, centers the card ─── */}
      <div className="mac-enter w-full flex justify-center items-center">
        {/*
          Positioning context for floating badges.
          Responsive padding: add bottom/side space on lg so badges don't clip the hero grid.
        */}
        <div className="
          relative
          w-full max-w-[440px]
          lg:mt-4 lg:mb-10 lg:mr-0
        ">

          {/* ═══════════ Main card ═══════════ */}
          <div
            className="
              relative overflow-hidden
              rounded-[1.75rem] sm:rounded-[2.25rem]
              border border-white/[0.07]
              p-5 sm:p-6 lg:p-8
              shadow-[0_40px_100px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.05)]
            "
            style={{ background: 'linear-gradient(160deg,rgba(15,20,40,0.98) 0%,rgba(5,8,18,0.99) 100%)' }}
          >
            {/* Scan line */}
            <div
              className="mac-scan absolute left-0 right-0 h-px pointer-events-none z-10"
              style={{
                top: `${scanY}%`,
                background:
                  'linear-gradient(90deg,transparent 0%,rgba(245,158,11,0.35) 30%,rgba(245,158,11,0.65) 50%,rgba(245,158,11,0.35) 70%,transparent 100%)',
              }}
            />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-4 sm:pb-5 mb-4 sm:mb-5">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-amber-500/10 border border-amber-500/20 shrink-0">
                  <FileText size={15} className="text-amber-400" />
                </div>
                <div>
                  <p
                    className="text-white/90 font-bold uppercase tracking-widest text-[0.62rem] sm:text-[0.7rem]"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    Clinical Note
                  </p>
                  <p
                    className="text-white/25 mt-0.5 text-[0.55rem] sm:text-[0.58rem]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    #CN-2024-00847
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex items-center gap-1.5 bg-emerald-500/[0.07] border border-emerald-500/20 rounded-lg px-2 py-1">
                  <span className="mac-breathe inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span
                    className="text-emerald-400 font-semibold text-[0.55rem] sm:text-[0.58rem] tracking-wider"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    HIPAA
                  </span>
                </div>
                <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
              </div>
            </div>

            {/* PHI row */}
            <div
              className="mac-shimmer flex items-center gap-2 px-3 py-2.5 mb-4 rounded-xl border border-amber-500/[0.12] text-amber-400/85"
              style={{
                background: 'rgba(245,158,11,0.04)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
              }}
            >
              <Lock size={11} className="shrink-0" />
              <span className="truncate">[PHI_REDACTED_IDENTITY_1]</span>
              {/* Waveform — only sm+ */}
              <div className="ml-auto hidden sm:flex items-end gap-0.5 shrink-0" style={{ height: '19px' }}>
                {[8, 15, 11, 19, 9, 17, 7, 13].map((h, i) => (
                  <div
                    key={i}
                    className="mac-wbar w-[2px] rounded-full bg-amber-400/45"
                    style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>

            {/* Skeleton */}
            <div className="space-y-2.5 opacity-[0.22] mb-4 sm:mb-5">
              {[100, 100, 78, 92, 58].map((w, i) => (
                <div
                  key={i}
                  className="mac-shimmer h-[5px] rounded-full"
                  style={{ width: `${w}%`, background: 'rgba(255,255,255,0.18)' }}
                />
              ))}
            </div>

            {/* Divider */}
            <div
              className="h-px mb-4 sm:mb-5"
              style={{
                background:
                  'linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)',
              }}
            />

            {/* ICD tags */}
            <div className="flex flex-wrap gap-2">
              {[
                { code: 'I10', label: 'Hypertension',    color: 'amber',  delay: '0s'     },
                { code: 'E11', label: 'Type 2 Diabetes', color: 'violet', delay: '0.12s'  },
                { code: 'Z87', label: 'History',          color: 'sky',    delay: '0.24s'  },
              ].map(({ code, label, color, delay }) => (
                <div
                  key={code}
                  className={`
                    mac-tag flex items-center gap-1.5 px-2 py-1 rounded-lg border
                    ${color === 'amber'  ? 'bg-amber-500/[0.06]  border-amber-500/[0.15]'  : ''}
                    ${color === 'violet' ? 'bg-violet-400/[0.06] border-violet-400/[0.15]' : ''}
                    ${color === 'sky'    ? 'bg-sky-400/[0.06]    border-sky-400/[0.15]'    : ''}
                  `}
                  style={{ animationDelay: delay }}
                >
                  <span
                    className={`
                      font-bold text-[0.6rem] sm:text-[0.63rem] tracking-wide
                      ${color === 'amber'  ? 'text-amber-400'  : ''}
                      ${color === 'violet' ? 'text-violet-400' : ''}
                      ${color === 'sky'    ? 'text-sky-400'    : ''}
                    `}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {code}
                  </span>
                  <span className="text-white/30 text-[0.58rem] sm:text-[0.6rem]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════ Floating badges (lg+ only) ═══════════ */}

          {/* Badge 1 – ICD-10 detected (bottom-left) */}
          <div
            className="
              mac-f1 hidden lg:flex
              absolute -bottom-8 -left-6
              items-center gap-3.5 px-4 py-3.5
              rounded-[1.5rem] border border-white/[0.07]
              shadow-[0_20px_55px_rgba(0,0,0,0.55)] z-20
            "
            style={{ background: 'rgba(8,12,24,0.97)', backdropFilter: 'blur(16px)' }}
          >
            <div
              className="w-12 h-12 rounded-[0.75rem] flex items-center justify-center text-amber-400 font-black text-base bg-amber-500/[0.08] border border-amber-500/[0.22] shrink-0"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              I10
            </div>
            <div>
              <p
                className="text-white/90 font-black uppercase tracking-widest text-[0.65rem] mb-1"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                ICD-10 Detected
              </p>
              <div className="flex items-center gap-1.5">
                <span
                  className="mac-breathe inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"
                  style={{ animationDelay: '0.3s' }}
                />
                <span
                  className="text-white/30 text-[0.6rem]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {confidence}% Accurate
                </span>
              </div>
            </div>
          </div>

          {/* Badge 2 – Processing speed (top-right) */}
          <div
            className="
              mac-f2 hidden lg:flex
              absolute -top-5 -right-4
              items-center gap-2 px-3 py-2.5
              rounded-2xl border border-violet-500/[0.15]
              shadow-[0_16px_48px_rgba(0,0,0,0.5)] z-20
            "
            style={{ background: 'rgba(8,12,24,0.97)', backdropFilter: 'blur(16px)' }}
          >
            <div className="w-[26px] h-[26px] rounded-[6px] flex items-center justify-center bg-violet-400/10 border border-violet-400/20 text-violet-400 shrink-0">
              <Zap size={11} />
            </div>
            <div>
              <p
                className="text-violet-400 font-bold text-[0.68rem]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                0.34s
              </p>
              <p className="text-white/28 text-[0.58rem]">Processing</p>
            </div>
          </div>

          {/* Badge 3 – Live analysis (mid-right) */}
          <div
            className="
              mac-f3 hidden lg:flex
              absolute bottom-14 -right-7
              items-center gap-2 px-3 py-2
              rounded-xl border border-emerald-500/[0.15]
              shadow-[0_16px_48px_rgba(0,0,0,0.5)] z-20
            "
            style={{ background: 'rgba(8,12,24,0.97)', backdropFilter: 'blur(16px)' }}
          >
            <Activity size={12} className="text-emerald-400 shrink-0" />
            <span
              className="text-emerald-400 font-semibold text-[0.62rem]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Live Analysis
            </span>
            <span
              className="mac-breathe inline-block w-[5px] h-[5px] rounded-full bg-emerald-400"
              style={{ animationDelay: '0.6s' }}
            />
          </div>
        </div>
      </div>
    </>
  );
}