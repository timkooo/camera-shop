/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react/no-array-index-key */
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ReviewCard } from '../../components/review-card/review-card';
import { AppRoutes, REVIEWS_TO_SHOW } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks/rtk-hooks';
import {
  loadCameraById,
  loadReviews,
  loadSimilarCameras,
  postReview,
} from '../../store/api-actions';
import {
  selectAreSimilarCamerasLoading,
  selectCameraById,
  selectIsCameraByIdLoading,
  selectSimilarCameras,
} from '../../store/cameras/cameras.selectors';
import { selectReviews } from '../../store/reviews/reviews.selectors';
import { Review, ReviewPost } from '../../types/review';
import FocusLock from 'react-focus-lock';
import { useModal } from '../../hooks/use-modal';
import { Camera } from '../../types/camera';
import { addToBasket } from '../../store/basket/basket.slice';

export const Product = () => {
  const { id } = useParams();
  const camera = useAppSelector(selectCameraById);
  const reviews = useAppSelector(selectReviews);
  const isCameraByIdLoading = useAppSelector(selectIsCameraByIdLoading);
  const similarCameras = useAppSelector(selectSimilarCameras);
  const areSimilarCamerasLoading = useAppSelector(
    selectAreSimilarCamerasLoading
  );
  const [activeProducts, setActiveProducts] = useState({
    start: 0,
    end: 2,
  });
  const [currentTab, setCurrentTab] = useState<'specification' | 'description'>(
    'description'
  );
  const [reviewsRemained, setReviewsRemained] = useState<Review[]>([]);
  const [reviewsToShow, setReviewsToShow] = useState<Review[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Camera | null>(null);
  const [reviewModalVisible, reviewModalToggle] = useModal();
  const [successModalVisible, successModalToggle] = useModal();
  const [reviewFormData, setReviewFormData] = useState<ReviewPost>({
    userName: '',
    advantage: '',
    disadvantage: '',
    review: '',
    rating: 0,
    cameraId: 0,
  });
  const dispatch = useAppDispatch();

  const moveProductsRight = () => {
    const products = { ...activeProducts };
    if (products.end < similarCameras.length - 1) {
      products.start = products.start + 1;
      products.end = products.end + 1;
      setActiveProducts(products);
    }
  };

  const moveProductsLeft = () => {
    const products = { ...activeProducts };
    if (products.start > 0) {
      products.start = products.start - 1;
      products.end = products.end - 1;
      setActiveProducts(products);
    }
  };

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

  const handleAddItemToBasket = () => {
    if (selectedProduct) {
      dispatch(addToBasket(selectedProduct));
    }
    setSelectedProduct(null);
  };

  const handleShowMoreReviews = () => {
    const remained = [...reviewsRemained];
    const toShow = [...reviewsToShow, ...remained.splice(0, REVIEWS_TO_SHOW)];
    setReviewsRemained(remained);
    setReviewsToShow(toShow);
  };

  const handlePostReview = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    await dispatch(postReview(reviewFormData));
    dispatch(loadReviews(id));
    reviewModalToggle();
    if (camera) {
      setReviewFormData({
        userName: '',
        advantage: '',
        disadvantage: '',
        review: '',
        rating: 0,
        cameraId: camera.id,
      });
    }
    successModalToggle();
  };

  const isProductActive = (index: number) => index <= activeProducts.end && index >= activeProducts.start;

  useEffect(() => {
    if (camera) {
      setReviewFormData({
        userName: '',
        advantage: '',
        disadvantage: '',
        review: '',
        rating: 0,
        cameraId: camera.id,
      });
    }
  }, [camera]);

  useEffect(() => {
    const remained = [...reviews];
    remained.sort((a, b) => Date.parse(b.createAt) - Date.parse(a.createAt));
    const toShow = remained.splice(0, REVIEWS_TO_SHOW);
    setReviewsRemained(remained);
    setReviewsToShow(toShow);
  }, [reviews]);

  useEffect(() => {
    dispatch(loadCameraById(id));
    dispatch(loadSimilarCameras(id));
    dispatch(loadReviews(id));
  }, [dispatch, id]);

  useEffect(() => {
    window.history.replaceState('', document.title, `${window.location.pathname}#${currentTab}`);
  }, [id, currentTab]);

  useModal(!!reviewModalVisible);
  useModal(!!successModalVisible);
  useModal(!!selectedProduct);

  if (isCameraByIdLoading) {
    return <div>LOADING</div>;
  }

  return camera ? (
    <>
      <main>
        <div className="page-content">
          <div className="breadcrumbs">
            <div className="container">
              <ul className="breadcrumbs__list">
                <li className="breadcrumbs__item">
                  <Link className="breadcrumbs__link" to="/">
                    Главная
                    <svg width="5" height="8" aria-hidden="true">
                      <use xlinkHref="#icon-arrow-mini"></use>
                    </svg>
                  </Link>
                </li>
                <li className="breadcrumbs__item">
                  <Link className="breadcrumbs__link" to="/catalog">
                    Каталог
                    <svg width="5" height="8" aria-hidden="true">
                      <use xlinkHref="#icon-arrow-mini"></use>
                    </svg>
                  </Link>
                </li>
                <li className="breadcrumbs__item">
                  <span className="breadcrumbs__link breadcrumbs__link--active">
                    {camera?.name}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="page-content__section">
            <section className="product">
              <div className="container">
                <div className="product__img">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={`/${camera.previewImgWebp}, /${camera.previewImgWebp2x}`}
                    />
                    <img
                      src={camera?.previewImg}
                      srcSet={`${camera?.previewImg2x} 2x`}
                      width="560"
                      height="480"
                      alt="Ретрокамера Das Auge IV"
                    />
                  </picture>
                </div>
                <div className="product__content">
                  <h1 className="title title--h3">{camera.name}</h1>
                  <div className="rate product__rate">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <svg
                        key={ index }
                        width="17"
                        height="16"
                        aria-hidden="true"
                      >
                        <use
                          xlinkHref={
                            index <= camera.rating - 1
                              ? '#icon-full-star'
                              : '#icon-star'
                          }
                        >
                        </use>
                      </svg>
                    ))}
                    <p className="visually-hidden">Рейтинг: 4</p>
                    <p className="rate__count">
                      <span className="visually-hidden">Всего оценок:</span>
                      {camera.reviewCount}
                    </p>
                  </div>
                  <p className="product__price">
                    <span className="visually-hidden">Цена:</span>
                    {camera.price.toLocaleString()} ₽
                  </p>
                  <button className="btn btn--purple" type="button">
                    <svg width="24" height="16" aria-hidden="true">
                      <use xlinkHref="#icon-add-basket"></use>
                    </svg>
                    Добавить в корзину
                  </button>
                  <div className="tabs product__tabs">
                    <div className="tabs__controls product__tabs-controls">
                      <button
                        className={classNames('tabs__control', {
                          'is-active': currentTab === 'specification',
                        })}
                        type="button"
                        onClick={() => setCurrentTab('specification')}
                      >
                        Характеристики
                      </button>
                      <button
                        className={classNames('tabs__control', {
                          'is-active': currentTab === 'description',
                        })}
                        type="button"
                        onClick={() => setCurrentTab('description')}
                      >
                        Описание
                      </button>
                    </div>
                    <div className="tabs__content">
                      <div
                        className={classNames('tabs__element', {
                          'is-active': currentTab === 'specification',
                        })}
                      >
                        <ul className="product__tabs-list">
                          <li className="item-list">
                            <span className="item-list__title">Артикул:</span>
                            <p className="item-list__text">
                              {camera.vendorCode}
                            </p>
                          </li>
                          <li className="item-list">
                            <span className="item-list__title">Категория:</span>
                            <p className="item-list__text">{camera.category}</p>
                          </li>
                          <li className="item-list">
                            <span className="item-list__title">
                              Тип камеры:
                            </span>
                            <p className="item-list__text">{camera.type}</p>
                          </li>
                          <li className="item-list">
                            <span className="item-list__title">Уровень:</span>
                            <p className="item-list__text">{camera.level}</p>
                          </li>
                        </ul>
                      </div>
                      <div
                        className={classNames('tabs__element', {
                          'is-active': currentTab === 'description',
                        })}
                      >
                        <div className="product__tabs-text">
                          <p>{camera.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className="page-content__section">
            <section className="product-similar">
              <div className="container">
                <h2 className="title title--h3">Похожие товары</h2>
                <div className="product-similar__slider">
                  <div className="product-similar__slider-list">
                    {areSimilarCamerasLoading ? (
                      <div>LOADING</div>
                    ) : (
                      similarCameras.map((similarCamera, index) => (
                        <div
                          key={similarCamera.id}
                          className={classNames('product-card', {
                            'is-active': isProductActive(index),
                          })}
                        >
                          <div className="product-card__img">
                            <picture>
                              <source
                                type="image/webp"
                                srcSet={`/${similarCamera.previewImgWebp}, /${similarCamera.previewImgWebp2x}`}
                              />
                              <img
                                src={similarCamera.previewImg}
                                srcSet={`${similarCamera.previewImg2x} 2x`}
                                width="280"
                                height="240"
                                alt="Фотоаппарат FastShot MR-5"
                              />
                            </picture>
                          </div>
                          <div className="product-card__info">
                            <div className="rate product-card__rate">
                              <svg width="17" height="16" aria-hidden="true">
                                <use xlinkHref="#icon-full-star"></use>
                              </svg>
                              <svg width="17" height="16" aria-hidden="true">
                                <use xlinkHref="#icon-full-star"></use>
                              </svg>
                              <svg width="17" height="16" aria-hidden="true">
                                <use xlinkHref="#icon-full-star"></use>
                              </svg>
                              <svg width="17" height="16" aria-hidden="true">
                                <use xlinkHref="#icon-full-star"></use>
                              </svg>
                              <svg width="17" height="16" aria-hidden="true">
                                <use xlinkHref="#icon-star"></use>
                              </svg>
                              <p className="visually-hidden">
                                Рейтинг: {similarCamera.rating}
                              </p>
                              <p className="rate__count">
                                <span className="visually-hidden">
                                  Всего оценок:
                                </span>
                                {similarCamera.reviewCount}
                              </p>
                            </div>
                            <p className="product-card__title">{similarCamera.name}</p>
                            <p className="product-card__price">
                              <span className="visually-hidden">Цена:</span>
                              {similarCamera.price.toLocaleString()} ₽
                            </p>
                          </div>
                          <div className="product-card__buttons">
                            <button
                              className="btn btn--purple product-card__btn"
                              type="button"
                              onClick={() => setSelectedProduct(similarCamera)}
                            >
                              Купить
                            </button>
                            <Link
                              className="btn btn--transparent"
                              to={`/product/${similarCamera.id}`}
                            >
                              Подробнее
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <button
                    className="slider-controls slider-controls--prev"
                    type="button"
                    aria-label="Предыдущий слайд"
                    disabled={activeProducts.start === 0}
                    onClick={moveProductsLeft}
                  >
                    <svg width="7" height="12" aria-hidden="true">
                      <use xlinkHref="#icon-arrow"></use>
                    </svg>
                  </button>
                  <button
                    className="slider-controls slider-controls--next"
                    type="button"
                    aria-label="Следующий слайд"
                    disabled={activeProducts.end === similarCameras.length - 1}
                    onClick={moveProductsRight}
                  >
                    <svg width="7" height="12" aria-hidden="true">
                      <use xlinkHref="#icon-arrow"></use>
                    </svg>
                  </button>
                </div>
              </div>
            </section>
          </div>
          <div className="page-content__section">
            <section className="review-block">
              <div className="container">
                <div className="page-content__headed">
                  <h2 className="title title--h3">Отзывы</h2>
                  <button
                    className="btn"
                    type="button"
                    onClick={reviewModalToggle}
                  >
                    Оставить свой отзыв
                  </button>
                </div>
                <ul className="review-block__list">
                  {reviewsToShow.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </ul>
                <div className="review-block__buttons">
                  <button
                    className={classNames('btn', 'btn--purple', {
                      'visually-hidden': reviewsRemained.length === 0,
                    })}
                    type="button"
                    onClick={handleShowMoreReviews}
                  >
                    Показать больше отзывов
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div
          className={classNames('modal', { 'is-active': reviewModalVisible })}
        >
          <div className="modal__wrapper" onClick={reviewModalToggle}>
            <div className="modal__overlay"></div>
            <FocusLock group="focus-group">
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
                            <input
                              className="visually-hidden"
                              id="star-5"
                              name="rating"
                              type="radio"
                              value={5}
                              onChange={handleReviewFormChange}
                              checked={reviewFormData.rating === 5}
                            />
                            <label
                              className="rate__label"
                              htmlFor="star-5"
                              title="Отлично"
                            >
                            </label>
                            <input
                              className="visually-hidden"
                              id="star-4"
                              name="rating"
                              type="radio"
                              value={4}
                              onChange={handleReviewFormChange}
                              checked={reviewFormData.rating === 4}
                            />
                            <label
                              className="rate__label"
                              htmlFor="star-4"
                              title="Хорошо"
                            >
                            </label>
                            <input
                              className="visually-hidden"
                              id="star-3"
                              name="rating"
                              type="radio"
                              value={3}
                              onChange={handleReviewFormChange}
                              checked={reviewFormData.rating === 3}
                            />
                            <label
                              className="rate__label"
                              htmlFor="star-3"
                              title="Нормально"
                            >
                            </label>
                            <input
                              className="visually-hidden"
                              id="star-2"
                              name="rating"
                              type="radio"
                              value={2}
                              onChange={handleReviewFormChange}
                              checked={reviewFormData.rating === 2}
                            />
                            <label
                              className="rate__label"
                              htmlFor="star-2"
                              title="Плохо"
                            >
                            </label>
                            <input
                              className="visually-hidden"
                              id="star-1"
                              name="rating"
                              type="radio"
                              value={1}
                              onChange={handleReviewFormChange}
                              checked={reviewFormData.rating === 1}
                            />
                            <label
                              className="rate__label"
                              htmlFor="star-1"
                              title="Ужасно"
                            >
                            </label>
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
                  onClick={reviewModalToggle}
                >
                  <svg width="10" height="10" aria-hidden="true">
                    <use xlinkHref="#icon-close"></use>
                  </svg>
                </button>
              </div>
            </FocusLock>
          </div>
        </div>

        <div
          className={classNames('modal', 'modal--narrow', {
            'is-active': successModalVisible,
          })}
        >
          <div className="modal__wrapper" onClick={successModalToggle}>
            <div className="modal__overlay"></div>
            <FocusLock group="focus-group">
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
                    onClick={successModalToggle}
                  >
                    Вернуться к покупкам
                  </button>
                </div>
                <button
                  className="cross-btn"
                  type="button"
                  aria-label="Закрыть попап"
                  onClick={successModalToggle}
                >
                  <svg width="10" height="10" aria-hidden="true">
                    <use xlinkHref="#icon-close"></use>
                  </svg>
                </button>
              </div>
            </FocusLock>
          </div>
        </div>

        <div className={classNames('modal', { 'is-active': selectedProduct })}>
          <div
            className="modal__wrapper"
            onClick={() => setSelectedProduct(null)}
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
                        srcSet={`/${selectedProduct?.previewImgWebp}, /${selectedProduct?.previewImgWebp2x}`}
                      />
                      <img
                        src={selectedProduct?.previewImg}
                        srcSet={`${selectedProduct?.previewImg2x} 2x`}
                        width="140"
                        height="120"
                        alt={selectedProduct?.name}
                      />
                    </picture>
                  </div>
                  <div className="basket-item__description">
                    <p className="basket-item__title">{selectedProduct?.name}</p>
                    <ul className="basket-item__list">
                      <li className="basket-item__list-item">
                        <span className="basket-item__article">Артикул:</span>{' '}
                        <span className="basket-item__number">{selectedProduct?.vendorCode}</span>
                      </li>
                      <li className="basket-item__list-item">
                        {selectedProduct?.type}
                      </li>
                      <li className="basket-item__list-item">
                        {selectedProduct?.level}
                      </li>
                    </ul>
                    <p className="basket-item__price">
                      <span className="visually-hidden">Цена:</span>{selectedProduct?.price.toLocaleString()} ₽
                    </p>
                  </div>
                </div>
                <div className="modal__buttons">
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
                </div>
                <button
                  className="cross-btn"
                  type="button"
                  aria-label="Закрыть попап"
                  onClick={() => setSelectedProduct(null)}
                >
                  <svg width="10" height="10" aria-hidden="true">
                    <use xlinkHref="#icon-close"></use>
                  </svg>
                </button>
              </div>
            </FocusLock>
          </div>
        </div>

      </main>
      <a className="up-btn" href="#header">
        <svg width="12" height="18" aria-hidden="true">
          <use xlinkHref="#icon-arrow2"></use>
        </svg>
      </a>
    </>
  ) : (
    <div>
      <h1>Sorry no such camera found</h1>
      <Link to={AppRoutes.Main}> Back to catalog </Link>
    </div>
  );
};
