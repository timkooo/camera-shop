import { NameSpace } from '../../const';
import { RootState } from '../../types/store';

export const selectBasketItems = (state: RootState) => state[NameSpace.Basket].basketItems;
export const selectBasketPrice = (state: RootState) => state[NameSpace.Basket].basketPrice;
export const selectBasketQuantity = (state: RootState) => state[NameSpace.Basket].basketQuantity;

