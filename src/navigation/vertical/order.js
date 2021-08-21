import { Image, Circle, ChevronsRight, ShoppingCart } from 'react-feather';

export default [
  {
    id: 'order',
    title: 'الطلبات',
    icon: <ShoppingCart size={20} />,
    badge: 'light-warning',
    badgeText: '0',
    children: [
      {
        id: 'orders',
        title: 'الطلبات',
        icon: <Circle size={12} />,
        navLink: '/order/order',
      },

      {
        id: 'carts',
        title: 'سلات التسويق',
        icon: <Circle size={12} />,
        navLink: '/order/carts',
      },
      {
        id: 'cancelations',
        title: 'الالغائات',
        icon: <Circle size={12} />,
        navLink: '/order/cancelation',
      },
    ],
  },
];
