import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ErrorPage } from './error-page';


const mockStore = configureMockStore();

describe('Component: ErrorPage', () => {
  it('should render correctly', () => {
    const store = mockStore();

    render(
      <MemoryRouter initialEntries={[{state : {error: 'dadadaddadadada'}}]}>
        <Provider store={store}>
          <ErrorPage />
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/An error occurred while submitting the order/i)).toBeInTheDocument();
    expect(screen.getByText(/dadadaddadadada/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to main page/i)).toBeInTheDocument();
  });
});
