import CTA from "../components/home/CTA";
import Features from "../components/home/Features";
import Footer from "../components/home/Footer";
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import Navbar from "../components/home/Navbar";
import TrustLogos from "../components/home/TrustLogos";


export default function Home() {
  return (
    <div className="h-full overflow-y-auto bg-slate-900 text-zinc-200 font-sans selection:bg-brand/30 selection:text-white scroll-smooth">
      <Navbar />
      <main>
        <Hero />
 <TrustLogos/>
        <HowItWorks/>
        <Features />
        <CTA />      </main>
      <Footer/>
    </div>
  );
}