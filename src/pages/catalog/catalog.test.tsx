import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { NameSpace } from '../../const';
import { makeFakeCameras, makeFakePromo } from '../../utils/mocks';
import { Catalog } from './catalog';
import thunk from 'redux-thunk';

const mockStore = configureMockStore([thunk]);

describe('Component: Catalog', () => {
  it('should render correctly with cameras loaded', () => {
    const cameras = makeFakeCameras();
    const store = mockStore({
      [NameSpace.Application]: {
        promo: makeFakePromo(),
        parameters: {
          _start: 0,
          _end: 9,
        },
        sorting: {
          _sort: 'price',
          _order: 'asc',
        },
        price: {},
        minMaxPrice: {
          minPrice: null,
          maxPrice: null,
        },
      },
      [NameSpace.Cameras]: {
        cameras: cameras,
        areCamerasLoading: false,
        camerasAmount: cameras.length,
      },
      [NameSpace.Basket]: {
        basketItems: [],
      }
    });

    render(
      <MemoryRouter>
        <Provider store={store}>
          <Catalog />
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Новинка!/i)).toBeInTheDocument();
    expect(screen.getByText(/Каталог фото- и видеотехники/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Купить/i).length === cameras.length).toBe(true);
  });

  it('should render correctly without cameras', () => {
    const store = mockStore({
      [NameSpace.Application]: {
        promo: null,
        parameters: {},
        sorting: {
          _sort: 'price',
          _order: 'asc',
        },
        price: {},
        minMaxPrice: {
          minPrice: null,
          maxPrice: null,
        },
      },
      [NameSpace.Cameras]: {
        cameras: [],
        areCamerasLoading: false,
        camerasAmount: 0,
      }
    });

    render(
      <MemoryRouter>
        <Provider store={store}>
          <Catalog />
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Could not load promo/i)).toBeInTheDocument();
    expect(screen.getByText(/Sorry, no products were found matching your search. Try to change filter/i)).toBeInTheDocument();
  });
});
