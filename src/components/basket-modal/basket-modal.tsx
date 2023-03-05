import FocusLock from 'react-focus-lock';
import classNames from 'classnames';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../const';

type BasketModalProps = {
  modalVisible: boolean;
  onModalToggle: () => void;
}

export const BasketModal = ({ modalVisible, onModalToggle } : BasketModalProps) => {
  const navigate = useNavigate();

  const handleBasketButtonClick = () => {
    navigate(AppRoutes.Basket);
    onModalToggle();
  };

  const handleCloseModal = () => {
    onModalToggle();
  };

  return (
    <div className={classNames('modal', 'modal--narrow', {'is-active': modalVisible})}>
      <div
        className="modal__wrapper"
        onClick={handleCloseModal}
      >
        <div className="modal__overlay"></div>
        <FocusLock>
          <div className="modal__content">
            <p className="title title--h4">Товар успешно добавлен в корзину</p>
            <svg className="modal__icon" width="86" height="80" aria-hidden="true">
              <use xlinkHref="#icon-success"></use>
            </svg>
            <div className="modal__buttons"><Link className="btn btn--transparent modal__btn" to={AppRoutes.Catalog} onClick={handleCloseModal}>Продолжить покупки</Link>
              <button className="btn btn--purple modal__btn modal__btn--fit-width" onClick={handleBasketButtonClick}>Перейти в корзину</button>
            </div>
            <button className="cross-btn" type="button" aria-label="Закрыть попап" onClick={handleCloseModal}>
              <svg width="10" height="10" aria-hidden="true">
                <use xlinkHref="#icon-close"></use>
              </svg>
            </button>
          </div>
        </FocusLock>
      </div>
    </div>
  );
};
