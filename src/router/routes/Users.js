import { lazy } from 'react';

const UserRoutes = [
  //   {
  //     path: '/shipping/editShipping_zoens/edit/:id',
  //     component: lazy(() => import('../../views/shipping/editShipping_zoens')),
  //   },
  //   {
  //     path: '/shipping/editPackaging/edit/:id',
  //     component: lazy(() => import('../../views/shipping/editPackaging')),
  //   },

  {
    path: '/Admin/users/editUser/edit/:id',
    component: lazy(() => import('../../views/users/editUser')),
    exact: true,
  },
  {
    path: '/Admin/users',
    component: lazy(() => import('../../views/users/users')),
    exact: true,
  },
];

export default UserRoutes;
