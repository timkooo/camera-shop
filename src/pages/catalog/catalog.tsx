import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/rtk-hooks';
import { loadPromo } from '../../store/api-actions';
import { Sorting, updateSorting } from '../../store/application/application.slice';
import { AppRoutes, getSortingCategory, UrlParams } from '../../const';
import { selectPromo, selectSorting } from '../../store/application/application.selectors';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Pagination } from '../../components/pagination/pagination';
import { ProductsList } from '../../components/products-list/products-list';
import { FiltersForm } from '../../components/filters-form/filters-form';

export const Catalog = () => {
  const { pageNumber = '1' } = useParams();
  const [urlParams, setUrlParams] = useSearchParams();
  const promo = useAppSelector(selectPromo);
  const sorting = useAppSelector(selectSorting);
  const dispatch = useAppDispatch();

  const handleSortingFormChange = (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value }: { name: string; value: string } = evt.target;
    const sortingCategory = getSortingCategory(name);
    const sortingData = { ...sorting, [sortingCategory]: value };
    dispatch(updateSorting(sortingData));
    updateUrlParam(sortingCategory, value);
  };

  const updateUrlParam = (key: string, value: string) => {
    const params = new URLSearchParams(urlParams);
    params.set(key, value);
    setUrlParams(params);
  };

  const updateSortingByUrlParams = () => {
    const sortingData: Sorting = {...sorting};
    for (const [key, value] of urlParams.entries()) {
      if (key !== UrlParams.Sorting && key !== UrlParams.Order) {
        continue;
      }
      sortingData[key as keyof Sorting] = value;
    }
    dispatch(updateSorting(sortingData));
  };

  useEffect(() => {
    dispatch(loadPromo());
  }, [dispatch]);

  useEffect(() => {
    updateSortingByUrlParams();
  }, []);

  return (
    <main>
      <div className="banner">
        {promo ? (
          <React.Fragment>
            <picture>
              <source
                type="image/webp"
                srcSet={`/${promo.previewImgWebp}, /${promo.previewImgWebp2x}`}
              />
              <img
                src={promo.previewImg}
                srcSet={`${promo.previewImg2x} 2x`}
                width="1280"
                height="280"
                alt="????????????"
              />
            </picture>
            <p className="banner__info">
              <span className="banner__message">??????????????!</span>
              <span className="title title--h1">{promo.name}</span>
              <span className="banner__text">
                  ???????????????????????????????? ???????????? ????&nbsp;???????????????????? ??????????????????????????
              </span>
              <Link className="btn" to={`${AppRoutes.Product}/${promo.id}`}>
                  ??????????????????
              </Link>
            </p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <picture>
              <source
                type="image/webp"
                srcSet="/img/content/banner-bg.webp, /img/content/banner-bg@2x.webp 2x"
              />
              <img
                src="/img/content/banner-bg.jpg"
                srcSet="/img/content/banner-bg@2x.jpg 2x"
                width="1280"
                height="280"
                alt="????????????"
              />
            </picture>
            <p className="banner__info">
              <span className="banner__message">Could not load promo</span>
            </p>
          </React.Fragment>
        )}
      </div>
      <div className="page-content">
        <div className="breadcrumbs">
          <div className="container">
            <ul className="breadcrumbs__list">
              <li className="breadcrumbs__item">
                <Link className="breadcrumbs__link" to="/">
                    ??????????????
                  <svg width="5" height="8" aria-hidden="true">
                    <use xlinkHref="#icon-arrow-mini"></use>
                  </svg>
                </Link>
              </li>
              <li className="breadcrumbs__item">
                <span className="breadcrumbs__link breadcrumbs__link--active">
                    ??????????????
                </span>
              </li>
            </ul>
          </div>
        </div>
        <section className="catalog">
          <div className="container">
            <h1 className="title title--h2">?????????????? ????????- ?? ????????????????????????</h1>
            <div className="page-content__columns">
              <div className="catalog__aside">

                <FiltersForm />

              </div>
              <div className="catalog__content">
                <div className="catalog-sort">
                  <form action="#">
                    <div className="catalog-sort__inner">
                      <p className="title title--h5">??????????????????????:</p>
                      <div className="catalog-sort__type">
                        <div className="catalog-sort__btn-text">
                          <input
                            type="radio"
                            id="sortPrice"
                            name="sort"
                            value="price"
                            onChange={handleSortingFormChange}
                            checked={sorting._sort === 'price'}
                          />
                          <label htmlFor="sortPrice">???? ????????</label>
                        </div>
                        <div className="catalog-sort__btn-text">
                          <input
                            type="radio"
                            id="sortPopular"
                            name="sort"
                            value="rating"
                            onChange={handleSortingFormChange}
                            checked={sorting._sort === 'rating'}
                          />
                          <label htmlFor="sortPopular">???? ????????????????????????</label>
                        </div>
                      </div>
                      <div className="catalog-sort__order">
                        <div className="catalog-sort__btn catalog-sort__btn--up">
                          <input
                            type="radio"
                            id="up"
                            name="sort-icon"
                            aria-label="???? ??????????????????????"
                            value="asc"
                            onChange={handleSortingFormChange}
                            checked={sorting._order === 'asc'}
                          />
                          <label htmlFor="up">
                            <svg width="16" height="14" aria-hidden="true">
                              <use xlinkHref="#icon-sort"></use>
                            </svg>
                          </label>
                        </div>
                        <div className="catalog-sort__btn catalog-sort__btn--down">
                          <input
                            type="radio"
                            id="down"
                            name="sort-icon"
                            aria-label="???? ????????????????"
                            value="desc"
                            onChange={handleSortingFormChange}
                            checked={sorting._order === 'desc'}
                          />
                          <label htmlFor="down">
                            <svg width="16" height="14" aria-hidden="true">
                              <use xlinkHref="#icon-sort"></use>
                            </svg>
                          </label>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                <ProductsList pageNumber={pageNumber}/>
                <Pagination pageNumber={Number(pageNumber)}/>

              </div>
            </div>
          </div>
        </section>
      </div>

    </main>
  );
};
