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
} from '../../store/api-actions';
import {
  selectAreSimilarCamerasLoading,
  selectCameraById,
  selectIsCameraByIdLoading,
  selectSimilarCameras,
} from '../../store/cameras/cameras.selectors';
import { selectReviews } from '../../store/reviews/reviews.selectors';
import { Review } from '../../types/review';
import { useModal } from '../../hooks/use-modal';
import { Camera } from '../../types/camera';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductModal } from '../../components/product-modal/product-modal';
import { ReviewModal } from '../../components/review-modal/review-modal';
import { SuccessModal } from '../../components/success-modal/success-modal';

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
  const [productModalVisible, productModalToggle] = useModal();
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

  const handleShowMoreReviews = () => {
    const remained = [...reviewsRemained];
    const toShow = [...reviewsToShow, ...remained.splice(0, REVIEWS_TO_SHOW)];
    setReviewsRemained(remained);
    setReviewsToShow(toShow);
  };

  const handleProductSelection = (product: Camera) => {
    setSelectedProduct(product);
    productModalToggle();
  };

  const isProductActive = (index: number) => index <= activeProducts.end && index >= activeProducts.start;

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
                      similarCameras.map((similarCamera, index) => <ProductCard key={similarCamera.id} product={similarCamera} onSelectedProductChange={() => handleProductSelection(similarCamera)} isActive={isProductActive(index)}/>)
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

        <SuccessModal modalVisible={successModalVisible} onModalToggle={successModalToggle}/>
        <ReviewModal product={camera} modalVisible={reviewModalVisible} onModalToggle={reviewModalToggle} afterModalToggle={successModalToggle}/>
        <ProductModal product={selectedProduct} modalVisible={productModalVisible} onModalToggle={productModalToggle} onProductSelect={setSelectedProduct}/>

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
