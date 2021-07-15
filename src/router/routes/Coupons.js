import { lazy } from 'react';

const CouponRoutes = [
  //   {
  //     path: '/shipping/editShipping_zoens/edit/:id',
  //     component: lazy(() => import('../../views/shipping/editShipping_zoens')),
  //   },
  //   {
  //     path: '/shipping/editPackaging/edit/:id',
  //     component: lazy(() => import('../../views/shipping/editPackaging')),
  //   },

  {
    path: '/promotion/coupon/editCoupon/edit/:id',
    component: lazy(() => import('../../views/promotion/editCuopones')),
    exact: true,
  },
  {
    path: '/promotion/coupon',
    component: lazy(() => import('../../views/promotion/coupones')),
    exact: true,
  },
];

export default CouponRoutes;
