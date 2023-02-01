import { Link } from 'react-router-dom';
import { AppRoutes } from '../../const';

export const PageNotFound = () => (
  <main>
    <h1>404. Page not found</h1>
    <Link to={AppRoutes.Main}>Вернуться на главную</Link>
  </main>
);
