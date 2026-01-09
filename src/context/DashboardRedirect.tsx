import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './UseAuth';

interface DashboardRedirectProps {
  children: ReactNode;
}

export default function DashboardRedirect({
  children,
}: DashboardRedirectProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
