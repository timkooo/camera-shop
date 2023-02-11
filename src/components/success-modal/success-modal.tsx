
import FocusLock from 'react-focus-lock';
import classNames from 'classnames';

type SuccessModalProps = {
  modalVisible: boolean;
  onModalToggle: () => void;
}

export const SuccessModal = ({ modalVisible = false, onModalToggle } : SuccessModalProps) => (
  <div
    className={classNames('modal', 'modal--narrow', {
      'is-active': modalVisible,
    })}
  >
    <div className="modal__wrapper" onClick={onModalToggle}>
      <div className="modal__overlay"></div>
      <FocusLock>
        <div
          className="modal__content"
          onClick={(evt) => evt.stopPropagation()}
        >
          <p className="title title--h4">Спасибо за отзыв</p>
          <svg
            className="modal__icon"
            width="80"
            height="78"
            aria-hidden="true"
          >
            <use xlinkHref="#icon-review-success"></use>
          </svg>
          <div className="modal__buttons">
            <button
              className="btn btn--purple modal__btn modal__btn--fit-width"
              type="button"
              onClick={onModalToggle}
            >
          Вернуться к покупкам
            </button>
          </div>
          <button
            className="cross-btn"
            type="button"
            aria-label="Закрыть попап"
            onClick={onModalToggle}
          >
            <svg width="10" height="10" aria-hidden="true">
              <use xlinkHref="#icon-close"></use>
            </svg>
          </button>
        </div>
      </FocusLock>
    </div>
  </div>
);
