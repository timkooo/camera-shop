import classNames from 'classnames';
import { Dispatch, FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../const';
import { useAppSelector } from '../../hooks/rtk-hooks';
import { selectBasketItems } from '../../store/basket/basket.selectors';
import { Camera } from '../../types/camera';
import './product-card.css';

type ProductCardProps = {
  product: Camera;
  onSelectedProductChange: Dispatch<Camera | null>;
  isActive?: boolean;
}

export const ProductCard: FC<ProductCardProps> = ({product, onSelectedProductChange, isActive = false}) => {
  const basketItems = useAppSelector(selectBasketItems);
  const navigate = useNavigate();

  const isItemInBasket = () => {
    if (basketItems.find((item) => item.id === product.id)) {
      return true;
    }
    return false;
  };

  return (
    <div className={classNames('product-card', {'is-active' : isActive})}>
      <div className="product-card__img">
        <picture>
          <source type="image/webp" srcSet={`/${product.previewImgWebp}, /${product.previewImgWebp2x}`} /><img src={product.previewImg} srcSet={`${product.previewImg2x} 2x`} width="280" height="240" alt="Ретрокамера «Das Auge IV»" />
        </picture>
      </div>
      <div className="product-card__info">
        <div className="rate product-card__rate">
          {Array.from<number>(Array.from({ length: 5 }, (v, k) => k + 1)).map((element, index) => (
            <svg key={ element } width="17" height="16" aria-hidden="true">
              <use xlinkHref={index <= product.rating - 1 ? '#icon-full-star' : '#icon-star'} ></use>
            </svg>
          ))}
          <p className="visually-hidden">Рейтинг: 3</p>
          <p className="rate__count"><span className="visually-hidden">Всего оценок:</span>{product.reviewCount}</p>
        </div>
        <p className="product-card__title">{product.category}&nbsp;{product.name}</p>
        <p className="product-card__price"><span className="visually-hidden">Цена:</span>{product.price.toLocaleString()} ₽
        </p>
      </div>
      <div className="product-card__buttons">
        {isItemInBasket() ? (
          <button className="btn btn--purple-border product-card__btn product-card__btn--in-cart" onClick={() => navigate(AppRoutes.Basket)}>
            <svg width="16" height="16" aria-hidden="true">
              <use xlinkHref="#icon-basket"></use>
            </svg>
            В корзине
          </button>) : (
          <button className="btn btn--purple product-card__btn" type="button" onClick={() => onSelectedProductChange(product)}>Купить
          </button>)}
        <Link className="btn btn--transparent" to={`/product/${product.id}`}>Подробнее
        </Link>
      </div>
    </div>
  );
};
