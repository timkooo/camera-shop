import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { BasketModal } from './basket-modal';

const mockStore = configureMockStore();

describe('Component: BasketModal', () => {
  it('should render correctly', () => {
    const store = mockStore();

    render(
      <MemoryRouter>
        <Provider store={store}>
          <BasketModal modalVisible onModalToggle={jest.fn()}/>
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Товар успешно добавлен в корзину/i)).toBeInTheDocument();
    expect(screen.getByText(/Продолжить покупки/i)).toBeInTheDocument();
  });
});
