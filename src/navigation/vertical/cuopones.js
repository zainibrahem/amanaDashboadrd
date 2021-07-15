import { Image, Circle, ChevronsRight, Navigation } from 'react-feather';

export default [
  {
    id: 'coupones_promotion',
    title: 'العروض الترويجية',
    icon: <Navigation size={20} />,
    badge: 'light-warning',
    badgeText: '0',
    children: [
      {
        id: 'coupones',
        title: 'القسائم',
        icon: <Circle size={12} />,
        navLink: '/promotion/coupon',
      },
    ],
  },
];
