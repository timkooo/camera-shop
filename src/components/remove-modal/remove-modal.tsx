import classNames from 'classnames';
import { BasketItemType, removeFromBasket } from '../../store/basket/basket.slice';
import { useAppDispatch } from '../../hooks/rtk-hooks';
import { Dispatch } from 'react';
import './remove-modal.css';

type RemoveModalProps = {
  item: BasketItemType | null;
  modalVisible: boolean;
  onModalToggle: () => void;
  onItemRemove: Dispatch<BasketItemType | null>;
}

export const RemoveModal = ({ item, modalVisible, onModalToggle, onItemRemove } : RemoveModalProps) => {
  const dispatch = useAppDispatch();

  const handleRemoveFromBasket = () => {
    if (item) {
      dispatch(removeFromBasket(item.id));
      onItemRemove(null);
      onModalToggle();
    }
  };

  const handleCloseModal = () => {
    onModalToggle();
  };

  return item && (
    <div className={classNames('modal', {'is-active': modalVisible})}>
      <div className="modal__wrapper">
        <div className="modal__overlay"></div>
        <div className="modal__content">
          <p className="title title--h4">Удалить этот товар?</p>
          <div className="basket-item basket-item--short">
            <div className="basket-item__img">
              <picture>
                <source type="image/webp" srcSet={`/${item.previewImgWebp}, /${item.previewImgWebp2x}`} /><img src={item.previewImg} srcSet={`${item.previewImg2x} 2x`} width="140" height="120" alt="Фотоаппарат «Орлёнок»" />
              </picture>
            </div>
            <div className="basket-item__description">
              <p className="basket-item__title">{item.category}&nbsp;{item.name}</p>
              <ul className="basket-item__list">
                <li className="basket-item__list-item"><span className="basket-item__article">Артикул:</span> <span className="basket-item__number">{item.vendorCode}</span>
                </li>
                <li className="basket-item__list-item">{item.category}</li>
                <li className="basket-item__list-item">{item.level}</li>
              </ul>
            </div>
          </div>
          <div className="modal__buttons">
            <button className="btn btn--purple modal__btn modal__btn--half-width" type="button" onClick={handleRemoveFromBasket}>Удалить
            </button>
            <a className="btn btn--transparent modal__btn modal__btn--half-width" href="#" onClick={handleCloseModal}>Продолжить покупки
            </a>
          </div>
          <button className="cross-btn" type="button" aria-label="Закрыть попап" onClick={handleCloseModal}>
            <svg width="10" height="10" aria-hidden="true">
              <use xlinkHref="#icon-close"></use>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
