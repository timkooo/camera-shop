import { createSlice } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { Camera } from '../../types/camera';
import {
  loadCameraById,
  loadCameras, loadCamerasWithParams, loadSimilarCameras,
} from '../api-actions';

export type InitialState = {
  cameras: Camera[];
  doesCamerasLoading: boolean;
  camerasAmount: number;
  cameraById: Camera | null;
  doesCameraByIdLoading: boolean;
  similarCameras: Camera[];
  doesSimilarCamerasLoading: boolean;
};

const initialState: InitialState = {
  cameras: [],
  doesCamerasLoading: false,
  camerasAmount: 0,
  cameraById: null,
  doesCameraByIdLoading: false,
  similarCameras: [],
  doesSimilarCamerasLoading: false,
};

export const camerasSlice = createSlice({
  name: NameSpace.Cameras,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadCameras.fulfilled, (state, action) => {
        state.cameras = action.payload;
        state.doesCamerasLoading = false;
      })
      .addCase(loadCameras.pending, (state) => {
        state.doesCamerasLoading = true;
      })
      .addCase(loadCameras.rejected, (state) => {
        state.cameras = [];
        state.doesCamerasLoading = false;
      })
      .addCase(loadCamerasWithParams.fulfilled, (state, action) => {
        state.cameras = action.payload.data;
        state.camerasAmount = Number(action.payload.headers['x-total-count']);
        state.doesCamerasLoading = false;
      })
      .addCase(loadCamerasWithParams.pending, (state) => {
        state.doesCamerasLoading = true;
      })
      .addCase(loadCamerasWithParams.rejected, (state) => {
        state.cameras = [];
        state.camerasAmount = 0;
        state.doesCamerasLoading = false;
      })
      .addCase(loadCameraById.fulfilled, (state, action) => {
        state.cameraById = action.payload;
        state.doesCameraByIdLoading = false;
      })
      .addCase(loadCameraById.pending, (state) => {
        state.doesCameraByIdLoading = true;
      })
      .addCase(loadCameraById.rejected, (state) => {
        state.cameraById = null;
        state.doesCameraByIdLoading = false;
      })
      .addCase(loadSimilarCameras.fulfilled, (state, action) => {
        state.similarCameras = action.payload;
        state.doesSimilarCamerasLoading = false;
      })
      .addCase(loadSimilarCameras.pending, (state) => {
        state.doesSimilarCamerasLoading = true;
      })
      .addCase(loadSimilarCameras.rejected, (state) => {
        state.similarCameras = [];
        state.doesSimilarCamerasLoading = false;
      })
  },
});
