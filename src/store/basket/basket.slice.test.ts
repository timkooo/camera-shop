import { makeFakeCamera, makeFakeCameras } from "../../utils/mocks";
import {
  addToBasket,
  basketSlice,
  InitialState,
  removeFromBasket,
} from "./basket.slice";

const cameras = makeFakeCameras();
const camera = makeFakeCamera(8);
const camerasInBasket = [...cameras, camera];

describe("Reducer: basketSlice", () => {
  it("should add camera to basket by add to basket", () => {
    const state: InitialState = {
      basket: [],
    };

    expect(
      basketSlice.reducer(state, {
        type: addToBasket.type,
        payload: camera,
      })
    ).toEqual({
      basket: [camera],
    });
  });

  it("should remove camera from basket by remove from basket", () => {
    const state: InitialState = {
      basket: camerasInBasket,
    };

    expect(
      basketSlice.reducer(state, {
        type: removeFromBasket.type,
        payload: camera.id,
      })
    ).toEqual({
      basket: cameras,
    });
  });
});
