import { lazy } from 'react';

const StockRoutes = [
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
    path: '/stock/Inventories',
    component: lazy(() => import('../../views/stock/inventories')),
    exact: true,
  },
  {
    path: '/stock/suppliers',
    component: lazy(() => import('../../views/stock/suppliers')),
    exact: true,
  },
  {
    path: '/stock/warehouse',
    component: lazy(() => import('../../views/stock/warehouse')),
    exact: true,
  },
  {
    path: '/stock/Inventories/add/:id',
    component: lazy(() => import('../../views/stock/addInventorie')),
  },
];

export default StockRoutes;
