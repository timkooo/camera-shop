import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { Filters, Filters2 } from '../../types/filters';

export type StringRecord = {[key : string] : string};

export type Sorting = { 
  _sort?: string,
  _order?: string,
};

export type Price = {
  price_gte?: number,
  price_lte?: number,
};

export type InitialState = {
  price: Price;
  filters: Filters2;
  sorting: Sorting;
  parameters: StringRecord;
};

const initialState: InitialState = {
  price: {
    price_gte: 6000,
    price_lte: 8000,
  },
  filters: {},
  sorting: {
    _sort: 'price',
    _order: 'asc',
  },
  parameters: {},
};

export const applicationSlice = createSlice({
  name: NameSpace.Application,
  initialState,
  reducers: {
    updateFilters(state, action: PayloadAction<Filters2>) {
      state.filters = action.payload;
    },
    updateSorting(state, action: PayloadAction<Sorting>) {
      state.sorting = action.payload;
    },
    updateParameters(state, action: PayloadAction<StringRecord>) {
      state.parameters = action.payload;
    },
    updatePrice(state, action: PayloadAction<Price>) {
      state.price = action.payload;
    },
  },
});

export const { updateFilters, updateParameters, updateSorting, updatePrice } = applicationSlice.actions;
