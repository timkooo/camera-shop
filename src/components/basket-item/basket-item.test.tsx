import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeFakeBasketItem, makeFakeCamera } from '../../utils/mocks';
import { BasketItem } from './basket-item';


const mockStore = configureMockStore();

describe('Component: BasketItem', () => {
  it('should render correctly', () => {
    const fakeCamera = makeFakeCamera();
    const fakeBasketItem = makeFakeBasketItem(fakeCamera, 1);
    const store = mockStore();

    render(
      <Provider store={store}>
        <BasketItem item={fakeBasketItem} onRemoveButtonClick={() => jest.fn()}/>
      </Provider>
    );

    expect(screen.getByText(/Артикул:/i)).toBeInTheDocument();
    expect(screen.getByText(/Общая цена:/i)).toBeInTheDocument();
  });
});
