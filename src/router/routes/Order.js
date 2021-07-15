import { lazy } from 'react';

const OrderRoutes = [
  {
    path: '/stock/editSupplier/edit/:id',
    component: lazy(() => import('../../views/stock/editSupplier')),
  },
  {
    path: '/stock/editWarehouse/edit/:id',
    component: lazy(() => import('../../views/stock/editWarehouse')),
  },
  {
    path: '/stock/editInventorie/edit/:id',
    component: lazy(() => import('../../views/stock/editInventorie')),
  },
  {
    path: '/order/order',
    component: lazy(() => import('../../views/order/orders')),
    exact: true,
  },
  {
    path: '/order/carts',
    component: lazy(() => import('../../views/order/carts')),
    exact: true,
  },
  {
    path: '/order/cancelation',
    component: lazy(() => import('../../views/order/cancelations')),
    exact: true,
  },
];

export default OrderRoutes;
