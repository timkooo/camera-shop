import {combineReducers} from '@reduxjs/toolkit';
import {NameSpace} from '../const';
import { applicationSlice } from './application/application.slice';
import { basketSlice } from './basket/basket.slice';
import { camerasSlice } from './cameras/cameras.slice';
import { reviewsSlice } from './reviews/reviews.slice';

export const rootReducer = combineReducers({
  [NameSpace.Application]: applicationSlice.reducer,
  [NameSpace.Cameras]: camerasSlice.reducer,
  [NameSpace.Reviews]: reviewsSlice.reducer,
  [NameSpace.Basket]: basketSlice.reducer,
});
