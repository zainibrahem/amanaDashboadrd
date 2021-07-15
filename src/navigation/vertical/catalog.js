import { Image, Circle, ChevronsRight, Tag } from 'react-feather';
import './style.css';
export default [
  {
    id: 'catalog',
    title: 'كاتالوج',
    icon: <Tag size={20} />,
    badge: 'light-warning',
    badgeText: '0',
    children: [
      {
        id: 'attribute',
        title: 'السمات',
        icon: <Circle size={12} />,
        navLink: '/catalog/attribute',
      },
      {
        id: 'product',
        title: 'المنتجات',
        icon: <Circle size={12} />,
        navLink: '/catalog/product',
      },
      {
        id: 'manufacturer',
        title: 'الشركات المصنعة',
        icon: <Circle size={12} />,
        navLink: '/catalog/manufacturer',
      },
    ],
  },
];
