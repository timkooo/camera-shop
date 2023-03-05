import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { NameSpace } from '../../const';
import { routesConfig } from '../../routes-config';
import { BasketItemType } from '../../store/basket/basket.slice';
import { makeFakeBasketItem, makeFakeCameras, makeFakePromo } from '../../utils/mocks';
import thunk from 'redux-thunk';

const mockStore = configureMockStore([thunk]);
const fakePromo = makeFakePromo();

describe('Component: Root', () => {
  it('should render correctly', () => {
    const fakeBasketItems: BasketItemType[] = [];
    const cameras = makeFakeCameras();
    cameras.map((camera) => fakeBasketItems.push(makeFakeBasketItem(camera, 1)));
    const store = mockStore({
      [NameSpace.Cameras]: {
        cameras: cameras,
        searchResults: cameras,
      },
      [NameSpace.Basket]: {
        basketItems: fakeBasketItems,
        basketQuantity: 5,
      },
      [NameSpace.Application]: {
        price: {},
        minMaxPrice: {
          minPrice: null,
          maxPrice: null,
        },
        filters: {},
        sorting: {
          _sort: 'price',
          _order: 'asc',
        },
        parameters: {},
        promo: fakePromo,
        isPromoLoading: false,
      }
    });

    render(
      <Provider store={store}>
        <RouterProvider router={createMemoryRouter(routesConfig)} />
      </Provider>
    );

    expect(screen.getByText(/Интернет-магазин фото- и видеотехники/i)).toBeInTheDocument();
    expect(screen.getByTestId(/site-menu/i)).toBeInTheDocument();
  });
});
