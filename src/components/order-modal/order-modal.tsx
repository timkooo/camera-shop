import FocusLock from 'react-focus-lock';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../const';

type BasketModalProps = {
  modalVisible: boolean;
  onModalToggle: () => void;
}

export const OrderModal = ({ modalVisible, onModalToggle } : BasketModalProps) => {
  const navigate = useNavigate();

  const handleCatalogButtonClick = () => {
    onModalToggle();
    navigate(AppRoutes.Catalog);
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
            <p className="title title--h4">Спасибо за покупку</p>
            <svg className="modal__icon" width="80" height="78" aria-hidden="true">
              <use xlinkHref="#icon-review-success"></use>
            </svg>
            <div className="modal__buttons">
              <button className="btn btn--purple modal__btn modal__btn--fit-width" type="button" onClick={handleCatalogButtonClick}>Вернуться к покупкам
              </button>
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
