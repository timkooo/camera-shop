import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { Camera } from '../../types/camera';

export type BasketItemType = Camera & {
  quantity : number;
  totalPrice : number;
}

export type InitialState = {
  basketItems: BasketItemType[];
  basketPrice: number;
  basketQuantity: number;
};

const initialState: InitialState = {
  basketItems: [],
  basketPrice: 0,
  basketQuantity: 0,
};

export const basketSlice = createSlice({
  name: NameSpace.Basket,
  initialState,
  reducers: {
    addToBasket(state, action: PayloadAction<Camera>) {
      const basketItem = {...action.payload, quantity : 1, totalPrice : action.payload.price};
      state.basketItems = [...state.basketItems, basketItem];
      state.basketPrice += action.payload.price;
      state.basketQuantity += 1;
    },
    removeFromBasket(state, action: PayloadAction<number>) {
      const price = state.basketItems.find((item) => item.id === action.payload)?.totalPrice;
      const quantity = state.basketItems.find((item) => item.id === action.payload)?.quantity;
      state.basketItems = [...state.basketItems].filter((item) => item.id !== action.payload);
      if (price) {
        state.basketPrice -= price;
      }
      if (quantity) {
        state.basketQuantity -= quantity;
      }
    },
    increaseQuantity(state, action: PayloadAction<Camera>) {
      const itemIndex = state.basketItems.findIndex((item) => item.id === action.payload.id);
      state.basketItems[itemIndex].quantity += 1;
      state.basketItems[itemIndex].totalPrice += action.payload.price;
      state.basketPrice += action.payload.price;
      state.basketQuantity += 1;
    },
    decreaseQuantity(state, action: PayloadAction<Camera>) {
      const itemIndex = state.basketItems.findIndex((item) => item.id === action.payload.id);
      state.basketItems[itemIndex].quantity -= 1;
      state.basketItems[itemIndex].totalPrice -= action.payload.price;
      state.basketPrice -= action.payload.price;
      state.basketQuantity -= 1;
    }
  },
});

export const { addToBasket, removeFromBasket, increaseQuantity, decreaseQuantity } = basketSlice.actions;
