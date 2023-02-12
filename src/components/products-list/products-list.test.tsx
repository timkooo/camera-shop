import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { NameSpace } from '../../const';
import { makeFakeCameras } from '../../utils/mocks';
import { ProductsList } from './products-list';
import thunk from 'redux-thunk';
import userEvent from '@testing-library/user-event';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const cameras = makeFakeCameras();

describe('Component: ProductList', () => {
  it('should render correctly', async () => {
    const store = mockStore({
      [NameSpace.Cameras]: {
        cameras: cameras,
        areCamerasLoading: false,
      },
      [NameSpace.Application]: {
        price: {},
        filters: {},
        sorting: {
          _sort: 'price',
          _order: 'asc',
        },
        parameters: {}
      }
    });

    render(
      <MemoryRouter>
        <Provider store={store}>
          <ProductsList pageNumber={'1'}/>
        </Provider>
      </MemoryRouter>
    );

    const buttons = screen.getAllByRole('button');

    expect(buttons.length).toBe(5);

    await userEvent.click(buttons[0]);

    expect(screen.getByText(/Добавить товар в корзину/i)).toBeInTheDocument();
  });
});
