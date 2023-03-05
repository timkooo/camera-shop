import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeFakeBasketItem, makeFakeCamera } from '../../utils/mocks';
import { ProductCard } from './product-card';
import { MemoryRouter } from 'react-router-dom';
import { NameSpace } from '../../const';

const mockStore = configureMockStore();

describe('Component: ProductCard', () => {
  it('should render correctly', () => {
    const fakeCamera = makeFakeCamera();
    const fakeBasketItem = makeFakeBasketItem(fakeCamera, 2);
    const store = mockStore({
      [NameSpace.Basket] : {
        basketItems: [ fakeBasketItem ],
      }
    });
    const handler = jest.fn();

    render(
      <MemoryRouter>
        <Provider store={store}>
          <ProductCard product={fakeCamera} onSelectedProductChange={handler}/>
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Всего оценок:/i)).toBeInTheDocument();
  });
});
