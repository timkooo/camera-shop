import { createSelector } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { RootState } from '../../types/store';

export const selectReviews = (state: RootState) => state[NameSpace.Reviews].reviews;
export const selectDoesReviewsLoading = (state: RootState) => state[NameSpace.Reviews].doesReviewsLoading;