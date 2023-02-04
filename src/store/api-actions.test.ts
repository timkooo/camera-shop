import {Action} from 'redux';
import thunk, {ThunkDispatch} from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { api } from '../services/api';
import { APIRoute, NameSpace } from '../const';
import { RootState } from '../types/store';
import { datatype } from 'faker';
import { makeFakeCamera, makeFakeCameras, makeFakeReview, makeFakeReviewPost, makeFakeReviews } from '../utils/mocks';
import { loadCameraById, loadCameras, loadCamerasWithParams, loadReviews, loadSimilarCameras, postReview } from './api-actions';
import { Middleware } from '@reduxjs/toolkit';
import { rootReducer } from './root-reducer';

describe('Async actions', () => {
  const mockAPI = new MockAdapter(api);
 
  const fakeThunkMiddleware =
  ({ dispatch, getState } : {dispatch: any, getState: any}) =>
  (next : any) =>
  (action : any) => {
    if (typeof action === 'function') {
      return action(dispatch, getState)
    }

    return next(action)
  }

  const middlewares = [thunk.withExtraArgument(api)].concat(fakeThunkMiddleware);

  const mockStore = configureMockStore<
      RootState,
      Action,
      ThunkDispatch<RootState, typeof api, Action>
    >(middlewares);

  const create = () => {
    const store = {
      getState: jest.fn(() => ({
        [NameSpace.Application] : {
          price: {
            price_gte: 1000,
            price_lte: 2000000,
          }
        }
      })),
      dispatch: jest.fn()
    }
    const next = jest.fn()
  
    const invoke = (action: any) => fakeThunkMiddleware(store)(next)(action)
  
    return { store, next, invoke }
  }

  it('should dispatch loadCameras when GET /cameras', async () => {
    const mockCameras = makeFakeCameras();
    mockAPI
      .onGet(APIRoute.Cameras)
      .reply(200, mockCameras);

    const store = mockStore();

    await store.dispatch(loadCameras());

    const actions = store.getActions().map(({type}) => type);

    expect(actions).toEqual([
      loadCameras.pending.type,
      loadCameras.fulfilled.type,
    ]);
  });

  it('should dispatch loadCamerasWithParams when GET /cameras', async () => {
    const store = mockStore();
    const { invoke } = create()
    const mockCameras = makeFakeCameras();
    mockAPI
      .onGet(APIRoute.Cameras)
      .reply(200, mockCameras);

    invoke((getState: any) => {
      getState();
      store.dispatch(loadCamerasWithParams());
    })

    const actions = store.getActions().map(({type}) => type);

    expect(actions).toEqual([
      loadCamerasWithParams.pending.type,
    ]);
  });

  it('should dispatch loadCameraById when GET /cameras/:id', async () => {
    const mockCamera = makeFakeCamera();
    mockAPI
      .onGet(`${APIRoute.Cameras}/${mockCamera.id}`)
      .reply(200, mockCamera);

    const store = mockStore();

    await store.dispatch(loadCameraById(mockCamera.id.toString()));

    const actions = store.getActions().map(({type}) => type);

    expect(actions).toEqual([
      loadCameraById.pending.type,
      loadCameraById.fulfilled.type,
    ]);
  });

  it('should dispatch loadSimilarCameras when GET /cameras/:id/similar', async () => {
    const mockCameras = makeFakeCameras();
    mockAPI
      .onGet(`${APIRoute.Cameras}/${mockCameras[0].id}/similar`)
      .reply(200, mockCameras);

    const store = mockStore();

    await store.dispatch(loadSimilarCameras(mockCameras[0].id.toString()));

    const actions = store.getActions().map(({type}) => type);

    expect(actions).toEqual([
      loadSimilarCameras.pending.type,
      loadSimilarCameras.fulfilled.type,
    ]);
  });

  it('should dispatch loadReviews when GET /cameras/:id/reviews', async () => {
    const mockReviews = makeFakeReviews();
    mockAPI
      .onGet(`${APIRoute.Cameras}/${mockReviews[0].cameraId}/reviews`)
      .reply(200, mockReviews);

    const store = mockStore();

    await store.dispatch(loadReviews(mockReviews[0].cameraId.toString()));

    const actions = store.getActions().map(({type}) => type);

    expect(actions).toEqual([
      loadReviews.pending.type,
      loadReviews.fulfilled.type,
    ]);
  });

  it('should dispatch postReview when POSR /reviews', async () => {
    const mockReview = makeFakeReview(4);
    const mockReviewPost = makeFakeReviewPost(4);

    mockAPI
      .onPost(APIRoute.Reviews, mockReviewPost)
      .reply(201, mockReview);

    const store = mockStore();

    await store.dispatch(postReview(mockReviewPost));

    const actions = store.getActions().map(({type}) => type);

    expect(actions).toEqual([
      postReview.pending.type,
      postReview.fulfilled.type,
    ]);
  });
//   it('should dispatch loadPlaceById when GET /hotels/{hotelId}', async () => {
//     const mockPlace = makeFakePlace();
//     const mockPlaceId = mockPlace.id.toString();
//     mockAPI
//       .onGet(`${APIRoute.Places}/${mockPlaceId}`)
//       .reply(200, mockPlace);

//     const store = mockStore();

//     await store.dispatch(loadPlaceById(mockPlaceId));

//     const actions = store.getActions().map(({type}) => type);

//     expect(actions).toEqual([
//       loadPlaceById.pending.type,
//       loadPlaceById.fulfilled.type,
//     ]);
//   });

//   it('should dispatch loadNearestPlaces when GET /hotels/{hotelId}/nearby', async () => {
//     const mockPlaces = [makeFakePlace(), makeFakePlace(), makeFakePlace(), makeFakePlace()];
//     const mockPlaceId = mockPlaces[0].id.toString();
//     const mockFavoritePlaces = [...mockPlaces].slice(1,);
//     mockAPI
//       .onGet(`${APIRoute.Places}/${mockPlaceId}/nearby`)
//       .reply(200, mockFavoritePlaces);

//     const store = mockStore();

//     await store.dispatch(loadNearestPlaces(mockPlaceId));

//     const actions = store.getActions().map(({type}) => type);

//     expect(actions).toEqual([
//       loadNearestPlaces.pending.type,
//       loadNearestPlaces.fulfilled.type,
//     ]);
//   });

//   it('should dispatch Logout when DELETE /logout', async () => {
//     mockAPI
//       .onDelete(APIRoute.Logout)
//       .reply(204);

//     const store = mockStore();
//     Storage.prototype.removeItem = jest.fn();

//     await store.dispatch(logoutAction());

//     const actions = store.getActions().map(({type}) => type);

//     expect(actions).toEqual([
//       logoutAction.pending.type,
//       logoutAction.fulfilled.type
//     ]);

//     expect(Storage.prototype.removeItem).toBeCalledTimes(1);
//     expect(Storage.prototype.removeItem).toBeCalledWith('six-cities-token');
//   });

//   it('should dispatch loadCommentsByPlaceId when GET /comments/{hotelId}', async () => {
//     const mockComments = makeFakeComments();
//     const placeId = datatype.number().toString();
//     mockAPI
//       .onGet(`${APIRoute.Comments}/${placeId}`)
//       .reply(200, mockComments);

//     const store = mockStore();

//     await store.dispatch(loadCommentsByPlaceId(placeId));

//     const actions = store.getActions().map(({type}) => type);

//     expect(actions).toEqual([
//       loadCommentsByPlaceId.pending.type,
//       loadCommentsByPlaceId.fulfilled.type,
//     ]);
//   });

//   it('should dispatch postCommentAction when POST /comments/{hotelId}', async () => {
//     const mockComment = makeFakeComment();
//     const placeId = datatype.number().toString();
//     mockAPI
//       .onPost(`${APIRoute.Comments}/${placeId}`)
//       .reply(200, mockComment);

//     const store = mockStore();

//     await store.dispatch(postCommentAction({formData: {comment: datatype.string(), rating: '4'}, placeId: placeId}));

//     const actions = store.getActions().map(({type}) => type);

//     expect(actions).toEqual([
//       postCommentAction.pending.type,
//       postCommentAction.fulfilled.type,
//     ]);
//   });

//   it('should dispatch loadFavorites when GET /favorite', async () => {
//     const mockPlaces = makeFakePlaces();
//     mockAPI
//       .onGet(APIRoute.Favorite)
//       .reply(200, mockPlaces);

//     const store = mockStore();

//     await store.dispatch(loadFavorites());

//     const actions = store.getActions().map(({type}) => type);

//     expect(actions).toEqual([
//       loadFavorites.pending.type,
//       loadFavorites.fulfilled.type,
//     ]);
//   });

//   it('should dispatch postCommentAction when POST /favorite/{hotelId}/{status}', async () => {
//     const placeId = datatype.number();

//     mockAPI
//       .onPost(`${APIRoute.Favorite}/${placeId}/1`)
//       .reply(200);

//     const store = mockStore();

//     await store.dispatch(changeFavoriteStatus({placeId: placeId, status: 1}));

//     const actions = store.getActions().map(({type}) => type);

//     expect(actions).toEqual([
//       changeFavoriteStatus.pending.type,
//       updatePlacesAction.type,
//       loadFavorites.pending.type,
//       changeFavoriteStatus.fulfilled.type,
//     ]);
//   });

});
