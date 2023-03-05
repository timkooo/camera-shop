import { Navigate } from 'react-router-dom';
import { GlobalHistory } from './components/global-history/global-history';
import { Root } from './components/root/root';
import { AppRoutes } from './const';
import { Basket } from './pages/basket/basket';
import { Catalog } from './pages/catalog/catalog';
import { ErrorPage } from './pages/error-page/error-page';
import { PageNotFound } from './pages/page-not-found/page-not-found';
import { Product } from './pages/product/product';

export const routesConfig = [
  {
    path: AppRoutes.Main,
    element: <Root />,
    children: [
      {
        element: <GlobalHistory />,
      },
      {
        path: AppRoutes.Main,
        element: <Navigate to={AppRoutes.Catalog} />,
      },
      {
        index: true,
        path: AppRoutes.Catalog,
        element: <Catalog />,
      },
      {
        path: `${AppRoutes.Catalog}/page/:pageNumber`,
        element: <Catalog />,
      },
      {
        path: `${AppRoutes.Product}/:id`,
        element: <Product />,
      },
      {
        path: AppRoutes.Basket,
        element: <Basket />,
      },
      {
        path: '*',
        element: <PageNotFound />,
      },
      {
        path: AppRoutes.ErrorPage,
        element: <ErrorPage />,
      },
    ],
  },
];
