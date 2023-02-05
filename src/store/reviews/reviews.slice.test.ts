import { makeFakeReviews } from '../../utils/mocks';
import { loadReviews } from '../api-actions';
import { InitialState, reviewsSlice } from './reviews.slice';

const reviews = makeFakeReviews();

describe('Reducer: reviewsSlice', () => {

  let state : InitialState;

  beforeEach(() => {
    state = {
      reviews: [],
      doesReviewsLoading: false,
    };
  });

  it('should update reviews by load reviews', () => {
    expect(
      reviewsSlice.reducer(state, {
        type: loadReviews.fulfilled.type,
        payload: reviews,
      })
    ).toEqual({
      reviews: reviews,
      doesReviewsLoading: false,
    });
  });

});
