import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_PAGE_PARAMS, NameSpace } from '../../const';
import { Filters } from '../../types/filters';
import { Promo } from '../../types/promo';
import { loadMinMaxPrice, loadPromo } from '../api-actions';

export type StringRecord = { [key: string]: string };

export type Sorting = {
  _sort?: string;
  _order?: string;
};

export type Price = {
  price_gte?: number;
  price_lte?: number;
};

type MinMaxPrice = {
  minPrice: number | null;
  maxPrice: number | null;
}

export type InitialState = {
  price: Price;
  minMaxPrice: MinMaxPrice;
  filters: Filters;
  sorting: Sorting;
  parameters: StringRecord;
  promo: Promo | null;
  isPromoLoading: boolean;
};

const initialState: InitialState = {
  price: {},
  minMaxPrice: {
    minPrice: null,
    maxPrice: null,
  },
  filters: {},
  sorting: {
    _sort: 'price',
    _order: 'asc',
  },
  parameters: {},
  promo: null,
  isPromoLoading: false,
};

export const applicationSlice = createSlice({
  name: NameSpace.Application,
  initialState,
  reducers: {
    updateFilters(state, action: PayloadAction<Filters>) {
      state.filters = action.payload;
      state.parameters = DEFAULT_PAGE_PARAMS;
    },
    updateSorting(state, action: PayloadAction<Sorting>) {
      state.sorting = action.payload;
    },
    updateParameters(state, action: PayloadAction<StringRecord>) {
      state.parameters = action.payload;
    },
    updatePrice(state, action: PayloadAction<Price>) {
      state.price = action.payload;
      state.parameters = DEFAULT_PAGE_PARAMS;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loadPromo.fulfilled, (state, action) => {
        state.promo = action.payload;
        state.isPromoLoading = false;
      })
      .addCase(loadPromo.pending, (state) => {
        state.isPromoLoading = true;
      })
      .addCase(loadPromo.rejected, (state) => {
        state.promo = null;
        state.isPromoLoading = false;
      })
      .addCase(loadMinMaxPrice.fulfilled, (state, action) => {
        state.minMaxPrice = action.payload;
      });
  },
});

export const { updateFilters, updateParameters, updateSorting, updatePrice } =
  applicationSlice.actions;
