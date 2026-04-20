import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import SuperAdminLayout from './components/SuperAdminLayout';
import SuperAdminOverview from './pages/SuperAdminOverview';
import SuperAdminOrganizations from './pages/SuperAdminOrganizations';
import CoderWorkspace from './pages/CoderWorkspace';

// New Admin Layout & Sub-Pages
import AdminLayout from './components/AdminLayout';
import AdminOverview from './pages/AdminOverview';
import AdminCoders from './pages/AdminCoders';
import AdminSettings from './pages/AdminSettings';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import CoderLayout from './components/CoderLayout';
import CoderHistory from './pages/CoderHistory';
import CoderAnalytics from './pages/CoderAnalytics';
import AdminAuditLogs from './pages/AdminAuditLogs';
import AdminPayerRules from './pages/AdminPayerRules';
import { Toaster } from 'react-hot-toast';
import AdminQA from './pages/AdminQA';
import Home from './pages/Home';

export default function App() {
  const { user, branding } = useAuthStore();

  useEffect(() => {
    // 1. Browser Tab Metadata
    document.title = branding.name ? `${branding.name}` : "CodeNucleus | Enterprise AI";
    
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = branding.logoUrl || "/favicon.svg";
    }

    // 2. Global Styling (CSS Variables)
    document.documentElement.style.setProperty('--brand-color', branding.primaryColor || '#3b82f6');
    document.documentElement.style.setProperty('--brand-font', branding.fontFamily || 'Inter');
    
  }, [branding]);

  return (
    <Router>
          <Toaster position="top-right" reverseOrder={false} />

      <div className="h-screen bg-slate-900 flex flex-col text-slate-200 overflow-hidden">
        <Navbar />
        
        <div className="grow flex flex-col overflow-hidden">
          <Routes>
<Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* 🔴 Super Admin: Sidebar Layout */}
            <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
              <Route element={<SuperAdminLayout />}>
                <Route path="/superadmin/dashboard" element={<SuperAdminOverview />} />
                <Route path="/superadmin/organizations" element={<SuperAdminOrganizations />} />
                <Route path="/superadmin" element={<Navigate to="/superadmin/dashboard" replace />} />
              </Route>
            </Route>

            {/* 🔵 Admin (The Boss): Uses the Sidebar Layout */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<AdminLayout />}>
                {/* These are 'Children' of the AdminLayout */}
                <Route path="/admin/dashboard" element={<AdminOverview />} />
                <Route path="/admin/coders" element={<AdminCoders />} />
                <Route path="/admin/qa" element={<AdminQA />} />
                <Route path="/admin/logs" element={<AdminAuditLogs />} />
<Route path="/admin/rules" element={<AdminPayerRules/>} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* 🟢 Coder: Simple workspace with Top Navbar */}
            <Route element={<ProtectedRoute allowedRoles={['coder']} />}>
  <Route element={<CoderLayout />}>
    <Route path="/workspace" element={<CoderWorkspace />} />
    <Route path="/workspace/history" element={<CoderHistory />} />
    <Route path="/workspace/analytics" element={<CoderAnalytics/>} />
  </Route>
</Route>

            {/* Fallback */}
            <Route path="/unauthorized" element={<h1 className="text-center text-red-500 text-2xl mt-10">403 - Unauthorized</h1>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}