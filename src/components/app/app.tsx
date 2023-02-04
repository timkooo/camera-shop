import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AppRoutes } from '../../const';
import { Basket } from '../../pages/basket/basket';
import { Catalog } from '../../pages/catalog/catalog';
import { PageNotFound } from '../../pages/page-not-found/page-not-found';
import { Product } from '../../pages/product/product';
import { routesConfig } from '../../routes-config';
import { Root } from '../root/root';

const router = createBrowserRouter(routesConfig)

export const App = () => {
  return <RouterProvider router={ router }/>
};
