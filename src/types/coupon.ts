const coupons = ['camera-333', 'camera-444', 'camera-555'] as const;

export type Coupon = typeof coupons[number];

export type CouponPost = {
  "coupon": Coupon,
};
