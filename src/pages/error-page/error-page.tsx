import { Link, useLocation } from 'react-router-dom';
import { AppRoutes } from '../../const';

export const ErrorPage = () => {
  const location = useLocation();
  const state = location.state as { error : string};

  return (
    <main>
      <h1>An error occurred while submitting the order</h1>
      {state.error ? <h1>{state.error}</h1> : ''}
      <Link to={AppRoutes.Main}>Back to main page</Link>
    </main>
  );
};
