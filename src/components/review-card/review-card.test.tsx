import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeFakeReview } from '../../utils/mocks';
import { MemoryRouter } from 'react-router-dom';
import { ReviewCard } from './review-card';

const mockStore = configureMockStore();

describe('Component: ReviewCard', () => {
  it('should render correctly', () => {
    const fakeReview = makeFakeReview();
    const store = mockStore();

    render(
      <MemoryRouter>
        <Provider store={store}>
          <ReviewCard review={fakeReview}/>
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(fakeReview.review)).toBeInTheDocument();
  });
});
