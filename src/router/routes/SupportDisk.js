import { lazy } from 'react';
let tabId = localStorage.getItem('id');

const SupportDiskRoutes = [
  //   {
  //     path: '/shipping/editShipping_zoens/edit/:id',
  //     component: lazy(() => import('../../views/shipping/editShipping_zoens')),
  //   },
  //   {
  //     path: '/shipping/editPackaging/edit/:id',
  //     component: lazy(() => import('../../views/shipping/editPackaging')),
  //   },

  // {
  //   path: '/supportDisk/messages/labelOf/1',
  //   component: lazy(() => import('../../views/supportDisk/editMessages')),
  //   exact: true,
  // },
  // {
  //   path: '/supportDisk/messages/labelOf/2',
  //   component: lazy(() => import('../../views/supportDisk/editMessages')),
  //   exact: true,
  // },
  // {
  //   path: '/supportDisk/messages/labelOf/3',
  //   component: lazy(() => import('../../views/supportDisk/editMessages')),
  //   exact: true,
  // },
  // {
  //   path: '/supportDisk/messages/labelOf/4',
  //   component: lazy(() => import('../../views/supportDisk/editMessages')),
  //   exact: true,
  // },
  // {
  //   path: '/supportDisk/messages/labelOf/5',
  //   component: lazy(() => import('../../views/supportDisk/editMessages')),
  //   exact: true,
  // },
  // {
  //   path: '/supportDisk/refunds/editRefunds/edit/:id',
  //   component: lazy(() => import('../../views/supportDisk/editRefunds')),
  //   exact: true,
  // },
  // {
  //   path: '/supportDisk/disputes/editDisputes/edit/:id',
  //   component: lazy(() => import('../../views/supportDisk/editDisputes')),
  //   exact: true,
  // },

  {
    path: '/supportDisk/disputes',
    component: lazy(() => import('../../views/supportDisk/disputes')),
    exact: true,
  },
  {
    path: '/supportDisk/refunds',
    component: lazy(() => import('../../views/supportDisk/refunds')),
    exact: true,
  },
  {
    path: '/supportDisk/disputes/:id',
    component: lazy(() => import('../../views/supportDisk/singleDispute')),
    exact: true,
  },
  {
    path: '/supportDisk/messages',
    component: lazy(() => import('../../views/supportDisk/messages')),
    exact: true,
  },
  {
    path: '/support/message/:id',
    component: lazy(() => import('../../views/supportDisk/singleMessage')),
    exact: true,
  },
];

export default SupportDiskRoutes;
