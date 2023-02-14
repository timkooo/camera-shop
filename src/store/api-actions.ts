import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIRoute, NameSpace } from '../const';
import { api } from '../services/api';
import { Camera } from '../types/camera';
import { RootState } from '../types/store';
import { Review, ReviewPost } from '../types/review';
import { Promo } from '../types/promo';

export const loadCamerasWithParams = createAsyncThunk(
  `${NameSpace.Cameras}/loadCamerasWithParams`,
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { data, headers } = await api.get<Camera[]>(APIRoute.Cameras, {params : { ...state[NameSpace.Application].filters,
      ...state[NameSpace.Application].sorting,
      ...state[NameSpace.Application].parameters,
      ...state[NameSpace.Application].price,
    }});
    return { data, headers };
  }
);

export const loadCameraById = createAsyncThunk(
  `${NameSpace.Cameras}/loadCameraById`,
  async (cameraId: string | undefined, { rejectWithValue }) => {
    if (typeof cameraId === 'string') {
      const { data } = await api.get<Camera>(`${APIRoute.Cameras}/${cameraId}`);
      return data;
    } else {
      return rejectWithValue('wrong id');
    }
  }
);

export const loadCamerasRange = createAsyncThunk(
  `${NameSpace.Cameras}/loadCamerasRange`,
  async () => {
    const { data, headers } = await api.get<Camera[]>(`${APIRoute.Cameras}/?_start=0&_end=10`);
    return { data, headers };
  }
);

export const loadSimilarCameras = createAsyncThunk(
  `${NameSpace.Cameras}/loadSimilarCameras`,
  async (cameraId: string | undefined, { rejectWithValue }) => {
    if (typeof cameraId === 'string') {
      const { data } = await api.get<Camera[]>(`${APIRoute.Cameras}/${cameraId}/similar`);
      return data;
    } else {
      return rejectWithValue('wrong id');
    }
  }
);

export const loadReviews = createAsyncThunk(
  `${NameSpace.Reviews}/loadReviews`,
  async (cameraId: string | undefined, { rejectWithValue }) => {
    if (typeof cameraId === 'string') {
      const { data } = await api.get<Review[]>(`${APIRoute.Cameras}/${cameraId}/reviews`);
      return data;
    } else {
      return rejectWithValue('wrong id');
    }
  }
);

export const postReview = createAsyncThunk(
  `${NameSpace.Reviews}/postReview`,
  async (review: ReviewPost) => {
    await api.post(APIRoute.Reviews, review);
  }
);

export const loadPromo = createAsyncThunk(
  `${NameSpace.Application}/loadPromo`,
  async () => {
    const { data } = await api.get<Promo>(APIRoute.Promo);
    return data;
  }
);
