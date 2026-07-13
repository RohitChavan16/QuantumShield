import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../layouts/AppShell';
import { ROUTES } from '../constants/routes';

import { RequireAuth, RequireRole } from '../contexts/RequireAuth';
import { Login } from '../pages/Login';
import { NotFound } from '../pages/NotFound';
import { FusionDashboard } from '../pages/FusionDashboard';
import { TransactionExplorer } from '../pages/TransactionExplorer';
import { ThreatTimeline } from '../pages/ThreatTimeline';
import { AttackGraph } from '../pages/AttackGraph';
import { QuantumDashboard } from '../pages/QuantumDashboard';
import { AiInvestigation } from '../pages/AiInvestigation';
import { CaseManagement } from '../pages/CaseManagement';
import { ExecutiveDashboard } from '../pages/ExecutiveDashboard';
import { Settings } from '../pages/Settings';

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    errorElement: <NotFound />,
    children: [
      { index: true, element: <FusionDashboard /> },
      { path: ROUTES.ALERTS, element: <AttackGraph /> },
      { path: ROUTES.THREAT_TIMELINE, element: <ThreatTimeline /> },
      { path: ROUTES.TRANSACTIONS, element: <TransactionExplorer /> },
      { path: ROUTES.QUANTUM, element: <QuantumDashboard /> },
      { path: ROUTES.AI_INVESTIGATION, element: <AiInvestigation /> },
      { 
        path: ROUTES.EXECUTIVE, 
        element: <RequireRole roles={['admin', 'executive']}><ExecutiveDashboard /></RequireRole>
      },
      { path: ROUTES.CASE_MANAGEMENT, element: <CaseManagement /> },
      { 
        path: ROUTES.SETTINGS, 
        element: <RequireRole roles={['admin']}><Settings /></RequireRole>
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
