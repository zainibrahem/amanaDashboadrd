import { lazy } from 'react';

const SettingsRoutes = [
  //   {
  //     path: '/shipping/editShipping_zoens/edit/:id',
  //     component: lazy(() => import('../../views/shipping/editShipping_zoens')),
  //   },
  //   {
  //     path: '/shipping/editPackaging/edit/:id',
  //     component: lazy(() => import('../../views/shipping/editPackaging')),
  //   },

  {
    path: '/settings/userRoles/editUserRoles/edit/:id',
    component: lazy(() => import('../../views/settings/editRol')),
    exact: true,
  },
  {
    path: '//taxs/editTax/edit/:id',
    component: lazy(() => import('../../views/settings/editTax')),
    exact: true,
  },
  {
    path: '/settings/configration/editConfigration/edit/:id',
    component: lazy(() => import('../../views/settings/editConfig')),
    exact: true,
  },
  {
    path: '/settings/generalConfig/editGeneralConfig/edit/:id',
    component: lazy(() => import('../../views/settings/editGConfig')),
    exact: true,
  },

  {
    path: '/settings/userRoles',
    component: lazy(() => import('../../views/settings/rol')),
    exact: true,
  },
  {
    path: '/settings/taxs',
    component: lazy(() => import('../../views/settings/tax')),
    exact: true,
  },
  {
    path: '/settings/configration',
    component: lazy(() => import('../../views/settings/config')),
    exact: true,
  },
  {
    path: '/settings/generalConfig',
    component: lazy(() => import('../../views/settings/generalConfig')),
    exact: true,
  },
];

export default SettingsRoutes;
