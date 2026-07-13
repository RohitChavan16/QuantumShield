import { ShieldAlert } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <EmptyState
        icon={ShieldAlert}
        title="Page Not Found"
        description="The page you are looking for does not exist or you do not have permission to view it."
        action={
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        }
      />
    </div>
  );
}
