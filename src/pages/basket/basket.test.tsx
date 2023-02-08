import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { NameSpace } from '../../const';
import { makeFakeCameras } from '../../utils/mocks';
import { Basket } from './basket';

const mockStore = configureMockStore();

describe('Component: Basket', () => {
  it('should render correctly', () => {
    const cameras = makeFakeCameras();
    const store = mockStore({
      [NameSpace.Basket]: {
        basket: cameras,
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
    expect(screen.getByText(cameras[0].name)).toBeInTheDocument();
    expect(screen.getByText(cameras[3].name)).toBeInTheDocument();
  });
});
