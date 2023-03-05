import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { makeFakeBasketItem, makeFakeCamera } from '../../utils/mocks';
import { RemoveModal } from './remove-modal';


const mockStore = configureMockStore();

describe('Component: RemoveModal', () => {
  it('should render correctly', () => {
    const fakeCamera = makeFakeCamera();
    const fakeBasketItem = makeFakeBasketItem(fakeCamera, 1);
    const store = mockStore();

    render(
      <MemoryRouter>
        <Provider store={store}>
          <RemoveModal item={fakeBasketItem} modalVisible onModalToggle={jest.fn()} onItemRemove={jest.fn()}/>
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Удалить этот товар?/i)).toBeInTheDocument();
    expect(screen.getByText(/Продолжить покупки/i)).toBeInTheDocument();
  });
});
