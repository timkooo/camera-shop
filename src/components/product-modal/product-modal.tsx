
import FocusLock, { AutoFocusInside } from 'react-focus-lock';
import { Dispatch } from 'react';
import { Camera } from '../../types/camera';
import { useAppDispatch } from '../../hooks/rtk-hooks';
import { addToBasket } from '../../store/basket/basket.slice';
import classNames from 'classnames';

type ProductModalProps = {
  product: Camera | null;
  modalVisible: boolean;
  onModalToggle: () => void;
  onProductSelect: Dispatch<Camera | null>;
}

export const ProductModal = ({ product, modalVisible, onModalToggle, onProductSelect } : ProductModalProps) => {
  const dispatch = useAppDispatch();

  const handleAddItemToBasket = () => {
    if (product) {
      dispatch(addToBasket(product));
    }
    onProductSelect(null);
    onModalToggle();
  };

  const handleCloseModal = () => {
    onProductSelect(null);
    onModalToggle();
  };

  return product && (
    <div className={classNames('modal', {'is-active': modalVisible})}>
      <div
        className="modal__wrapper"
        onClick={handleCloseModal}
      >
        <div className="modal__overlay"></div>
        <FocusLock>
          <div
            className="modal__content"
            onClick={(evt) => evt.stopPropagation()}
          >
            <p className="title title--h4">Добавить товар в корзину</p>
            <div className="basket-item basket-item--short">
              <div className="basket-item__img">
                <picture>
                  <source
                    type="image/webp"
                    srcSet={`/${product.previewImgWebp}, /${product.previewImgWebp2x}`}
                  />
                  <img
                    src={product.previewImg}
                    srcSet={`${product.previewImg2x} 2x`}
                    width="140"
                    height="120"
                    alt={product.name}
                  />
                </picture>
              </div>
              <div className="basket-item__description">
                <p className="basket-item__title">{product.name}</p>
                <ul className="basket-item__list">
                  <li className="basket-item__list-item">
                    <span className="basket-item__article">Артикул:</span>{' '}
                    <span className="basket-item__number">{product.vendorCode}</span>
                  </li>
                  <li className="basket-item__list-item">
                    {product.type}
                  </li>
                  <li className="basket-item__list-item">
                    {product.level}
                  </li>
                </ul>
                <p className="basket-item__price">
                  <span className="visually-hidden">Цена:</span>{product.price.toLocaleString()} ₽
                </p>
              </div>
            </div>
            <div className="modal__buttons">
              <AutoFocusInside>
                <button
                  className="btn btn--purple modal__btn modal__btn--fit-width"
                  type="button"
                  onClick={handleAddItemToBasket}
                >
                  <svg width="24" height="16" aria-hidden="true">
                    <use xlinkHref="#icon-add-basket"></use>
                  </svg>
                    Добавить в корзину
                </button>
              </AutoFocusInside>
            </div>
            <button
              className="cross-btn"
              type="button"
              aria-label="Закрыть попап"
              onClick={handleCloseModal}
            >
              <svg width="10" height="10" aria-hidden="true">
                <use xlinkHref="#icon-close"></use>
              </svg>
            </button>
          </div>
        </FocusLock>
      </div>
    </div>);
};

