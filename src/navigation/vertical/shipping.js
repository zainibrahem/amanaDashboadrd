import { Image, Circle, ChevronsRight, Truck } from 'react-feather';

export default [
  {
    id: 'shipping',
    title: 'الشحن',
    icon: <Truck size={20} />,
    badge: 'light-warning',
    badgeText: '0',
    children: [
      {
        id: 'carriers',
        title: 'شركات النقل',
        icon: <Circle size={12} />,
        navLink: '/shipping/carriers',
      },
      {
        id: 'packaging',
        title: 'التعبئة والتغليف',
        icon: <Circle size={12} />,
        navLink: '/shipping/packaging',
      },
      {
        id: 'shipping zones',
        title: 'مناطق الشحن',
        icon: <Circle size={12} />,
        navLink: '/shipping/shipping_zoens',
      },
    ],
  },
];
