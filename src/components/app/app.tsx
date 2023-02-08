import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routesConfig } from '../../routes-config';

const router = createBrowserRouter(routesConfig);

export const App = () => <RouterProvider router={ router }/>;
