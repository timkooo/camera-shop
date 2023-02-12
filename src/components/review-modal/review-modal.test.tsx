import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeFakeCamera } from '../../utils/mocks';
import { ReviewModal } from './review-modal';

const mockStore = configureMockStore();
const camera = makeFakeCamera();

describe('Component: ReviewModal', () => {
  it('should render correctly', () => {
    const store = mockStore();

    render(
      <Provider store={store}>
        <ReviewModal product={camera} modalVisible onModalToggle={jest.fn()} afterModalToggle={jest.fn()} />
      </Provider>
    );

    expect(screen.getByText(/Оставить отзыв/i)).toBeInTheDocument();
    expect(screen.getByText(/Отправить отзыв/i)).toBeInTheDocument();
  });
});
