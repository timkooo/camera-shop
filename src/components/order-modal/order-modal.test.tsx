import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { OrderModal } from './order-modal';

const mockStore = configureMockStore();

describe('Component: OrderModal', () => {
  it('should render correctly', () => {
    const store = mockStore();

    render(
      <MemoryRouter>
        <Provider store={store}>
          <OrderModal modalVisible onModalToggle={jest.fn()}/>
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Спасибо за покупку/i)).toBeInTheDocument();
    expect(screen.getByText(/Вернуться к покупкам/i)).toBeInTheDocument();
  });
});
