import { useEffect, useState } from 'react';
import { UserPlus,CheckCircle } from 'lucide-react';
import { userService } from '../services/userService';

export default function AdminCoders() {
  const [coders, setCoders] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(()=>{
           fetchCoders();
  },[])

 const fetchCoders = async () => {
  try {
    const data = await userService.getCoders();
    setCoders(data);
  } catch (err) { console.error(err); }
};

const handleCreate = async (e) => {
  e.preventDefault();
  try {
    await userService.createCoder(email, password);
    alert("Employee Onboarded");
    setEmail(''); setPassword('');
    fetchCoders();
  } catch (err) { alert(err); }
};

  return (
    <div className="space-y-8 pb-20 lg:pb-0 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Coder Management</h1>
        <p className="text-slate-400 mt-1">Invite and manage medical coding employees.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Onboarding Form */}
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-xl h-fit sticky top-24">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <UserPlus size={20} className="text-brand" /> Provision Account
          </h2>
          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Corporate Email</label>
              <input 
                type="email" placeholder="coder@agency.com" required
                className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white outline-none focus:ring-1 focus:ring-brand"
                value={email} onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Access Key (Password)</label>
              <input 
                type="text" placeholder="Minimum 8 characters" required
                className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white outline-none focus:ring-1 focus:ring-brand"
                value={password} onChange={e => setPassword(e.target.value)} 
              />
            </div>
            <button className="w-full cursor-pointer bg-brand text-white py-3 rounded-xl font-bold shadow-lg shadow-brand/20 hover:scale-[1.02] transition active:scale-95">
              Authorize Employee
            </button>
          </form>
        </div>

        {/* Coder Table */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-700 bg-slate-800/50">
               <h3 className="font-bold text-white uppercase text-xs tracking-tighter">Registered Coding Staff</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-slate-500 text-[10px] uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Security Level</th>
                    <th className="px-6 py-4">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {coders.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700 font-bold text-brand">
                          {c.email[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-200">{c.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] bg-slate-900 text-slate-400 px-3 py-1 rounded-full border border-slate-700 font-bold">CODER_LEVEL_1</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold">
                          <CheckCircle size={14} /> Verified
                        </div>
                      </td>
                    </tr>
                  ))}
                  {coders.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-10 text-center text-slate-500 italic text-sm">No employees found. Provision your first coder to begin.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}