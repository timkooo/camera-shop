import { NameSpace } from '../../const';
import { RootState } from '../../types/store';

export const selectAreCamerasLoading = (state: RootState) => state[NameSpace.Cameras].areCamerasLoading;
export const selectCameras = (state: RootState) => state[NameSpace.Cameras].cameras;
export const selectCamerasAmount = (state: RootState) => state[NameSpace.Cameras].camerasAmount;
export const selectCameraById = (state: RootState) => state[NameSpace.Cameras].cameraById;
export const selectIsCameraByIdLoading = (state: RootState) => state[NameSpace.Cameras].isCameraByIdLoading;
export const selectSimilarCameras = (state: RootState) => state[NameSpace.Cameras].similarCameras;
export const selectAreSimilarCamerasLoading = (state: RootState) => state[NameSpace.Cameras].areSimilarCamerasLoading;
export const selectSearchResults = (state: RootState) => state[NameSpace.Cameras].searchResults;
