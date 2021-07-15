import { lazy } from 'react';

const DashboardRoutes = [
  // Dashboards
  {
    path: '/admin',
    component: lazy(() => import('../../views/dashboard/analytics')),
  },
  {
    path: '/dashboard/ecommerce',
    component: lazy(() => import('../../views/dashboard/ecommerce')),

    exact: true,
  },
];

export default DashboardRoutes;
