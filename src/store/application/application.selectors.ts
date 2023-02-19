import { NameSpace } from '../../const';
import { RootState } from '../../types/store';

export const selectParameters = (state: RootState) => state[NameSpace.Application].parameters;
export const selectPromo = (state: RootState) => state[NameSpace.Application].promo;
export const selectIsPromoLoading = (state: RootState) => state[NameSpace.Application].isPromoLoading;
export const selectSorting = (state: RootState) => state[NameSpace.Application].sorting;
export const selectPrice = (state: RootState) => state[NameSpace.Application].price;
export const selectFilters = (state: RootState) => state[NameSpace.Application].filters;
export const selectMinMaxPrice = (state: RootState) => state[NameSpace.Application].minMaxPrice;
