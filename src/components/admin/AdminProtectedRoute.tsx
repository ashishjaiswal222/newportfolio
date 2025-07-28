import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLogin from './AdminLogin';
import { Spinner } from '@/components/ui/spinner';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => {}} />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute; 