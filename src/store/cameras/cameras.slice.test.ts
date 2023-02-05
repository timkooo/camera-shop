import { makeFakeCamera, makeFakeCameras } from '../../utils/mocks';
import { loadCameraById, loadCameras, loadCamerasWithParams, loadSimilarCameras } from '../api-actions';
import { camerasSlice, InitialState } from './cameras.slice';

const cameras = makeFakeCameras();
const camera = makeFakeCamera();
const payload = {
  data: cameras,
  headers: {
    "x-total-count" : "40",
  }
}

describe('Reducer: cameraSlice', () => {

  let state : InitialState;

  beforeEach(() => {
    state = {
      cameras: [],
      areCamerasLoading: false,
      camerasAmount: 0,
      cameraById: null,
      isCameraByIdLoading: false,
      similarCameras: [],
      areSimilarCamerasLoading: false,
    };
  });

  it('should update cameras by load cameras', () => {
    expect(
      camerasSlice.reducer(state, {
        type: loadCameras.fulfilled.type,
        payload: cameras,
      })
    ).toEqual({
      cameras: cameras,
      areCamerasLoading: false,
      camerasAmount: 0,
      cameraById: null,
      isCameraByIdLoading: false,
      similarCameras: [],
      areSimilarCamerasLoading: false,
    });
  });

  it('should update cameras and camerasAmount by load cameras with params', () => {
    expect(
      camerasSlice.reducer(state, {
        type: loadCamerasWithParams.fulfilled.type,
        payload: payload,
      })
    ).toEqual({
      cameras: cameras,
      areCamerasLoading: false,
      camerasAmount: 40,
      cameraById: null,
      isCameraByIdLoading: false,
      similarCameras: [],
      areSimilarCamerasLoading: false,
    });
  });

  it('should update cameraById by load camera by id', () => {
    expect(
      camerasSlice.reducer(state, {
        type: loadCameraById.fulfilled.type,
        payload: camera,
      })
    ).toEqual({
      cameras: [],
      areCamerasLoading: false,
      camerasAmount: 0,
      cameraById: camera,
      isCameraByIdLoading: false,
      similarCameras: [],
      areSimilarCamerasLoading: false,
    });
  });

  it('should update cameras by load similar cameras', () => {
    expect(
      camerasSlice.reducer(state, {
        type: loadSimilarCameras.fulfilled.type,
        payload: cameras,
      })
    ).toEqual({
      cameras: [],
      areCamerasLoading: false,
      camerasAmount: 0,
      cameraById: null,
      isCameraByIdLoading: false,
      similarCameras: cameras,
      areSimilarCamerasLoading: false,
    });
  });

});
