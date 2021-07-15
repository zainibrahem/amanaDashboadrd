import { Image, Circle, ChevronsRight, Settings } from 'react-feather';

export default [
  {
    id: 'settings',
    title: 'الاعدادات',
    icon: <Settings size={20} />,
    badge: 'light-warning',
    badgeText: '0',
    children: [
      {
        id: 'userRoles',
        title: ' قواعد المستخدم',
        icon: <Circle size={12} />,
        navLink: '/settings/userRoles',
      },
      {
        id: 'taxs',
        title: 'الضرائب',
        icon: <Circle size={12} />,
        navLink: '/settings/taxs',
      },
      {
        id: 'configration',
        title: 'التكوين',
        icon: <Circle size={12} />,
        navLink: '/settings/configration',
      },
      {
        id: 'generalConfig',
        title: 'التكوين العام',
        icon: <Circle size={12} />,
        navLink: '/settings/generalConfig',
      },
    ],
  },
];
