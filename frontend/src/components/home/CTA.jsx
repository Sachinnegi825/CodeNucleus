import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="py-40 px-6 text-center">
      <div className="max-w-4xl mx-auto relative">
        <div className="absolute inset-0 bg-brand/10 blur-[150px] -z-10"></div>
        <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-10">Scale your agency <br/> with Intelligence.</h2>
        <Link to="/login" className="inline-block bg-brand border border-white/10 text-white px-12 py-5 rounded-2xl font-bold text-sm uppercase tracking-[0.2em] shadow-2xl shadow-brand/20 hover:scale-105 transition-all">
          Deploy Instance Now
        </Link>
      </div>
    </section>
  );
}