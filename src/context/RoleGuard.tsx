// auth/RoleGuard.tsx
import { useAuth } from './UseAuth';
import type { ReactNode } from 'react';

interface RoleGuardProps {
  allowedRoles: ('admin' | 'user')[];
  children: ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}