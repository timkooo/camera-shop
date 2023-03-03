import { Link } from 'react-router-dom';
import { AppRoutes } from '../../const';
import { useAppSelector } from '../../hooks/rtk-hooks';
import { selectBasketQuantity } from '../../store/basket/basket.selectors';


export const BasketLink = () => {
  const basketQuantity = useAppSelector(selectBasketQuantity);

  return (
    <Link className="header__basket-link" to={AppRoutes.Basket}>
      <svg width="16" height="16" aria-hidden="true">
        <use xlinkHref="#icon-basket"></use>
      </svg>{basketQuantity ? <span className="header__basket-count">{basketQuantity}</span> : ''}
    </Link>
  );
};
