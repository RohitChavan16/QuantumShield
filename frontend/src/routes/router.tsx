import { createBrowserRouter } from 'react-router-dom';
import AppShell from '../layouts/AppShell';
import { ROUTES } from '../constants/routes';

import { Placeholder } from '../components/Placeholder';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { path: ROUTES.DASHBOARD, element: <Placeholder title="Fusion Dashboard" /> },
      { path: ROUTES.ALERTS, element: <Placeholder title="Alerts Management" /> },
      { path: ROUTES.THREAT_TIMELINE, element: <Placeholder title="Threat Timeline" /> },
      { path: ROUTES.TRANSACTIONS, element: <Placeholder title="Transaction Explorer" /> },
      { path: ROUTES.QUANTUM, element: <Placeholder title="Quantum Assets" /> },
      { path: ROUTES.AI_INVESTIGATION, element: <Placeholder title="AI Investigation" /> },
      { path: ROUTES.EXECUTIVE, element: <Placeholder title="Executive Dashboard" /> },
      { path: ROUTES.CASE_MANAGEMENT, element: <Placeholder title="Case Management" /> },
      { path: ROUTES.SETTINGS, element: <Placeholder title="System Settings" /> },
    ],
  },
]);
