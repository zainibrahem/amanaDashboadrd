import { Image, Circle, ChevronsRight, Tag } from 'react-feather';
import './style.css';
export default [
  {
    id: 'wallet',
    title: 'المحفظة',
    icon: <Tag size={20} />,
    badge: 'light-warning',
    badgeText: '0',
    children: [
        {
          id: 'walletIndex',
          title: 'استعراض',
          icon: <Circle size={12} />,
          navLink: '/wallet/index',
        }
    ]
  }
]