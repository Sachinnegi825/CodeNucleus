import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { authService } from '../services/authService';

axios.defaults.withCredentials = true;

export default function Login() {
  const [email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const data = await authService.login(email, password);
    login(data.user);
    
    if (data.user.role === 'superadmin') navigate('/super-admin');
    else if (data.user.role === 'admin') navigate('/admin/dashboard');
    else navigate('/workspace');
  } catch (error) {
    alert(error);
  }
};

  return (
    <div className="flex items-center justify-center mt-24">
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl w-96">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-slate-900 rounded-full border border-slate-700 shadow-inner">
            <Activity className="text-brand w-10 h-10" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-8 text-white text-center tracking-tight">System Access</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
            <input 
              type="email" required
              className="mt-1 w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
            <input 
              type="password" required
              className="mt-1 w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-brand text-white p-3 rounded-lg font-bold shadow-lg hover:shadow-brand/50 transition-all active:scale-95 mt-4">
            Authenticate Session
          </button>
        </form>
      </div>
    </div>
  );
}