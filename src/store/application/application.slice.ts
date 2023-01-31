import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { Filters, Filters2 } from '../../types/filters';

export type StringRecord = {[key : string] : string};
export type Sorting = { 
  _sort?: string,
  _order?: string,
};

export type InitialState = {
  // filters: Filters;
  filters: Filters2;
  sorting: Sorting;
  parameters: StringRecord;
  currentPage: number;
};

const initialState: InitialState = {
  filters: {},
  // filters: {
  //   id: [],
  //   name: [],
  //   vendorCode: [],
  //   type: [],
  //   category: [],
  //   description: [],
  //   level: [],
  //   rating: [],
  //   price: [],
  //   previewImg: [],
  //   previewImg2x: [],
  //   previewImgWebp: [],
  //   previewImgWebp2x: [],
  //   reviewCount: []
  // },
  sorting: {
    _sort: 'price',
    _order: 'asc',
  },
  parameters: {
    _start : "9",
    _end : "18",
  },
  currentPage: 1,
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
    }
  },
});

export const { updateFilters, updateParameters, updateSorting } = applicationSlice.actions;
