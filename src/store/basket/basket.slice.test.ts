import { makeFakeBasketItem, makeFakeCamera } from '../../utils/mocks';
import {
  addToBasket,
  basketSlice,
  decreaseQuantity,
  increaseQuantity,
  InitialState,
  removeFromBasket,
} from './basket.slice';

const camera = makeFakeCamera(8);
const basketItem = makeFakeBasketItem(camera, 1);
const twoSameItems = makeFakeBasketItem(camera, 2);
const secondCamera = makeFakeCamera(3);
const secondBasketItem = makeFakeBasketItem(secondCamera, 1);

describe('Reducer: basketSlice', () => {
  it('should add camera to basket by add to basket', () => {
    const state: InitialState = {
      basketItems: [],
      basketPrice: 0,
      basketQuantity: 0,
    };

    expect(
      basketSlice.reducer(state, {
        type: addToBasket.type,
        payload: camera,
      })
    ).toEqual({
      basketItems: [basketItem],
      basketPrice: camera.price,
      basketQuantity: 1,
    });
  });

  it('should increase item quantity by add second same camera to basket', () => {
    const state: InitialState = {
      basketItems: [basketItem],
      basketPrice: camera.price,
      basketQuantity: 1,
    };

    expect(
      basketSlice.reducer(state, {
        type: increaseQuantity.type,
        payload: camera,
      })
    ).toEqual({
      basketItems: [twoSameItems],
      basketPrice: camera.price * 2,
      basketQuantity: 2,
    });
  });

  it('should decrease item quantity by remove item from basket', () => {
    const state: InitialState = {
      basketItems: [twoSameItems],
      basketPrice: camera.price * 2,
      basketQuantity: 2,
    };

    expect(
      basketSlice.reducer(state, {
        type: decreaseQuantity.type,
        payload: camera,
      })
    ).toEqual({
      basketItems: [basketItem],
      basketPrice: camera.price,
      basketQuantity: 1,
    });
  });

  it('should add other camera to basket by add to basket', () => {
    const state: InitialState = {
      basketItems: [twoSameItems],
      basketPrice: camera.price * 2,
      basketQuantity: 2,
    };

    expect(
      basketSlice.reducer(state, {
        type: addToBasket.type,
        payload: secondCamera,
      })
    ).toEqual({
      basketItems: [twoSameItems, secondBasketItem],
      basketPrice: camera.price * 2 + secondCamera.price,
      basketQuantity: 3,
    });
  });

  it('should remove item from basket by remove from basket', () => {
    const state: InitialState = {
      basketItems: [twoSameItems, secondBasketItem],
      basketPrice: camera.price * 2 + secondCamera.price,
      basketQuantity: 3,
    };

    expect(
      basketSlice.reducer(state, {
        type: removeFromBasket.type,
        payload: camera.id,
      })
    ).toEqual({
      basketItems: [secondBasketItem],
      basketPrice: secondCamera.price,
      basketQuantity: 1,
    });
  });
});
