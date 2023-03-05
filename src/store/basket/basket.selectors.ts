import { createSelector } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { RootState } from '../../types/store';

export const selectBasketItems = (state: RootState) => state[NameSpace.Basket].basketItems;
export const selectBasketPrice = (state: RootState) => state[NameSpace.Basket].basketPrice;
export const selectBasketQuantity = (state: RootState) => state[NameSpace.Basket].basketQuantity;
export const selectDiscount = (state: RootState) => state[NameSpace.Basket].discount;
export const selectDiscountPrice = createSelector(selectBasketPrice, selectDiscount, (price, discount) => price / 100 * discount);
export const selectFinalPrice = createSelector(selectBasketPrice, selectDiscountPrice, (price, discountPrice) => price - discountPrice);
