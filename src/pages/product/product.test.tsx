/* eslint-disable jest/no-identical-title */
import { configureMockStore } from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { NameSpace } from '../../const';
import { makeFakeCamera, makeFakeCameras, makeFakeReviews } from '../../utils/mocks';
import thunk from 'redux-thunk';
import { Product } from './product';

const mockStore = configureMockStore([thunk]);

describe('Component: Product', () => {
  it('should render correctly', () => {
    const camera = makeFakeCamera(3);
    const reviews = makeFakeReviews();

    const store = mockStore({
      [NameSpace.Cameras]: {
        cameraById: camera,
        isCameraByIdLoading: false,
        similarCameras: makeFakeCameras(),
        areSimilarCamerasLoading: false
      },
      [NameSpace.Reviews]: {
        reviews: reviews,
      }
    });

    render(
      <MemoryRouter>
        <Provider store={store}>
          <Product />
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getAllByText(camera.name)[0]).toBeInTheDocument();
    expect(screen.getByText(reviews[0].userName)).toBeInTheDocument();
    expect(screen.getByText(/Похожие товары/i)).toBeInTheDocument();
  });

  it('should render correctly', () => {
    const store = mockStore({
      [NameSpace.Cameras]: {
        cameraById: null,
        isCameraByIdLoading: false,
        similarCameras: makeFakeCameras(),
        areSimilarCamerasLoading: false
      },
      [NameSpace.Reviews]: {
        reviews: [],
      }
    });

    render(
      <MemoryRouter>
        <Provider store={store}>
          <Product />
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Sorry no such camera found/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to catalog/i)).toBeInTheDocument();
  });
});
