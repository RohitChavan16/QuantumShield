import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import api from './services/api';

import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { ErrorBoundary } from './contexts/ErrorBoundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  useEffect(() => {
    api.get('/healthz')
      .then(() => setApiConnected(true))
      .catch(() => setApiConnected(false));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <div className="fixed bottom-4 left-4 z-50">
            {apiConnected === null ? (
              <div className="bg-surface-alt text-text-muted px-3 py-1.5 rounded shadow-lg text-xs border border-border">API: Checking...</div>
            ) : apiConnected ? (
              <div className="bg-low/10 text-low px-3 py-1.5 rounded shadow-lg text-xs border border-low/20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-low animate-pulse"></span> API: Connected
              </div>
            ) : (
              <div className="bg-critical/10 text-critical px-3 py-1.5 rounded shadow-lg text-xs border border-critical/20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-critical"></span> API: Unreachable
              </div>
            )}
          </div>
          <ErrorBoundary>
            <RouterProvider router={router} />
          </ErrorBoundary>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
