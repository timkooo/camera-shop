import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AppRoutes } from '../../const';
import { Basket } from '../../pages/basket/basket';
import { Catalog } from '../../pages/catalog/catalog';
import { Product } from '../../pages/product/product';
import { Root } from '../root/root';

const router = createBrowserRouter([
  {
    path: AppRoutes.Main,
    element: <Root />,
    children: [
      {
        path: AppRoutes.Main,
        element: <Navigate to={ AppRoutes.Catalog } />,
      },
      {
        index: true,
        path: AppRoutes.Catalog,
        element: <Catalog />,
      },
      {
        path: AppRoutes.Catalog + '/page/:pageNumber',
        element: <Catalog />
      },
      {
        path: AppRoutes.Product + '/:id',
        element: <Product />
      },
      {
        path: AppRoutes.Basket,
        element: <Basket/>
      }
    ]
  }
])

export const App = () => {
  return <RouterProvider router={ router }/>
};
