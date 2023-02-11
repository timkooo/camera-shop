import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks/rtk-hooks';
import { ReviewPost } from '../../types/review';
import FocusLock from 'react-focus-lock';
import { loadReviews, postReview } from '../../store/api-actions';
import { Camera } from '../../types/camera';

type ReviewModalProps = {
  product: Camera | null;
  modalVisible: boolean;
  onModalToggle: () => void;
  afterModalToggle?: () => void;
}

const ratingConfig = [
  { rating: 5, value: 'Отлично' },
  { rating: 4, value: 'Хорошо' },
  { rating: 3, value: 'Нормально' },
  { rating: 2, value: 'Плохо' },
  { rating: 1, value: 'Ужасно' },
];

export const ReviewModal = ( { product, modalVisible = false, onModalToggle, afterModalToggle } : ReviewModalProps) => {
  const [reviewFormData, setReviewFormData] = useState<ReviewPost>({
    userName: '',
    advantage: '',
    disadvantage: '',
    review: '',
    rating: 0,
    cameraId: 0,
  });
  const dispatch = useAppDispatch();

  const handleReviewFormChange = (
    evt:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value }: { name: string; value: string | number } =
      evt.target;
    if (name === 'rating') {
      setReviewFormData({ ...reviewFormData, [name]: Number(value) });
      return;
    }
    setReviewFormData({ ...reviewFormData, [name]: value });
  };

  const handlePostReview = (evt: React.FormEvent<HTMLFormElement>) => {
    (async () => {
      evt.preventDefault();
      if (product) {
        await dispatch(postReview(reviewFormData));
        dispatch(loadReviews(product.id.toString()));
        onModalToggle();
        setReviewFormData({
          userName: '',
          advantage: '',
          disadvantage: '',
          review: '',
          rating: 0,
          cameraId: product.id,
        });
      }
      afterModalToggle?.();
    })();
  };

  useEffect(() => {
    if (product) {
      setReviewFormData({
        userName: '',
        advantage: '',
        disadvantage: '',
        review: '',
        rating: 0,
        cameraId: product.id,
      });
    }
  }, [product]);

  return (
    <div
      className={classNames('modal', { 'is-active': modalVisible })}
    >
      <div className="modal__wrapper" onClick={onModalToggle}>
        <div className="modal__overlay"></div>
        <FocusLock>
          <div
            className="modal__content"
            onClick={(evt) => evt.stopPropagation()}
          >
            <p className="title title--h4">Оставить отзыв</p>
            <div className="form-review">
              <form method="post" onSubmit={handlePostReview}>
                <div className="form-review__rate">
                  <fieldset className="rate form-review__item">
                    <legend className="rate__caption">
                          Рейтинг
                      <svg width="9" height="9" aria-hidden="true">
                        <use xlinkHref="#icon-snowflake"></use>
                      </svg>
                    </legend>
                    <div className="rate__bar">
                      <div className="rate__group">
                        {ratingConfig.map(({rating, value}) => (
                          <React.Fragment key={rating}>
                            <input
                              className="visually-hidden"
                              id={`star-${rating}`}
                              name="rating"
                              type="radio"
                              value={rating}
                              onChange={handleReviewFormChange}
                              checked={reviewFormData.rating === rating}
                            />
                            <label
                              className="rate__label"
                              htmlFor={`star-${rating}`}
                              title={value}
                            >
                            </label>
                          </React.Fragment>))}
                      </div>
                      <div className="rate__progress">
                        <span className="rate__stars">
                          {reviewFormData.rating}
                        </span>{' '}
                        <span>/</span>{' '}
                        <span className="rate__all-stars">5</span>
                      </div>
                    </div>
                    <p className="rate__message">Нужно оценить товар</p>
                  </fieldset>
                  <div className="custom-input form-review__item">
                    <label>
                      <span className="custom-input__label">
                            Ваше имя
                        <svg width="9" height="9" aria-hidden="true">
                          <use xlinkHref="#icon-snowflake"></use>
                        </svg>
                      </span>
                      <input
                        type="text"
                        name="userName"
                        placeholder="Введите ваше имя"
                        value={reviewFormData.userName}
                        onChange={handleReviewFormChange}
                        required
                      />
                    </label>
                    <p className="custom-input__error">Нужно указать имя</p>
                  </div>
                  <div className="custom-input form-review__item">
                    <label>
                      <span className="custom-input__label">
                            Достоинства
                        <svg width="9" height="9" aria-hidden="true">
                          <use xlinkHref="#icon-snowflake"></use>
                        </svg>
                      </span>
                      <input
                        type="text"
                        name="advantage"
                        placeholder="Основные преимущества товара"
                        value={reviewFormData.advantage}
                        onChange={handleReviewFormChange}
                        required
                      />
                    </label>
                    <p className="custom-input__error">
                          Нужно указать достоинства
                    </p>
                  </div>
                  <div className="custom-input form-review__item">
                    <label>
                      <span className="custom-input__label">
                            Недостатки
                        <svg width="9" height="9" aria-hidden="true">
                          <use xlinkHref="#icon-snowflake"></use>
                        </svg>
                      </span>
                      <input
                        type="text"
                        name="disadvantage"
                        placeholder="Главные недостатки товара"
                        value={reviewFormData.disadvantage}
                        onChange={handleReviewFormChange}
                        required
                      />
                    </label>
                    <p className="custom-input__error">
                          Нужно указать недостатки
                    </p>
                  </div>
                  <div className="custom-textarea form-review__item">
                    <label>
                      <span className="custom-textarea__label">
                            Комментарий
                        <svg width="9" height="9" aria-hidden="true">
                          <use xlinkHref="#icon-snowflake"></use>
                        </svg>
                      </span>
                      <textarea
                        name="review"
                        minLength={5}
                        placeholder="Поделитесь своим опытом покупки"
                        value={reviewFormData.review}
                        onChange={handleReviewFormChange}
                      >
                      </textarea>
                    </label>
                    <div className="custom-textarea__error">
                          Нужно добавить комментарий
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn--purple form-review__btn"
                  type="submit"
                >
                      Отправить отзыв
                </button>
              </form>
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
};
