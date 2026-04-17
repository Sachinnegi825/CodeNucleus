import React, { useState } from 'react';
import { X, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UpdatePasswordModal({ isOpen, onClose, coder }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password too short");

    setLoading(true);
    try {
      // Import the service here or pass as prop
      const { userService } = await import('../../services/userService');
      await userService.updatePassword(coder._id, password);
      toast.success(`Password updated for ${coder.email}`);
      setPassword('');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="text-brand" size={20} /> Reset Password
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition cursor-pointer">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">Target Account</label>
            <div className="bg-slate-800 p-3 rounded-lg text-slate-300 text-sm font-medium border border-slate-700">
              {coder?.email}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">New Password</label>
            <input 
              autoFocus
              type="password"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand focus:outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white py-3 rounded-xl font-bold flex cursor-pointer items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Credentials"}
          </button>
        </form>
      </div>
    </div>
  );
}