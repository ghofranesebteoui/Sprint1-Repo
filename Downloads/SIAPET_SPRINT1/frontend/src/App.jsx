import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { theme } from './styles/theme';
import './styles/GlobalStyles.css';
import './styles/animations.css';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterEtudiant from './pages/RegisterEtudiant';
import RegisterEnseignant from './pages/RegisterEnseignant';
import RegisterSuccess from './pages/RegisterSuccess';
import DemandeAcces from './pages/DemandeAcces';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import Profile from './pages/Profile';
import DashboardLayout from './components/Layout/DashboardLayout';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import RecteurDashboard from './pages/dashboards/RecteurDashboard';
import DirecteurDashboard from './pages/dashboards/DirecteurDashboard';
import EnseignantDashboard from './pages/dashboards/EnseignantDashboard';
import EtudiantDashboard from './pages/dashboards/EtudiantDashboard';
import UserManagement from './pages/UserManagement';
import EmailBroadcast from './pages/EmailBroadcast';
import Invitations from './pages/Invitations';
import DemandesAcces from './pages/DemandesAcces';

// Composant pour rediriger vers le bon dashboard selon le rôle
const DashboardRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role?.toLowerCase() || 'admin';
  return <Navigate to={`/dashboard/${role}`} replace />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/etudiant" element={<RegisterEtudiant />} />
          <Route path="/register/enseignant" element={<RegisterEnseignant />} />
          <Route path="/register-success" element={<RegisterSuccess />} />
          <Route path="/demande-acces" element={<DemandeAcces />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Protected Routes - Dashboard */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardRedirect />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/users/:userType" element={<UserManagement />} />
            <Route path="admin/email-broadcast" element={<EmailBroadcast />} />
            <Route path="admin/invitations" element={<Invitations />} />
            <Route path="admin/demandes-acces" element={<DemandesAcces />} />
            <Route path="recteur" element={<RecteurDashboard />} />
            <Route path="directeur" element={<DirecteurDashboard />} />
            <Route path="enseignant" element={<EnseignantDashboard />} />
            <Route path="etudiant" element={<EtudiantDashboard />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
