import { createSlice } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { Review } from '../../types/review';
import { loadReviews } from '../api-actions';

export type InitialState = {
  reviews: Review[],
  doesReviewsLoading: boolean,
};

const initialState: InitialState = {
  reviews: [],
  doesReviewsLoading: false,
};

export const reviewsSlice = createSlice({
  name: NameSpace.Reviews,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
        state.doesReviewsLoading = false;
      })
      .addCase(loadReviews.pending, (state) => {
        state.doesReviewsLoading = true;
      })
      .addCase(loadReviews.rejected, (state) => {
        state.reviews = [];
        state.doesReviewsLoading = false;
      })
  },
});
