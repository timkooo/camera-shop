import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from "react-router-dom";
import { Root } from './root';

const mockStore = configureMockStore();

describe('Component: Root', () => {
  it('should render correctly', () => {
    const store = mockStore();

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
