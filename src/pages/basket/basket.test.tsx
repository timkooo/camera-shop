import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { NameSpace } from '../../const';
import { BasketItemType } from '../../store/basket/basket.slice';
import { makeFakeBasketItem, makeFakeCameras } from '../../utils/mocks';
import { Basket } from './basket';

const mockStore = configureMockStore();

describe('Component: Basket', () => {
  it('should render correctly', () => {
    const fakeBasketItems: BasketItemType[] = [];
    const cameras = makeFakeCameras();
    cameras.map((camera) => fakeBasketItems.push(makeFakeBasketItem(camera, 1)));
    const store = mockStore({
      [NameSpace.Basket]: {
        basketItems: fakeBasketItems,
      },
    });

    render(
      <MemoryRouter>
        <Provider store={store}>
          <Basket />
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Если у вас есть промокод на скидку, примените его в этом поле/i)).toBeInTheDocument();
  });
});
