import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Menu, X, ChevronRight, ShieldCheck, 
  ActivitySquare, History, BarChart3
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function CoderLayout() {
  const { user } = useAuthStore();
  const location = useLocation();
  const[isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems =[
    { name: 'Active Workspace', path: '/workspace', icon: ActivitySquare },
    { name: 'Completed Claims', path: '/workspace/history', icon: History },
    { name: 'My Performance', path: '/workspace/analytics', icon: BarChart3 },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-1 min-h-0 relative">
      {/* Mobile Hamburger Button */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-brand text-white rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-800">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Assigned Role</p>
            <h2 className="text-white font-bold text-lg">Medical Coder</h2>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                    isActive 
                    ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight size={14} />}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Security Badge */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/30">
             <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
               <ShieldCheck size={20} className="flex-shrink-0" />
               <span className="text-[10px] font-bold uppercase tracking-tighter">AES-256 Encryption Active</span>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-slate-900 overflow-y-auto p-4 md:p-6">
        <div className="max-w-[1600px] mx-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}