import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { PageNotFound } from './page-not-found';


const mockStore = configureMockStore();

describe('Component: PageNotFound', () => {
  it('should render correctly', () => {
    const store = mockStore();

    render(
      <MemoryRouter>
        <Provider store={store}>
          <PageNotFound />
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/404. Page not found/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to main page/i)).toBeInTheDocument();
  });
});
