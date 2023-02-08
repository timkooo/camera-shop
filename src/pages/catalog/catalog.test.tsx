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
  it('should render correctly', () => {
    const cameras = makeFakeCameras();
    const store = mockStore({
      [NameSpace.Application]: {
        promo: makeFakePromo(),
        parameters: {},
        sorting: {
          _sort: 'price',
          _order: 'asc',
        },
      },
      [NameSpace.Cameras]: {
        cameras: cameras,
        areCamerasLoading: false,
        camerasAmount: 40,
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
    expect(screen.getByText(cameras[3].name)).toBeInTheDocument();
  });

  // eslint-disable-next-line jest/no-identical-title
  it('should render correctly', () => {
    const store = mockStore({
      [NameSpace.Application]: {
        promo: null,
        parameters: {},
        sorting: {
          _sort: 'price',
          _order: 'asc',
        },
      },
      [NameSpace.Cameras]: {
        cameras: [],
        areCamerasLoading: false,
        camerasAmount: 40,
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
    expect(screen.getByText(/Sorry, there was an error loading data/i)).toBeInTheDocument();
  });
});
