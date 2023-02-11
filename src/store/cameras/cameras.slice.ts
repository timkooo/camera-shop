import { createSlice } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { Camera } from '../../types/camera';
import {
  loadCameraById,
  loadCamerasWithParams, loadSimilarCameras,
} from '../api-actions';

export type InitialState = {
  cameras: Camera[];
  areCamerasLoading: boolean;
  camerasAmount: number;
  cameraById: Camera | null;
  isCameraByIdLoading: boolean;
  similarCameras: Camera[];
  areSimilarCamerasLoading: boolean;
};

const initialState: InitialState = {
  cameras: [],
  areCamerasLoading: false,
  camerasAmount: 0,
  cameraById: null,
  isCameraByIdLoading: false,
  similarCameras: [],
  areSimilarCamerasLoading: false,
};

export const camerasSlice = createSlice({
  name: NameSpace.Cameras,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadCamerasWithParams.fulfilled, (state, action) => {
        state.cameras = action.payload.data;
        state.camerasAmount = Number(action.payload.headers['x-total-count']);
        state.areCamerasLoading = false;
      })
      .addCase(loadCamerasWithParams.pending, (state) => {
        state.areCamerasLoading = true;
      })
      .addCase(loadCamerasWithParams.rejected, (state) => {
        state.cameras = [];
        state.camerasAmount = 0;
        state.areCamerasLoading = false;
      })
      .addCase(loadCameraById.fulfilled, (state, action) => {
        state.cameraById = action.payload;
        state.isCameraByIdLoading = false;
      })
      .addCase(loadCameraById.pending, (state) => {
        state.isCameraByIdLoading = true;
      })
      .addCase(loadCameraById.rejected, (state) => {
        state.cameraById = null;
        state.isCameraByIdLoading = false;
      })
      .addCase(loadSimilarCameras.fulfilled, (state, action) => {
        state.similarCameras = action.payload;
        state.areSimilarCamerasLoading = false;
      })
      .addCase(loadSimilarCameras.pending, (state) => {
        state.areSimilarCamerasLoading = true;
      })
      .addCase(loadSimilarCameras.rejected, (state) => {
        state.similarCameras = [];
        state.areSimilarCamerasLoading = false;
      });
  },
});
