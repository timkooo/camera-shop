import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { ProductModal } from './product-modal';
import { makeFakeCamera } from '../../utils/mocks';

const mockStore = configureMockStore();
const camera = makeFakeCamera();

describe('Component: ProductModal', () => {
  it('should render correctly', () => {
    const store = mockStore();

    render(
      <Provider store={store}>
        <ProductModal product={camera} modalVisible onModalToggle={jest.fn()} onProductSelect={jest.fn()} />
      </Provider>
    );

    expect(screen.getByText(/Добавить товар в корзину/i)).toBeInTheDocument();
    expect(screen.getByText(camera.name)).toBeInTheDocument();
  });
});
