import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DoctorDetailPage } from './pages/DoctorDetailPage';
import { UserDashboard } from './pages/UserDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserRole } from './types';
import { Loader2 } from 'lucide-react';

// Import seed data functions for console access
import './services/seedData';

// Loading Screen Component
const LoadingScreen = () => (
  <div className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-4">
    <Loader2 className="w-10 h-10 text-primary animate-spin" />
    <p className="text-muted-foreground text-sm">Loading...</p>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }: { children?: React.ReactNode, allowedRoles?: UserRole[] }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

// Main App Content with Data Loading
const AppContent: React.FC = () => {
  const { loading: authLoading } = useAuth();
  const { loading: dataLoading } = useData();

  // Show loading only during initial auth check
  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/doctor/:id" element={<DoctorDetailPage />} />

        <Route path="/dashboard/user" element={
          <ProtectedRoute allowedRoles={[UserRole.USER]}>
            <UserDashboard />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/doctor" element={
          <ProtectedRoute allowedRoles={[UserRole.DOCTOR]}>
            <DoctorDashboard />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/admin" element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <AppContent />
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;