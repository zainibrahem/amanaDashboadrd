import { lazy } from 'react';

const WalletRoutes = [
  {
    path: '/wallet/index',
    component: lazy(() => import('../../views/wallet/index')),
    exact: true,
  },
 
];

export default WalletRoutes;
