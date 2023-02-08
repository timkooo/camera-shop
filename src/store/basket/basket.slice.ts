import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { Camera } from '../../types/camera';

export type InitialState = {
  basket: Camera[];
};

const initialState: InitialState = {
  basket: [],
};

export const basketSlice = createSlice({
  name: NameSpace.Basket,
  initialState,
  reducers: {
    addToBasket(state, action: PayloadAction<Camera>) {
      state.basket = [...state.basket, action.payload];
    },
    removeFromBasket(state, action: PayloadAction<number>) {
      state.basket = [...state.basket].filter((item) => item.id !== action.payload);
    }
  },
});

export const { addToBasket, removeFromBasket } = basketSlice.actions;
