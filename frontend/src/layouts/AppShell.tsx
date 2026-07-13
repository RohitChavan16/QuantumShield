import { Outlet, Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function AppShell() {
  const location = useLocation();

  const navItems = [
    { name: 'Fusion Dashboard', path: ROUTES.DASHBOARD },
    { name: 'Alerts', path: ROUTES.ALERTS },
    { name: 'Threat Timeline', path: ROUTES.THREAT_TIMELINE },
    { name: 'Transactions', path: ROUTES.TRANSACTIONS },
    { name: 'Quantum Assets', path: ROUTES.QUANTUM },
    { name: 'AI Investigation', path: ROUTES.AI_INVESTIGATION },
    { name: 'Executive', path: ROUTES.EXECUTIVE },
    { name: 'Case Management', path: ROUTES.CASE_MANAGEMENT },
    { name: 'Settings', path: ROUTES.SETTINGS },
  ];

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-800 bg-[#070A12] flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-accent tracking-wider">QuantumShield</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block px-4 py-2.5 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-gray-800 text-white font-medium' 
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-[#0B0F1A]">
          <div></div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-900 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-800">
              <span className="w-2 h-2 rounded-full bg-gray-500"></span>
              <span className="text-gray-400">WS Disconnected</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
