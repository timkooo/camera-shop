import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ReviewCard } from '../../components/review-card/review-card';
import { AppRoutes, REVIEWS_TO_SHOW } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks/rtkHooks';
import { loadCameraById, loadReviews, loadSimilarCameras, postReview } from '../../store/api-actions';
import { selectAreSimilarCamerasLoading, selectCameraById, selectIsCameraByIdLoading, selectSimilarCameras } from '../../store/cameras/cameras.selectors';
import { selectReviews } from '../../store/reviews/reviews.selectors';
import { Review, ReviewPost } from '../../types/review';

export const Product = () => {
  const { id } = useParams();
  const camera = useAppSelector(selectCameraById);
  const reviews = useAppSelector(selectReviews);
  const isCameraByIdLoading = useAppSelector(selectIsCameraByIdLoading);
  const similarCameras = useAppSelector(selectSimilarCameras);
  const areSimilarCamerasLoading = useAppSelector(selectAreSimilarCamerasLoading);
  const [activeProducts, setActiveProducts] = useState({
    start: 0,
    end: 2,
  })
  const [reviewsRemained, setReviewsRemained] = useState<Review[]>([]);
  const [reviewsToShow, setReviewsToShow] = useState<Review[]>([]);
  const [reviewModalVisible, setReviewModalVisible] = useState<Boolean>(false);
  const [successModalVisible, setSuccessModalVisible] = useState<Boolean>(false);
  const [reviewFormData, setReviewFormData] = useState<ReviewPost>({
    userName: '',
    advantage: '',
    disadvantage: '',
    review: '',
    rating: 0,
    cameraId: 0,
  })
  const dispatch = useAppDispatch();

  const moveProductsRight = () => {
    const products = { ...activeProducts};
    if (products.end < similarCameras.length - 1) { 
      products.start = products.start + 1;
      products.end = products.end + 1;
      setActiveProducts(products);
    }
  }

  const moveProductsLeft = () => {
    const products = { ...activeProducts};
    if (products.start > 0) { 
      products.start = products.start - 1;
      products.end = products.end - 1;
      setActiveProducts(products);
    }
  }

  const handleReviewFormChange = (evt: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } : { name: string; value: string | number } = evt.target;
    if (name === 'rating') {
      setReviewFormData({...reviewFormData, [name] : Number(value)});
      return;
    }
    setReviewFormData({...reviewFormData, [name] : value});
  }

  const handleShowReviewModal = () => {
    setReviewModalVisible(!reviewModalVisible);
  }

  const handleShowSuccessModal = () => {
    setSuccessModalVisible(!successModalVisible);
  }

  const handleShowMoreReviews = () => {
    const remained = [...reviewsRemained];
    const toShow = [...reviewsToShow, ...remained.splice(0, REVIEWS_TO_SHOW)];
    setReviewsRemained(remained);
    setReviewsToShow(toShow);
  }

  const handlePostReview = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    await dispatch(postReview(reviewFormData));
    dispatch(loadReviews(id));
    handleShowReviewModal();
    handleShowSuccessModal();
  }

  const isProductActive = (index: number) => {
    return index <= activeProducts.end && index >= activeProducts.start
  }

  useEffect(() => {
    if (camera) {
      setReviewFormData({
        userName: '',
        advantage: '',
        disadvantage: '',
        review: '',
        rating: 0,
        cameraId: camera.id,
      })
    }
  }, [camera])

  useEffect(() => {
    const remained = [...reviews];
    remained.sort((a,b) => Date.parse(b.createAt) - Date.parse(a.createAt));
    const toShow = remained.splice(0, REVIEWS_TO_SHOW);
    setReviewsRemained(remained);
    setReviewsToShow(toShow);
  }, [reviews])

  useEffect(() => {
    dispatch(loadCameraById(id));
    dispatch(loadSimilarCameras(id));
    dispatch(loadReviews(id));
  }, [dispatch, id])

  useEffect(() => {
    reviewModalVisible || successModalVisible ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'unset';
  }, [reviewModalVisible, successModalVisible]);

  if (isCameraByIdLoading) {
    return <div>LOADING</div>
  }

  return camera ? (
    <React.Fragment>
      <main>
        <div className="page-content">
          <div className="breadcrumbs">
            <div className="container">
              <ul className="breadcrumbs__list">
                <li className="breadcrumbs__item"><Link className="breadcrumbs__link" to="/">Главная
                    <svg width="5" height="8" aria-hidden="true">
                      <use xlinkHref="#icon-arrow-mini"></use>
                    </svg></Link>
                </li>
                <li className="breadcrumbs__item"><Link className="breadcrumbs__link" to="/catalog">Каталог
                    <svg width="5" height="8" aria-hidden="true">
                      <use xlinkHref="#icon-arrow-mini"></use>
                    </svg></Link>
                </li>
                <li className="breadcrumbs__item"><span className="breadcrumbs__link breadcrumbs__link--active">{camera?.name}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="page-content__section">
            <section className="product">
              <div className="container">
                <div className="product__img">
                  <picture>
                    <source type="image/webp" srcSet={`/${camera.previewImgWebp}, /${camera.previewImgWebp2x}`} /><img src={camera?.previewImg} srcSet={`${camera?.previewImg2x} 2x`} width="560" height="480" alt="Ретрокамера Das Auge IV" />
                  </picture>
                </div>
                <div className="product__content">
                  <h1 className="title title--h3">{camera.name}</h1>
                  <div className="rate product__rate">
                    {Array.from( {length: 5} ).map((_, index) => ( 
                      <svg key={index} width="17" height="16" aria-hidden="true">
                        <use xlinkHref={index <= camera.rating - 1 ? "#icon-full-star" : "#icon-star"} ></use>
                      </svg>
                    ))}
                    <p className="visually-hidden">Рейтинг: 4</p>
                    <p className="rate__count"><span className="visually-hidden">Всего оценок:</span>12</p>
                  </div>
                  <p className="product__price"><span className="visually-hidden">Цена:</span>{camera.price} ₽</p>
                  <button className="btn btn--purple" type="button">
                    <svg width="24" height="16" aria-hidden="true">
                      <use xlinkHref="#icon-add-basket"></use>
                    </svg>Добавить в корзину
                  </button>
                  <div className="tabs product__tabs">
                    <div className="tabs__controls product__tabs-controls">
                      <button className="tabs__control" type="button">Характеристики</button>
                      <button className="tabs__control is-active" type="button">Описание</button>
                    </div>
                    <div className="tabs__content">
                      <div className="tabs__element">
                        <ul className="product__tabs-list">
                          <li className="item-list"><span className="item-list__title">Артикул:</span>
                            <p className="item-list__text"> DA4IU67AD5</p>
                          </li>
                          <li className="item-list"><span className="item-list__title">Категория:</span>
                            <p className="item-list__text">Видеокамера</p>
                          </li>
                          <li className="item-list"><span className="item-list__title">Тип камеры:</span>
                            <p className="item-list__text">Коллекционная</p>
                          </li>
                          <li className="item-list"><span className="item-list__title">Уровень:</span>
                            <p className="item-list__text">Любительский</p>
                          </li>
                        </ul>
                      </div>
                      <div className="tabs__element is-active">
                        <div className="product__tabs-text">
                          <p>Немецкий концерн BRW разработал видеокамеру Das Auge IV в&nbsp;начале 80-х годов, однако она до&nbsp;сих пор пользуется популярностью среди коллекционеров и&nbsp;яростных почитателей старинной техники.</p>
                          <p>Вы&nbsp;тоже можете прикоснуться к&nbsp;волшебству аналоговой съёмки, заказав этот чудо-аппарат. Кто знает, может с&nbsp;Das Auge IV&nbsp;начнётся ваш путь к&nbsp;наградам всех престижных кинофестивалей.</p>
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

                    {areSimilarCamerasLoading ? <div>LOADING</div> :
                                
                    similarCameras.map((camera, index) => (
                      <div key={camera.id} className={classNames("product-card", {"is-active": isProductActive(index) })}>
                        <div className="product-card__img">
                          <picture>
                            <source type="image/webp" srcSet={`/${camera.previewImgWebp}, /${camera.previewImgWebp2x}`} /><img src={camera.previewImg} srcSet={`${camera.previewImg2x} 2x`} width="280" height="240" alt="Фотоаппарат FastShot MR-5" />
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
                            <p className="visually-hidden">Рейтинг: {camera.rating}</p>
                            <p className="rate__count"><span className="visually-hidden">Всего оценок:</span>{camera.reviewCount}</p>
                          </div>
                          <p className="product-card__title">{camera.name}</p>
                          <p className="product-card__price"><span className="visually-hidden">Цена:</span>{camera.price} ₽
                          </p>
                        </div>
                        <div className="product-card__buttons">
                          <button className="btn btn--purple product-card__btn" type="button">Купить
                          </button>
                          <Link className="btn btn--transparent" to={`/product/${camera.id}`}>Подробнее</Link>
                        </div>
                      </div>
                    ))}
                    
                  </div>
                  <button className="slider-controls slider-controls--prev" type="button" aria-label="Предыдущий слайд" disabled={activeProducts.start === 0} onClick={moveProductsLeft}>
                    <svg width="7" height="12" aria-hidden="true">
                      <use xlinkHref="#icon-arrow"></use>
                    </svg>
                  </button>
                  <button className="slider-controls slider-controls--next" type="button" aria-label="Следующий слайд" disabled={activeProducts.end === similarCameras.length - 1} onClick={moveProductsRight}>
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
                  <button className="btn" type="button" onClick={handleShowReviewModal}>Оставить свой отзыв</button>
                </div>
                <ul className="review-block__list">

                  {reviewsToShow.map((review) => <ReviewCard key={review.id} review={review}/>)}

                </ul>
                <div className="review-block__buttons">
                  <button className={classNames("btn", "btn--purple", {"visually-hidden" : reviewsRemained.length === 0})} type="button" onClick={handleShowMoreReviews}>Показать больше отзывов
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className={classNames("modal", {"is-active" : reviewModalVisible})}>
          <div className="modal__wrapper" onClick={handleShowReviewModal}>
            <div className="modal__overlay"></div>
            <div className="modal__content" onClick={evt => evt.stopPropagation()}>
              <p className="title title--h4">Оставить отзыв</p>
              <div className="form-review">
                <form method="post" onSubmit={handlePostReview}>
                  <div className="form-review__rate">
                    <fieldset className="rate form-review__item">
                      <legend className="rate__caption">Рейтинг
                        <svg width="9" height="9" aria-hidden="true">
                          <use xlinkHref="#icon-snowflake"></use>
                        </svg>
                      </legend>
                      <div className="rate__bar">
                        <div className="rate__group">
                          <input className="visually-hidden" id="star-5" name="rating" type="radio" value={5} onChange={handleReviewFormChange} checked={reviewFormData.rating === 5}/>
                          <label className="rate__label" htmlFor="star-5" title="Отлично"></label>
                          <input className="visually-hidden" id="star-4" name="rating" type="radio" value={4} onChange={handleReviewFormChange} checked={reviewFormData.rating === 4}/>
                          <label className="rate__label" htmlFor="star-4" title="Хорошо"></label>
                          <input className="visually-hidden" id="star-3" name="rating" type="radio" value={3} onChange={handleReviewFormChange} checked={reviewFormData.rating === 3}/>
                          <label className="rate__label" htmlFor="star-3" title="Нормально"></label>
                          <input className="visually-hidden" id="star-2" name="rating" type="radio" value={2} onChange={handleReviewFormChange} checked={reviewFormData.rating === 2}/>
                          <label className="rate__label" htmlFor="star-2" title="Плохо"></label>
                          <input className="visually-hidden" id="star-1" name="rating" type="radio" value={1} onChange={handleReviewFormChange} checked={reviewFormData.rating === 1}/>
                          <label className="rate__label" htmlFor="star-1" title="Ужасно"></label>
                        </div>
                        <div className="rate__progress"><span className="rate__stars">{reviewFormData.rating}</span> <span>/</span> <span className="rate__all-stars">5</span>
                        </div>
                      </div>
                      <p className="rate__message">Нужно оценить товар</p>
                    </fieldset>
                    <div className="custom-input form-review__item">
                      <label><span className="custom-input__label">Ваше имя
                          <svg width="9" height="9" aria-hidden="true">
                            <use xlinkHref="#icon-snowflake"></use>
                          </svg></span>
                        <input type="text" name="userName" placeholder="Введите ваше имя" value={reviewFormData.userName} onChange={handleReviewFormChange} required />
                      </label>
                      <p className="custom-input__error">Нужно указать имя</p>
                    </div>
                    <div className="custom-input form-review__item">
                      <label><span className="custom-input__label">Достоинства
                          <svg width="9" height="9" aria-hidden="true">
                            <use xlinkHref="#icon-snowflake"></use>
                          </svg></span>
                        <input type="text" name="advantage" placeholder="Основные преимущества товара" value={reviewFormData.advantage} onChange={handleReviewFormChange} required />
                      </label>
                      <p className="custom-input__error">Нужно указать достоинства</p>
                    </div>
                    <div className="custom-input form-review__item">
                      <label><span className="custom-input__label">Недостатки
                          <svg width="9" height="9" aria-hidden="true">
                            <use xlinkHref="#icon-snowflake"></use>
                          </svg></span>
                        <input type="text" name="disadvantage" placeholder="Главные недостатки товара" value={reviewFormData.disadvantage} onChange={handleReviewFormChange} required />
                      </label>
                      <p className="custom-input__error">Нужно указать недостатки</p>
                    </div>
                    <div className="custom-textarea form-review__item">
                      <label><span className="custom-textarea__label">Комментарий
                          <svg width="9" height="9" aria-hidden="true">
                            <use xlinkHref="#icon-snowflake"></use>
                          </svg></span>
                        <textarea name="review" minLength={5} placeholder="Поделитесь своим опытом покупки" value={reviewFormData.review} onChange={handleReviewFormChange}></textarea>
                      </label>
                      <div className="custom-textarea__error">Нужно добавить комментарий</div>
                    </div>
                  </div>
                  <button className="btn btn--purple form-review__btn" type="submit">Отправить отзыв</button>
                </form>
              </div>
              <button className="cross-btn" type="button" aria-label="Закрыть попап" onClick={handleShowReviewModal}>
                <svg width="10" height="10" aria-hidden="true">
                  <use xlinkHref="#icon-close"></use>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className={classNames("modal", "modal--narrow", {"is-active" : successModalVisible})}>
          <div className="modal__wrapper" onClick={handleShowSuccessModal}>
            <div className="modal__overlay"></div>
            <div className="modal__content" onClick={evt => evt.stopPropagation()}>
              <p className="title title--h4">Спасибо за отзыв</p>
              <svg className="modal__icon" width="80" height="78" aria-hidden="true">
                <use xlinkHref="#icon-review-success"></use>
              </svg>
              <div className="modal__buttons">
                <button className="btn btn--purple modal__btn modal__btn--fit-width" type="button" onClick={handleShowSuccessModal}>Вернуться к покупкам
                </button>
              </div>
              <button className="cross-btn" type="button" aria-label="Закрыть попап" onClick={handleShowSuccessModal}>
                <svg width="10" height="10" aria-hidden="true">
                  <use xlinkHref="#icon-close"></use>
                </svg>
              </button>
            </div>
          </div>
        </div>

      </main>
      <a className="up-btn" href="#header">
        <svg width="12" height="18" aria-hidden="true">
          <use xlinkHref="#icon-arrow2"></use>
        </svg>
      </a>
    </React.Fragment>
  ) : <div><h1>Sorry no such camera found</h1>
        <Link to={AppRoutes.Main}> Back to catalog </Link>
      </div>
}