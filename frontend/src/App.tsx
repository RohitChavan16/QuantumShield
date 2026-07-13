import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import api from './services/api';

function App() {
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  useEffect(() => {
    api.get('/healthz')
      .then(() => setApiConnected(true))
      .catch(() => setApiConnected(false));
  }, []);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        {apiConnected === null ? (
          <div className="bg-gray-800 text-gray-400 px-3 py-1 rounded shadow-lg text-xs border border-gray-700">API: Checking...</div>
        ) : apiConnected ? (
          <div className="bg-emerald-950 text-emerald-400 px-3 py-1 rounded shadow-lg text-xs border border-emerald-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> API: Connected
          </div>
        ) : (
          <div className="bg-rose-950 text-rose-400 px-3 py-1 rounded shadow-lg text-xs border border-rose-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> API: Unreachable
          </div>
        )}
      </div>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
