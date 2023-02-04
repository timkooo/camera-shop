import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeFakeCamera } from '../../utils/mocks';
import { BasketItem } from './basket-item';


const mockStore = configureMockStore();

describe('Component: BasketItem', () => {
  it('should render correctly', () => {
    const fakeCamera = makeFakeCamera();
    const store = mockStore();

    render(
      <Provider store={store}>
        <BasketItem item={fakeCamera}/>
      </Provider>
      );

    expect(screen.getByText(fakeCamera.name)).toBeInTheDocument();
  });
});
