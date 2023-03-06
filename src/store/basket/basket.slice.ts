import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { Camera } from '../../types/camera';
import { loadDiscount, postOrder } from '../api-actions';

export type BasketItemType = Camera & {
  quantity : number;
  totalPrice : number;
}

export type InitialState = {
  basketItems: BasketItemType[];
  basketPrice: number;
  basketQuantity: number;
  discount: number;
};

const initialState: InitialState = {
  basketItems: [],
  basketPrice: 0,
  basketQuantity: 0,
  discount: 0,
};

export const basketSlice = createSlice({
  name: NameSpace.Basket,
  initialState,
  reducers: {
    addToBasket(state, action: PayloadAction<Camera>) {
      const itemIndex = state.basketItems.findIndex((item) => item.id === action.payload.id);
      if (itemIndex < 0) {
        const basketItem = {...action.payload, quantity : 1, totalPrice : action.payload.price};
        state.basketItems = [...state.basketItems, basketItem];
      } else {
        state.basketItems[itemIndex].quantity += 1;
        state.basketItems[itemIndex].totalPrice += action.payload.price;
      }
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
    decreaseQuantity(state, action: PayloadAction<Camera>) {
      const itemIndex = state.basketItems.findIndex((item) => item.id === action.payload.id);
      state.basketItems[itemIndex].quantity -= 1;
      state.basketItems[itemIndex].totalPrice -= action.payload.price;
      state.basketPrice -= action.payload.price;
      state.basketQuantity -= 1;
    },
    changeQuantity(state, action: PayloadAction<BasketItemType>) {
      const newItem = action.payload;
      const itemIndex = state.basketItems.findIndex((item) => item.id === newItem.id);
      const item = state.basketItems[itemIndex];
      state.basketPrice -= item.price * item.quantity;
      state.basketQuantity -= item.quantity;
      state.basketItems[itemIndex] = newItem;
      state.basketQuantity += newItem.quantity;
      state.basketPrice += newItem.totalPrice;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(loadDiscount.fulfilled, (state, action) => {
        state.discount = action.payload;
      })
      .addCase(loadDiscount.rejected, (state) => {
        state.discount = 0;
      })
      .addCase(postOrder.fulfilled, (state) => {
        state.basketItems = [];
        state.basketPrice = 0;
        state.basketQuantity = 0;
        state.discount = 0;
      });
  }
});

export const { addToBasket, removeFromBasket, decreaseQuantity, changeQuantity } = basketSlice.actions;
