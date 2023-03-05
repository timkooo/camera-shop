import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { NameSpace } from '../../const';
import { BasketLink } from './basket-link';

const mockStore = configureMockStore();

describe('Component: BasketLink', () => {
  it('should render correctly', () => {
    const store = mockStore({
      [NameSpace.Basket]: {
        basketQuantity: 90909
      }
    });

    render(
      <MemoryRouter>
        <Provider store={store}>
          <BasketLink />
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/90909/i)).toBeInTheDocument();
  });
});
