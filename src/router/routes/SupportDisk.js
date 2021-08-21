import { lazy } from 'react';
let tabId = localStorage.getItem('id');

const SupportDiskRoutes = [
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
  {
    path: '/ticket/:id',
    component: lazy(() => import('../../views/pages/profile/singleTickt')),
    exact: true,
  },
];

export default SupportDiskRoutes;
