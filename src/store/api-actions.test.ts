/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable camelcase */
import {Action} from 'redux';
import thunk, {ThunkDispatch} from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { api } from '../services/api';
import { APIRoute, NameSpace } from '../const';
import { RootState } from '../types/store';
import { makeFakeCamera, makeFakeCameras, makeFakeReview, makeFakeReviewPost, makeFakeReviews } from '../utils/mocks';
import { loadCameraById, loadCamerasWithParams, loadReviews, loadSimilarCameras, postReview } from './api-actions';

describe('Async actions', () => {
  const mockAPI = new MockAdapter(api);

  const middlewares = [thunk.withExtraArgument(api)];

  const mockStore = configureMockStore<
      RootState,
      Action,
      ThunkDispatch<RootState, typeof api, Action>
    >(middlewares);

  it('should dispatch loadCamerasWithParams when GET /cameras', async () => {
    const mockCameras = makeFakeCameras();
    mockAPI
      .onGet(APIRoute.Cameras)
      .reply(200, mockCameras);

    const store = mockStore( {
      [NameSpace.Application]: {
        price: {
          price_gte: 6000,
          price_lte: 8000,
        },
        filters: {},
        sorting: {
          _sort: 'price',
          _order: 'asc',
        },
        parameters: {},
      }
    });

    await store.dispatch(loadCamerasWithParams());

    const actions = store.getActions().map(({type}) => type);

    expect(actions).toEqual([
      loadCamerasWithParams.pending.type,
      loadCamerasWithParams.fulfilled.type,
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

  it('should dispatch postReview when POST /reviews', async () => {
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

});
