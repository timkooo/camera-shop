import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routesConfig } from '../../routes-config';

export const router = createBrowserRouter(routesConfig);

export const App = () => <RouterProvider router={ router }/>;
