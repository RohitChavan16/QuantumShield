import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { EmptyState } from '../components/ui/EmptyState';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export function RequireRole({ children, roles }: { children: React.ReactNode; roles: string[] }) {
  const { user } = useAuth();
  
  if (!user || !roles.includes(user.role)) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <EmptyState
          icon={ShieldAlert}
          title="Access Denied"
          description={`You must have one of these roles: ${roles.join(', ')} to view this page.`}
          action={
            <Button onClick={() => window.history.back()} variant="outline">
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
}
