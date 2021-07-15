import { lazy } from 'react';

const CatalogRoutes = [
  {
    path: '/catalog/attribute/edit/:id',
    component: lazy(() => import('../../views/catalog/editAttribute')),
  },
  {
    path: '/catalog/attribute/entities',
    component: lazy(() => import('../../views/catalog/entitiesAttribute')),
  },
  {
    path: '/catalog/groups/editManufacturer',
    component: lazy(() => import('../../views/catalog/editManufacturer')),
  },
  {
    path: '/catalog/attribute',
    component: lazy(() => import('../../views/catalog/attribute')),
    exact: true,
  },
  {
    path: '/catalog/product',
    component: lazy(() => import('../../views/catalog/product')),
    exact: true,
  },
  {
    path: '/catalog/product/create',
    component: lazy(() => import('../../views/catalog/createProduct')),
    exact: true,
  },
  {
    path: '/catalog/product/edit/:id',
    component: lazy(() => import('../../views/catalog/editProduct')),
  },
  {
    path: '/catalog/manufacturer',
    component: lazy(() => import('../../views/catalog/manufacturer')),
    exact: true,
  },
  {
    path: '/catalog/manufacturer/edit/:id',
    component: lazy(() => import('../../views/catalog/editManufacturer')),
  },
];

export default CatalogRoutes;
