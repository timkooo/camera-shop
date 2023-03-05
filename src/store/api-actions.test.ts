import {Action} from 'redux';
import thunk, {ThunkDispatch} from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { api } from '../services/api';
import { APIRoute, NameSpace } from '../const';
import { RootState } from '../types/store';
import { makeFakeCamera, makeFakeCameras, makeFakeReview, makeFakeReviewPost, makeFakeReviews } from '../utils/mocks';
import { loadCameraById, loadCamerasWithParams, loadDiscount, loadMinMaxPrice, loadReviews, loadSearchResults, loadSimilarCameras, postOrder, postReview } from './api-actions';

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
          'price_gte': 6000,
          'price_lte': 8000,
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

    const actions = store.getActions().map(({type}) => type as string);

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

    const actions = store.getActions().map(({type}) => type as string);

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

    const actions = store.getActions().map(({type}) => type as string);

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

    const actions = store.getActions().map(({type}) => type as string);

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

    const actions = store.getActions().map(({type}) => type as string);

    expect(actions).toEqual([
      postReview.pending.type,
      postReview.fulfilled.type,
    ]);
  });

  it('should dispatch loadSearchResults when GET /cameras?params', async () => {
    const mockCameras = makeFakeCameras();
    mockAPI
      .onGet(`${APIRoute.Cameras}?name_like=${mockCameras[1].name}`)
      .reply(200, mockCameras)
      .onGet(`${APIRoute.Cameras}?category_like=${mockCameras[1].name}`)
      .reply(200, mockCameras)
      .onGet(`${APIRoute.Cameras}?type_like=${mockCameras[1].name}`)
      .reply(200, mockCameras);

    const store = mockStore();

    await store.dispatch(loadSearchResults(mockCameras[1].name));

    const actions = store.getActions().map(({type}) => type as string);

    expect(actions).toEqual([
      loadSearchResults.pending.type,
      loadSearchResults.rejected.type,
    ]);
  });

  it('should dispatch loadMinMaxPrice when GET /cameras?params', async () => {
    const mockCameras = makeFakeCameras();
    mockCameras.sort((camera1, camera2) => camera2.price - camera1.price);
    mockAPI
      .onGet(`${APIRoute.Cameras}?_sort=price&_order=asc&_start=0&_end=1`)
      .reply(200, mockCameras)
      .onGet(`${APIRoute.Cameras}?_sort=price&_order=desc&_start=0&_end=1`)
      .reply(200, mockCameras);

    const store = mockStore();

    await store.dispatch(loadMinMaxPrice());

    const actions = store.getActions().map(({type}) => type as string);

    expect(actions).toEqual([
      loadMinMaxPrice.pending.type,
      loadMinMaxPrice.fulfilled.type,
    ]);
  });

  it('should dispatch loadDiscount when POST /coupons with wrong coupon', async () => {
    const fakeCoupon = { coupon: 'fasgasgsadgsa52' };
    mockAPI
      .onPost(APIRoute.Coupons, fakeCoupon)
      .reply(400);

    const store = mockStore();

    await store.dispatch(loadDiscount(fakeCoupon));

    const actions = store.getActions().map(({type}) => type as string);

    expect(actions).toEqual([
      loadDiscount.pending.type,
      loadDiscount.rejected.type,
    ]);
  });

  it('should dispatch loadDiscount when POST /coupons with right coupon', async () => {
    const fakeCoupon = { coupon: 'camera-333' };
    mockAPI
      .onPost(APIRoute.Coupons, fakeCoupon)
      .reply(200, 15);

    const store = mockStore();

    await store.dispatch(loadDiscount(fakeCoupon));

    const actions = store.getActions().map(({type}) => type as string);

    expect(actions).toEqual([
      loadDiscount.pending.type,
      loadDiscount.fulfilled.type,
    ]);
  });

  it('should dispatch postOrder when POST /coupons with wrong order', async () => {
    const fakeOrder = {
      camerasIds: [],
      coupon: 'camera-333'
    };
    mockAPI
      .onPost(APIRoute.Orders, fakeOrder)
      .reply(400);

    const store = mockStore();

    await store.dispatch(postOrder(fakeOrder));

    const actions = store.getActions().map(({type}) => type as string);

    expect(actions).toEqual([
      postOrder.pending.type,
      postOrder.rejected.type,
    ]);
  });

  it('should dispatch postOrder when POST /coupons with right order', async () => {
    const fakeOrder = {
      camerasIds: [],
      coupon: 'camera-333'
    };
    mockAPI
      .onPost(APIRoute.Orders, fakeOrder)
      .reply(200);

    const store = mockStore();

    await store.dispatch(postOrder(fakeOrder));

    const actions = store.getActions().map(({type}) => type as string);

    expect(actions).toEqual([
      postOrder.pending.type,
      postOrder.fulfilled.type,
    ]);
  });
});
