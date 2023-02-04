import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeFakeCamera } from '../../utils/mocks';
import { ProductCard } from './product-card';
import { MemoryRouter } from "react-router-dom";

const mockStore = configureMockStore();

describe('Component: ProductCard', () => {
  it('should render correctly', () => {
    const fakeCamera = makeFakeCamera();
    const store = mockStore();

    render(
      <MemoryRouter>
        <Provider store={store}>
          <ProductCard product={fakeCamera} onSelectedProductChange={() => {}}/>
        </Provider>
      </MemoryRouter>
      );

    expect(screen.getByText(fakeCamera.name)).toBeInTheDocument();
  });
});
