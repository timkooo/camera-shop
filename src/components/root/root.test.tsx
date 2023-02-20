import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { NameSpace } from '../../const';
import { makeFakeCameras } from '../../utils/mocks';
import { Root } from './root';

const mockStore = configureMockStore();

describe('Component: Root', () => {
  it('should render correctly', () => {
    const cameras = makeFakeCameras();
    const store = mockStore({
      [NameSpace.Cameras]: {
        searchResults: cameras,
      }
    });

    render(
      <MemoryRouter>
        <Provider store={store}>
          <Root />
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Интернет-магазин фото- и видеотехники/i)).toBeInTheDocument();
    expect(screen.getByTestId(/site-menu/i)).toBeInTheDocument();
  });
});
