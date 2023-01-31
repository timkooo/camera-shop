import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIRoute, AppRoutes, NameSpace } from '../const';

import { api } from '../services/api';
import { redirectToRoute } from './action';
// import { Comment } from '../types/comment';
// import { CommentData } from '../types/comment-data';
import { Camera } from '../types/camera';
import { AxiosResponseHeaders } from 'axios';
import { RootState } from '../types/store';
import { Review, ReviewPost } from '../types/review';

// export const loadPlaces = createAsyncThunk(
//   `${NameSpace.Places}/loadPlaces`,
//   async () => {
//     const { data } = await api.get<Place[]>(APIRoute.Places);
//     return data;
//   }
// );

// export const loadPlaceById = createAsyncThunk(
//   `${NameSpace.Places}/loadPlaceById`,
//   async (placeId: string) => {
//     const { data } = await api.get<Place>(`${APIRoute.Places}/${placeId}`);
//     return data;
//   }
// );

// export const loadNearestPlaces = createAsyncThunk(
//   `${NameSpace.Places}/loadNearestPlaces`,
//   async (placeId: string) => {
//     const { data } = await api.get<Place[]>(
//       `${APIRoute.Places}/${placeId}/nearby`
//     );
//     return data;
//   }
// );

// export const checkAuthAction = createAsyncThunk(
//   `${NameSpace.User}/checkAuth`,
//   async () => {
//     const { data } = await api.get<UserData>(APIRoute.Login);
//     return data;
//   }
// );

// export const loginAction = createAsyncThunk(
//   `${NameSpace.User}/login`,
//   async (login: AuthData, { dispatch }) => {
//     const { data } = await api.post<UserData>(APIRoute.Login, login);
//     saveToken(data.token);
//     dispatch(redirectToRoute(AppRoutes.Main));
//     return data;
//   }
// );

// export const logoutAction = createAsyncThunk(
//   `${NameSpace.User}/logout`,
//   async () => {
//     await api.delete(APIRoute.Logout);
//     dropToken();
//   }
// );

// export const loadCommentsByPlaceId = createAsyncThunk(
//   `${NameSpace.Comments}/loadCommentsByPlaceId`,
//   async (placeId: string) => {
//     const { data } = await api.get<Comment[]>(
//       `${APIRoute.Comments}/${placeId}`
//     );
//     return data;
//   }
// );

// export const postCommentAction = createAsyncThunk(
//   `${NameSpace.Comments}/postComment`,
//   async ({ formData, placeId }: { formData: CommentData; placeId: string }) => {
//     const { data } = await api.post<Comment[]>(
//       `${APIRoute.Comments}/${placeId}`,
//       formData
//     );
//     return data;
//   }
// );

// export const loadFavorites = createAsyncThunk(
//   `${NameSpace.Favorites}/loadFavorites`,
//   async () => {
//     const { data } = await api.get<Place[]>(APIRoute.Favorite);
//     return data;
//   }
// );

// export const changeFavoriteStatus = createAsyncThunk(
//   `${NameSpace.Favorites}/changeFavoriteStatus`,
//   async (
//     { placeId, status }: { placeId: number; status: number },
//     { dispatch }
//   ) => {
//     const { data } = await api.post<Place>(
//       `${APIRoute.Favorite}/${placeId}/${status}`
//     );
//     dispatch(updatePlacesAction(data));
//     dispatch(loadFavorites());
//   }
// );

export const loadCameras = createAsyncThunk(
  `${NameSpace.Cameras}/loadCameras`,
  async () => {
    const { data } = await api.get<Camera[]>(APIRoute.Cameras);
    return data;
  }
);

export const loadCamerasWithParams = createAsyncThunk(
  `${NameSpace.Cameras}/loadCamerasWithParams`,
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { data, headers } = await api.get<Camera[]>(APIRoute.Cameras, {params : { ...state[NameSpace.Application].filters,
      ...state[NameSpace.Application].sorting,
      ...state[NameSpace.Application].parameters,
    }});
    return { data, headers };
  }
);

export const loadCameraById = createAsyncThunk(
  `${NameSpace.Cameras}/loadCameraById`,
  async (cameraId: string | undefined) => {
    const { data } = await api.get<Camera>(`${APIRoute.Cameras}/${cameraId}`);
    return data;
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
  async (cameraId: string | undefined) => {
    const { data } = await api.get<Camera[]>(`${APIRoute.Cameras}/${cameraId}/similar`);
    return data;
  }
)

export const loadReviews = createAsyncThunk(
  `${NameSpace.Reviews}/loadReviews`,
  async (cameraId: string | undefined) => {
    const { data } = await api.get<Review[]>(`${APIRoute.Cameras}/${cameraId}/reviews`);
    return data;
  }
)

export const postReview = createAsyncThunk(
  `${NameSpace.Reviews}/postReview`,
  async (review: ReviewPost, { dispatch }) => {
    await api.post(APIRoute.Reviews, review);
  }
)

