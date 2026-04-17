import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Menu, 
  X, 
  ChevronRight, 
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function AdminLayout() {
  const { user } = useAuthStore();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Coders', path: '/admin/coders', icon: Users },
    { name: 'QA Reviews', path: '/admin/qa', icon: CheckCircle2 },
      { name: 'Compliance Logs', path: '/admin/logs', icon: ShieldCheck }, // 🔴 NEW
{ name: 'Payer Intelligence', path: '/admin/rules', icon: BookOpen },
    { name: 'Branding Settings', path: '/admin/settings', icon: Settings },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex flex-1 min-h-0 relative">
      <button 
        onClick={toggleSidebar}
        className="lg:hidden cursor-pointer fixed bottom-6 right-6 z-50 p-4 bg-brand text-white rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay (Mobile only) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 bg-slate-950 border-r border-slate-800 
        transform transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>
        <div className="flex flex-col h-full">
          {/* Internal Sidebar Header */}
          <div className={`flex items-center border-b border-slate-800 relative transition-all duration-300 ${isCollapsed ? 'justify-center h-20 px-0' : 'p-6 h-24'}`}>
            {!isCollapsed && (
              <div className="flex flex-col">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Management</p>
                <h2 className="text-white font-bold text-lg whitespace-nowrap overflow-hidden">Admin Console</h2>
              </div>
            )}
            <button 
              onClick={toggleCollapse}
              className={`hidden lg:flex absolute ${isCollapsed ? 'relative inset-auto' : 'top-8 right-4'} p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer`}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-xl transition-all group ${
                    isActive 
                    ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                  title={isCollapsed ? item.name : ""}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <item.icon size={20} className="flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</span>}
                  </div>
                  {!isCollapsed && isActive && <ChevronRight size={14} className="flex-shrink-0" />}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Security Badge */}
          <div className={`p-4 border-t border-slate-800 bg-slate-900/30 transition-all duration-300 ${isCollapsed ? 'flex justify-center px-0' : ''}`}>
            <div className={`flex items-center gap-2 text-slate-500 ${isCollapsed ? 'justify-center' : ''}`}>
              <ShieldCheck size={16} className="text-brand flex-shrink-0" />
              {!isCollapsed && <span className="text-[10px] font-bold uppercase tracking-tighter whitespace-nowrap overflow-hidden">Banned PHI Access</span>}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-slate-900 overflow-y-auto p-4 md:p-8 lg:p-10 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}