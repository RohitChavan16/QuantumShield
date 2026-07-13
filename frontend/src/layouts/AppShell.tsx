import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  Radar, ArrowLeftRight, Activity, Share2, Atom, Sparkles, 
  ClipboardList, BarChart3, Settings as SettingsIcon,
  Menu, Bell, LogOut, Shield, ChevronLeft
} from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../hooks/useWebSocket';

export function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const { status } = useWebSocket();
  const isConnected = status === 'open'; // Basic status connection

  const navItems = [
    { name: 'Fusion Dashboard', path: '/', icon: Radar },
    { name: 'Transaction Explorer', path: ROUTES.TRANSACTIONS, icon: ArrowLeftRight },
    { name: 'Threat Timeline', path: ROUTES.THREAT_TIMELINE, icon: Activity },
    { name: 'Attack Graph', path: ROUTES.ALERTS, icon: Share2 },
    { name: 'Quantum Risk', path: ROUTES.QUANTUM, icon: Atom },
    { name: 'AI Investigation', path: ROUTES.AI_INVESTIGATION, icon: Sparkles },
    { name: 'Case Management', path: ROUTES.CASE_MANAGEMENT, icon: ClipboardList },
  ];

  if (user?.role === 'admin' || user?.role === 'executive') {
    navItems.push({ name: 'Executive View', path: ROUTES.EXECUTIVE, icon: BarChart3 });
  }
  
  if (user?.role === 'admin') {
    navItems.push({ name: 'Settings', path: ROUTES.SETTINGS, icon: SettingsIcon });
  }

  const currentRouteName = navItems.find(item => item.path === location.pathname || (item.path !== '/' && location.pathname.startsWith(item.path)))?.name || 'Dashboard';

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-text-primary font-sans">
      
      {/* Sidebar */}
      <aside className={`flex flex-col bg-surface border-r border-border transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <div className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
            <Shield className="h-6 w-6 text-accent shrink-0" />
            <span className="font-bold text-lg tracking-tight whitespace-nowrap">QuantumShield</span>
          </div>
          {sidebarCollapsed && <Shield className="h-6 w-6 text-accent shrink-0 mx-auto" />}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-md transition-colors group ${
                  isActive 
                    ? 'bg-surface-alt text-accent border-l-2 border-accent' 
                    : 'text-text-secondary hover:bg-surface-alt hover:text-text-primary border-l-2 border-transparent'
                }`
              }
            >
              <item.icon className={`h-5 w-5 shrink-0 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!sidebarCollapsed && <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-8 w-8 rounded-full bg-surface-alt flex items-center justify-center border border-border shrink-0">
                  <span className="text-xs font-medium text-text-primary">{user?.role?.substring(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-text-primary leading-none capitalize">{user?.role}</span>
                  <span className="text-xs text-text-muted mt-1">Logged In</span>
                </div>
              </div>
            )}
            <button 
              onClick={logout}
              className="p-2 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-alt transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-surface border-b border-border shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-alt transition-colors"
            >
              {sidebarCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            <h1 className="text-lg font-semibold">{currentRouteName}</h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Live Indicators */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${isConnected ? 'bg-low shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-critical animate-pulse'}`} />
                <span className="text-xs font-mono text-text-muted">{isConnected ? 'LIVE' : 'DISCONNECTED'}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5 font-mono text-sm text-text-secondary">
                <Activity className="h-4 w-4 text-accent" />
                <span>142 eps</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-alt transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-critical border border-surface"></span>
              </button>
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
