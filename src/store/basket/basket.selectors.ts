import { NameSpace } from '../../const';
import { RootState } from '../../types/store';

export const selectBasket = (state: RootState) => state[NameSpace.Basket].basket;

