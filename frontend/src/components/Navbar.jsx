import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { authService } from '../services/authService';

export default function Navbar() {
  const { user, logout, branding } = useAuthStore(); 
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="h-[73px] bg-slate-950 border-b-2 border-brand text-white p-4 shadow-xl shrink-0 z-50">
      {/* Top Bar */}
      <div className="flex justify-between items-center h-full">
        
        {/* Logo / Brand Section */}
        <div 
          role="button"
          tabIndex={0}
          className="font-bold text-xl flex items-center gap-3" 
          onClick={() => navigate('/')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
        >
          {branding.logoUrl ? (
            <img src={branding.logoUrl} alt="Logo" className="h-8 w-auto rounded shadow-sm" />
          ) : (
            <div className="w-8 h-8 bg-brand rounded flex items-center justify-center text-white text-sm">
              {branding.name?.[0] || '🧬'}
            </div>
          )}
          {/* Show Agency Name. If SuperAdmin, you can still show CodeNucleus if you prefer */}
          <span className="text-brand">
            {user.role === 'superadmin' ? 'CodeNucleus™' : branding.name}
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5">
          <span className="text-sm text-slate-400 font-mono">
            {user.email} <span className="text-brand">[{user.role}]</span>
          </span>

          <button
            onClick={handleLogout}
            className="bg-slate-800 border cursor-pointer border-slate-700 px-4 py-1.5 rounded text-sm font-semibold hover:bg-slate-700 transition flex items-center gap-2"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden cursor-pointer text-slate-400 hover:text-white transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="mt-4 flex flex-col gap-4 md:hidden bg-slate-900 p-5 rounded-xl border border-slate-800 animate-in slide-in-from-top-2">
          
          <div className="flex flex-col border-b border-slate-800 pb-3">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Active Session</span>
            <span className="text-sm text-slate-200 truncate">{user.email}</span>
            <span className="text-xs text-brand font-mono">[{user.role}]</span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-brand cursor-pointer text-white px-4 py-3 rounded-lg text-sm font-bold hover:opacity-90 transition w-full flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Secure Logout
          </button>
        </div>
      )}
    </nav>
  );
}