import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { Pagination } from './pagination';
import { NameSpace } from '../../const';
import { MemoryRouter } from 'react-router-dom';

const mockStore = configureMockStore();

describe('Component: Pagination', () => {
  it('should render correctly', () => {
    const store = mockStore({
      [NameSpace.Cameras]: {
        camerasAmount: 40,
      }
    });

    render(
      <MemoryRouter>
        <Provider store={store}>
          <Pagination pageNumber={1} />
        </Provider>
      </MemoryRouter>
    );

    const buttons = screen.getAllByRole('link');

    expect(buttons.length).toBe(7);
  });
});
