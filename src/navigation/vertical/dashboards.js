import { Home, Circle, PieChart } from 'react-feather';

export default [
  {
    id: 'dashboards',
    title: 'لوحة التحكم',
    icon: <PieChart size={20} />,
    badge: 'light-warning',
    badgeText: '2',
    navLink: '/admin',

    // children: [
    //   {
    //     id: 'analyticsDash',
    //     title: 'Analytics',
    //     icon: <Circle size={12} />,
    //     navLink: '/admin',
    //   },
    //   // {
    //   //   id: 'eCommerceDash',
    //   //   title: 'eCommerce',
    //   //   icon: <Circle size={12} />,
    //   //   navLink: '/dashboard/ecommerce',
    //   // },
    // ],
  },
];
