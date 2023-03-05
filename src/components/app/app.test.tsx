import {render, screen} from '@testing-library/react';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Provider } from 'react-redux';
import {
  RouterProvider,
  createMemoryRouter,
} from 'react-router-dom';
import { routesConfig } from '../../routes-config';
import { AppRoutes, NameSpace } from '../../const';
import thunk from 'redux-thunk';
import { makeFakeCamera, makeFakeCameras, makeFakePromo, makeFakeReviews } from '../../utils/mocks';
import { Catalog } from '../../pages/catalog/catalog';
import { createMemoryHistory } from 'history';

const mockStore = configureMockStore([thunk]);
window.scrollTo = jest.fn();

describe('Application Routing', () => {

  it('Should render "Catalog" when user navigate to "/"', () => {
    const router = createMemoryRouter(routesConfig, {
      initialEntries: [AppRoutes.Main],
    });
    const store = mockStore({
      [NameSpace.Application]: {
        price: {},
        minMaxPrice: {
          minPrice: null,
          maxPrice: null,
        },
        promo: makeFakePromo(),
        parameters: {},
        sorting: {
          _sort: 'price',
          _order: 'asc',
        },
      },
      [NameSpace.Cameras]: {
        cameras: makeFakeCameras(),
        areCamerasLoading: false,
        camerasAmount: 40,
        searchResults: [],
      },
      [NameSpace.Basket]: {
        basketItems: []
      }
    });

    render(
      <Provider store={store}>
        <RouterProvider router={router}/>);
      </Provider>
    );

    expect(screen.getByText(/Каталог фото- и видеотехники/i)).toBeInTheDocument();
  });

  it('Should render "Catalog" when user navigate to "/catalog"', () => {
    const router = createMemoryRouter(routesConfig, {
      initialEntries: [AppRoutes.Catalog],
    });
    const store = mockStore({
      [NameSpace.Application]: {
        price: {},
        minMaxPrice: {
          minPrice: null,
          maxPrice: null,
        },
        promo: makeFakePromo(),
        parameters: {},
        sorting: {
          _sort: 'price',
          _order: 'asc',
        },
      },
      [NameSpace.Cameras]: {
        cameras: makeFakeCameras(),
        areCamerasLoading: false,
        camerasAmount: 40,
        searchResults: [],
      },
      [NameSpace.Basket]: {
        basketItems: []
      }
    });

    render(
      <Provider store={store}>
        <RouterProvider router={router}/>);
      </Provider>
    );

    expect(screen.getByText(/Каталог фото- и видеотехники/i)).toBeInTheDocument();
  });

  it('Should render "Catalog" when user navigate to "/catalog/pages/:id"', () => {

    const routes = [
      {
        path: `${AppRoutes.Catalog}/page/3`,
        element: <Catalog />,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: [`${AppRoutes.Catalog}/page/3`],
    });

    const history = createMemoryHistory({ initialEntries: [`${AppRoutes.Catalog}/page/3`]});

    const store = mockStore({
      [NameSpace.Application]: {
        price: {},
        minMaxPrice: {
          minPrice: null,
          maxPrice: null,
        },
        promo: makeFakePromo(),
        parameters: {},
        sorting: {
          _sort: 'price',
          _order: 'asc',
        },
      },
      [NameSpace.Cameras]: {
        cameras: makeFakeCameras(),
        areCamerasLoading: false,
        camerasAmount: 40,
        searchResults: [],
      },
      [NameSpace.Basket]: {
        basketItems: []
      }
    });

    render(
      <Provider store={store}>
        <RouterProvider router={router}/>);
      </Provider>
    );

    expect(history.location.pathname).toBe(`${AppRoutes.Catalog}/page/3`);
  });

  it('Should render "Product" when user navigate to "/product/:id"', () => {
    const camera = makeFakeCamera(3);

    const router = createMemoryRouter(routesConfig, {
      initialEntries: ['/product/3'],
    });

    const store = mockStore({
      [NameSpace.Cameras]: {
        cameraById: camera,
        isCameraByIdLoading: false,
        similarCameras: makeFakeCameras(),
        areSimilarCamerasLoading: false,
        searchResults: [],
      },
      [NameSpace.Reviews]: {
        reviews: makeFakeReviews(),
      },
      [NameSpace.Basket]: {
        basketItems: []
      }
    });

    render(
      <Provider store={store}>
        <RouterProvider router={router}/>);
      </Provider>
    );

    expect(screen.getByText(/Похожие товары/i)).toBeInTheDocument();
  });

  it('Should render "Basket" when user navigate to "/basket"', () => {
    const camera = makeFakeCamera();

    const router = createMemoryRouter(routesConfig, {
      initialEntries: [`${AppRoutes.Basket}`],
    });

    const store = mockStore({
      [NameSpace.Cameras]: {
        camera: camera,
        isCameraByIdLoading: false,
        similarCameras: makeFakeCameras(),
        areSimilarCamerasLoading: false,
        searchResults: [],
      },
      [NameSpace.Basket]: {
        basket: makeFakeCameras(),
      },
      [NameSpace.Reviews]: {
        reviews: makeFakeReviews(),
      },
      [NameSpace.Basket]: {
        basketItems: []
      }
    });

    render(
      <Provider store={store}>
        <RouterProvider router={router}/>);
      </Provider>
    );

    expect(screen.getByText(/Если у вас есть промокод на скидку, примените его в этом поле/i)).toBeInTheDocument();
  });

});
