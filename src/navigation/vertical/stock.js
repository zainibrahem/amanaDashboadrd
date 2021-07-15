import { Image, Circle, ChevronsRight, Grid } from 'react-feather';

export default [
  {
    id: 'stock',
    title: 'مخزون',
    icon: <Grid size={20} />,
    badge: 'light-warning',
    badgeText: '0',
    children: [
      {
        id: 'inventories',
        title: 'المخزونات',
        icon: <Circle size={12} />,
        navLink: '/stock/inventories',
      },
      {
        id: 'warehouses',
        title: 'المستودعات',
        icon: <Circle size={12} />,
        navLink: '/stock/warehouse',
      },
      {
        id: 'suppliers',
        title: 'الموردون',
        icon: <Circle size={12} />,
        navLink: '/stock/suppliers',
      },
    ],
  },
];
