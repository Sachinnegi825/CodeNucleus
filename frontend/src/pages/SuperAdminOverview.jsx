import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { 
  ShieldAlert, 
  Globe, 
  Server, 
  Cpu, 
  Zap, 
  ShieldCheck,
  PlusCircle,
  Building2,
  Cloud,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
// Components
import StatsCard from '../components/ui/StatsCard';
import CreateAgencyModal from '../components/modals/CreateAgencyModal';

export default function SuperAdminOverview() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalAgencies: 0,
    activeInstances: 0,
  });

  const fetchStats = async () => {
    try {
      const data = await userService.getAgencies(1, 1);
      setStats({
        totalAgencies: data?.totalAgencies || 0,
        activeInstances: data?.totalAgencies || 0 
      });
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-700">
      
      {/* 1. TOP HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-red-500/10 rounded-3xl border border-red-500/20 shadow-lg shadow-red-500/5">
            <ShieldAlert className="text-red-500" size={40} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight italic">System Core</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2 mt-1 uppercase text-[10px] tracking-widest">
              <Server size={14} className="text-red-500/50" /> Global Instance Provisioning Engine
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-red-900/30 hover:bg-red-500 hover:scale-[1.05] transition-all active:scale-95 flex items-center gap-3 cursor-pointer group"
        >
          <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-500" />
          Deploy New Agency
        </button>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Managed Agencies" value={stats.totalAgencies} icon={Building2} color="text-blue-500" />
        <StatsCard label="Cloud Instances" value={stats.activeInstances} icon={Cloud} color="text-emerald-500" />
        <StatsCard label="Neural Load" value="4.2%" icon={Cpu} color="text-amber-500" />
        <StatsCard label="Edge Status" value="Online" icon={Activity} color="text-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* 3. PLATFORM CONTEXT */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white leading-snug">
              Infrastructure <br/>
              <span className="text-red-500 italic">Policy & Protocol</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm">
              Initialize fully isolated enterprise instances with dedicated subdomains, custom branding, and administrative root access. Every deployment triggers a security-first environment with mandatory encryption.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <FeatureBox 
              icon={<Globe className="text-blue-500" size={24} />} 
              title="Subdomain Isolation" 
              desc="Automated DNS routing and SSL provisioning for target namespace." 
            />
            <FeatureBox 
              icon={<Cpu className="text-amber-500" size={24} />} 
              title="Resource Allocation" 
              desc="Dedicated worker queues and neural pipeline capacity." 
            />
          </div>
        </div>

        <div className="lg:col-span-7 bg-slate-800/20 border border-slate-800 rounded-[2.5rem] p-10 flex flex-col justify-center relative overflow-hidden">
           <Zap className="absolute -right-10 -bottom-10 text-red-500/5" size={200} />
           <h3 className="text-white font-black text-4xl mb-4 italic uppercase tracking-tighter">Ready for Deployment</h3>
           <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-md font-medium">
             Select "Deploy New Agency" to initialize a new secure instance on the CodeNucleus edge network.
           </p>
           <div className="flex items-center gap-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest border-t border-slate-800 pt-8">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
               GCP Region: Global
             </div>
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
               SLA: 99.99%
             </div>
           </div>
        </div>
      </div>

      <CreateAgencyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchStats}
        createAgencyFn={userService.createAgency}
      />
    </div>
  );
}

function FeatureBox({ icon, title, desc }) {
  return (
    <div className="p-6 bg-slate-800/30 border border-slate-800 rounded-3xl group hover:bg-slate-800/50 transition-all">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h4 className="text-white font-bold mb-1 text-sm">{title}</h4>
          <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}

