import { FC, useEffect, useRef } from 'react';
import { MAX_QUANTITY, MIN_QUANTITY } from '../../const';
import { useAppDispatch } from '../../hooks/rtk-hooks';
import { addToBasket, BasketItemType, changeQuantity, decreaseQuantity } from '../../store/basket/basket.slice';

type BasketItemProps = {
  item: BasketItemType;
  onRemoveButtonClick: () => void;
};

export const BasketItem: FC<BasketItemProps> = ({ item, onRemoveButtonClick } : BasketItemProps) => {
  const quantityInput = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();

  const handleRemoveFromBasket = () => {
    onRemoveButtonClick();
  };

  const handleIncreaseQuantity = () => {
    dispatch(addToBasket(item));
  };

  const handleDecreaseQuantity = () => {
    dispatch(decreaseQuantity(item));
  };

  const handleChangeQuantity = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter') {
      if (quantityInput.current && quantityInput.current.value) {
        const quantity = Number(quantityInput.current.value);
        if (quantity < MIN_QUANTITY || quantity > MAX_QUANTITY) {
          quantityInput.current.value = item.quantity.toString();
          return;
        }
        dispatch(changeQuantity({...item, quantity : quantity, totalPrice: item.price * quantity}));
      }
    }
  };

  useEffect(() => {
    if (quantityInput.current && quantityInput.current.value) {
      quantityInput.current.value = item.quantity.toString();
    }
  }, [item]);

  return (
    <li className="basket-item">
      <div className="basket-item__img">
        <picture>
          <source
            type="image/webp"
            srcSet={`/${item.previewImgWebp}, /${item.previewImgWebp2x}`}
          />
          <img
            src={item.previewImg}
            srcSet={`${item.previewImg2x} 2x`}
            width="140"
            height="120"
            alt="Фотоаппарат «Орлёнок»"
          />
        </picture>
      </div>
      <div className="basket-item__description">
        <p className="basket-item__title">{item.category}&nbsp;{item.name}</p>
        <ul className="basket-item__list">
          <li className="basket-item__list-item">
            <span className="basket-item__article">Артикул:</span>{' '}
            <span className="basket-item__number">{item.vendorCode}</span>
          </li>
          <li className="basket-item__list-item">{item.category}</li>
          <li className="basket-item__list-item">{item.level}</li>
        </ul>
      </div>
      <p className="basket-item__price">
        <span className="visually-hidden">Цена:</span>
        {item.price.toLocaleString()} ₽
      </p>
      <div className="quantity">
        <button
          className="btn-icon btn-icon--prev"
          aria-label="уменьшить количество товара"
          onClick={handleDecreaseQuantity}
          disabled={item.quantity === MIN_QUANTITY}
        >
          <svg width="7" height="12" aria-hidden="true">
            <use xlinkHref="#icon-arrow"></use>
          </svg>
        </button>
        <label className="visually-hidden" htmlFor="counter1"></label>
        <input
          ref={quantityInput}
          type="number"
          id="counter1"
          defaultValue={item.quantity}
          onKeyDown={handleChangeQuantity}
          min="1"
          max="99"
          aria-label="количество товара"
        />
        <button
          className="btn-icon btn-icon--next"
          aria-label="увеличить количество товара"
          onClick={handleIncreaseQuantity}
          disabled={item.quantity === MAX_QUANTITY}
        >
          <svg width="7" height="12" aria-hidden="true">
            <use xlinkHref="#icon-arrow"></use>
          </svg>
        </button>
      </div>
      <div className="basket-item__total-price">
        <span className="visually-hidden">Общая цена:</span>{item.totalPrice.toLocaleString()} ₽
      </div>
      <button
        className="cross-btn"
        type="button"
        aria-label="Удалить товар"
        onClick={handleRemoveFromBasket}
      >
        <svg width="10" height="10" aria-hidden="true">
          <use xlinkHref="#icon-close"></use>
        </svg>
      </button>
    </li>
  );
};
