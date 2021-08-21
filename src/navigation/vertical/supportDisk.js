import { Image, Circle, ChevronsRight, Crosshair } from 'react-feather';
let tabId = localStorage.getItem('id');

export default [
  {
    id: 'supportDisk',
    title: 'مكتب الدعم',
    icon: <Crosshair size={20} />,

    badge: 'light-warning',
    badgeText: '0',

    children: [
      {
        id: 'messages',
        title: 'الرسائل',
        icon: <Circle size={12} />,
        navLink: `/supportDisk/messages`,
      },
      {
        id: 'disputes',
        title: 'نزاعات',
        icon: <Circle size={12} />,
        navLink: '/supportDisk/disputes',
      },
      {
        id: 'refunds',
        title: 'المبالغ المستردة',
        icon: <Circle size={12} />,
        navLink: '/supportDisk/refunds',
      },
      {
        id: 'ticket',
        title: 'ticket',
        permissions: ['admin', 'editor'],
        navLink: '/ticket/:id',
        newTab: true,
      },
    ],
  },
];
