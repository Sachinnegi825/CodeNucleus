import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import CoderWorkspace from './pages/CoderWorkspace';

// New Admin Layout & Sub-Pages
import AdminLayout from './components/AdminLayout';
import AdminOverview from './pages/AdminOverview';
import AdminCoders from './pages/AdminCoders';
import AdminSettings from './pages/AdminSettings';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';

export default function App() {
   const { user } = useAuthStore();

  useEffect(() => {
    if (user && user.organization) {
      const org = user.organization;
      
      document.title = `${org.name} | Secure Workspace`;

      const link = document.querySelector("link[rel~='icon']");

      if (link && org.logoUrl) {
        link.href = org.logoUrl;
      }

      const brandColor = org.settings?.primaryColor || org.primaryColor || '#3b82f6';
      document.documentElement.style.setProperty('--brand-color', brandColor);
    } else {
      document.title = "CodeNucleus | Enterprise AI";
      const link = document.querySelector("link[rel~='icon']");
      if (link) link.href = "/vite.svg";
    }
  }, [user]);

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-slate-200">
        <Navbar />
        
        <div className="grow flex flex-col">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />

            {/* 🔴 Super Admin: Simple page with Top Navbar */}
            <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
              <Route path="/super-admin" element={<SuperAdminDashboard />} />
            </Route>

            {/* 🔵 Admin (The Boss): Uses the Sidebar Layout */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<AdminLayout />}>
                {/* These are 'Children' of the AdminLayout */}
                <Route path="/admin/dashboard" element={<AdminOverview />} />
                <Route path="/admin/coders" element={<AdminCoders />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* 🟢 Coder: Simple workspace with Top Navbar */}
            <Route element={<ProtectedRoute allowedRoles={['coder']} />}>
              <Route path="/workspace" element={<CoderWorkspace />} />
            </Route>

            {/* Fallback */}
            <Route path="/unauthorized" element={<h1 className="text-center text-red-500 text-2xl mt-10">403 - Unauthorized</h1>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}