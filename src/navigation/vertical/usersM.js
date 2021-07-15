import { Image, Circle, ChevronsRight, Users } from 'react-feather';

export default [
  {
    id: 'usersM',
    title: 'المسؤول',
    icon: <Users size={20} />,
    badge: 'light-warning',
    badgeText: '0',
    children: [
      {
        id: 'usersM',
        title: 'المستخدمون',
        icon: <Circle size={12} />,
        navLink: '/Admin/users',
      },
    ],
  },
];
