import { lazy } from 'react';

const ShippingRoutes = [
  {
    path: '/shipping/editShipping_zoens/edit/:id',
    component: lazy(() => import('../../views/shipping/editShipping_zoens')),
  },
  {
    path: '/shipping/editPackaging/edit/:id',
    component: lazy(() => import('../../views/shipping/editPackaging')),
  },
  {
    path: '/shipping/editCarrier/edit/:id',
    component: lazy(() => import('../../views/shipping/editCarriers')),
  },
  {
    path: '/shipping/carriers',
    component: lazy(() => import('../../views/shipping/carriers')),
    exact: true,
  },
  {
    path: '/shipping/packaging',
    component: lazy(() => import('../../views/shipping/packaging')),
    exact: true,
  },
  {
    path: '/shipping/shipping_zoens',
    component: lazy(() => import('../../views/shipping/shipping_zoens')),
    exact: true,
  },
];

export default ShippingRoutes;
