import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/rtk-hooks';
import { loadPromo } from '../../store/api-actions';
import { Camera } from '../../types/camera';
import { Filters } from '../../types/filters';
import {
  Price,
  Sorting,
  updateFilters,
  updatePrice,
  updateSorting,
} from '../../store/application/application.slice';
import {
  AppRoutes,
  getCategoryName,
  getFilterName,
  getSortingCategory,
  SortingTypes,
} from '../../const';
import {
  selectPromo,
  selectSorting,
} from '../../store/application/application.selectors';
import { Link, useParams } from 'react-router-dom';
import { Pagination } from '../../components/pagination/pagination';
import { ProductsList } from '../../components/products-list/products-list';

export const Catalog = () => {
  const { pageNumber = '1' } = useParams();
  const promo = useAppSelector(selectPromo);
  const sorting = useAppSelector(selectSorting);
  const [filtersFormData, setFiltersFormData] = useState<Filters>({});
  const [sortingFormData, setSortingFormData] = useState<Sorting>(sorting);
  const [filtersList, setFiltersList] = useState<string[]>([]);
  const [priceFilterData, setPriceFilterData] = useState<Price>({});
  const priceFromRef = useRef<HTMLInputElement>(null);
  const priceToRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const handleFilterFormChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name }: { name: string; value: string | number } =
      evt.target;
    const categoryName = getCategoryName(name) as keyof Camera;
    const filterName = getFilterName(name);
    let data = {};
    let list = [...filtersList];
    if (evt.target.type === 'checkbox') {
      if (evt.target.checked === true) {
        data = addFilter(categoryName, filterName);
        list = [...list, name];
      }
      if (evt.target.checked === false) {
        data = removeFilter(categoryName, filterName);
        const index = list.indexOf(name);
        if (index > -1) {
          list.splice(index, 1);
        }
      }
      setFiltersList(() => list);
      setFiltersFormData(() => data);
    }
  };

  const handleResetFilters = () => {
    setFiltersList(() => []);
    setFiltersFormData(() => ({}));
    setPriceFilterData(() => ({}));
  };

  const handleFromPriceChange = (evt: React.KeyboardEvent) => {
    if (evt.key === 'Enter') {
      if (Number(priceFromRef.current?.value) === 0) {
        const price = { ...priceFilterData };
        delete price[SortingTypes.PriceUp];
        setPriceFilterData(price);
        return;
      }
      setPriceFilterData({
        ...priceFilterData,
        [SortingTypes.PriceUp]: Number(priceFromRef.current?.value),
      });
    }
  };

  const handleToPriceChange = (evt: React.KeyboardEvent) => {
    if (evt.key === 'Enter') {
      if (Number(priceToRef.current?.value) === 0) {
        const price = { ...priceFilterData };
        delete price[SortingTypes.PriceDown];
        setPriceFilterData(price);
        return;
      }
      setPriceFilterData({
        ...priceFilterData,
        [SortingTypes.PriceDown]: Number(priceToRef.current?.value),
      });
    }
  };

  const handleSortingFormChange = (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value }: { name: string; value: string } = evt.target;
    const sortingCategory = getSortingCategory(name);
    const sortingData = { ...sorting, [sortingCategory]: value };
    setSortingFormData(sortingData);
  };

  const isFilterChecked = (name: string) => filtersList.includes(name);

  const addFilter = <K extends keyof Camera>(name: K, value: Camera[K]) => {
    let filters = { ...filtersFormData } as Filters;
    if (!filters[name]) {
      filters = { ...filtersFormData, [name]: [] };
    }
    (filters[name] as typeof value[]) = [
      ...(filters[name] as typeof value[]),
      value,
    ];
    return filters;
  };

  const removeFilter = <K extends keyof Camera>(name: K, value: Camera[K]) => {
    const filterCategories = { ...filtersFormData } as Filters;
    const filters = [...(filterCategories[name] as typeof value[])];
    const index = filterCategories[name]?.indexOf(value);
    if (index !== undefined && index > -1) {
      (filters).splice(index, 1);
      (filterCategories[name] as typeof value[]) = filters;
    }
    return filterCategories;
  };

  useEffect(() => {
    dispatch(updatePrice(priceFilterData));
  }, [dispatch, priceFilterData]);

  useEffect(() => {
    dispatch(updateSorting(sortingFormData));
  }, [dispatch, sortingFormData]);

  useEffect(() => {
    dispatch(updateFilters(filtersFormData));
  }, [dispatch, filtersFormData]);

  useEffect(() => {
    dispatch(loadPromo());
  }, [dispatch]);

  return (
    <main>
      <div className="banner">
        {promo ? (
          <>
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
                alt="баннер"
              />
            </picture>
            <p className="banner__info">
              <span className="banner__message">Новинка!</span>
              <span className="title title--h1">{promo.name}</span>
              <span className="banner__text">
                  Профессиональная камера от&nbsp;известного производителя
              </span>
              <Link className="btn" to={`${AppRoutes.Product}/${promo.id}`}>
                  Подробнее
              </Link>
            </p>
          </>
        ) : (
          <>
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
                alt="баннер"
              />
            </picture>
            <p className="banner__info">
              <span className="banner__message">Could not load promo</span>
            </p>
          </>
        )}
      </div>
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
                <span className="breadcrumbs__link breadcrumbs__link--active">
                    Каталог
                </span>
              </li>
            </ul>
          </div>
        </div>
        <section className="catalog">
          <div className="container">
            <h1 className="title title--h2">Каталог фото- и видеотехники</h1>
            <div className="page-content__columns">
              <div className="catalog__aside">
                <div className="catalog-filter">
                  <form action="#">
                    <h2 className="visually-hidden">Фильтр</h2>
                    <fieldset className="catalog-filter__block">
                      <legend className="title title--h5">Цена, ₽</legend>
                      <div className="catalog-filter__price-range">
                        <div className="custom-input">
                          <label>
                            <input
                              ref={priceFromRef}
                              type="number"
                              name="price"
                              placeholder="от"
                              onKeyDown={handleFromPriceChange}
                              defaultValue={priceFilterData.price_gte}
                            />
                          </label>
                        </div>
                        <div className="custom-input">
                          <label>
                            <input
                              ref={priceToRef}
                              type="number"
                              name="priceUp"
                              placeholder="до"
                              onKeyDown={handleToPriceChange}
                              defaultValue={priceFilterData.price_lte}
                            />
                          </label>
                        </div>
                      </div>
                    </fieldset>
                    <fieldset className="catalog-filter__block">
                      <legend className="title title--h5">Категория</legend>
                      <div className="custom-checkbox catalog-filter__item">
                        <label>
                          <input
                            type="checkbox"
                            name="photocamera"
                            checked={isFilterChecked('photocamera')}
                            onChange={handleFilterFormChange}
                          />
                          <span className="custom-checkbox__icon"></span>
                          <span className="custom-checkbox__label">
                              Фотокамера
                          </span>
                        </label>
                      </div>
                      <div className="custom-checkbox catalog-filter__item">
                        <label>
                          <input
                            type="checkbox"
                            name="videocamera"
                            checked={isFilterChecked('videocamera')}
                            onChange={handleFilterFormChange}
                          />
                          <span className="custom-checkbox__icon"></span>
                          <span className="custom-checkbox__label">
                              Видеокамера
                          </span>
                        </label>
                      </div>
                    </fieldset>
                    <fieldset className="catalog-filter__block">
                      <legend className="title title--h5">Тип камеры</legend>
                      <div className="custom-checkbox catalog-filter__item">
                        <label>
                          <input
                            type="checkbox"
                            name="digital"
                            checked={isFilterChecked('digital')}
                            onChange={handleFilterFormChange}
                          />
                          <span className="custom-checkbox__icon"></span>
                          <span className="custom-checkbox__label">
                              Цифровая
                          </span>
                        </label>
                      </div>
                      <div className="custom-checkbox catalog-filter__item">
                        <label>
                          <input type="checkbox" name="film" disabled />
                          <span className="custom-checkbox__icon"></span>
                          <span className="custom-checkbox__label">
                              Плёночная
                          </span>
                        </label>
                      </div>
                      <div className="custom-checkbox catalog-filter__item">
                        <label>
                          <input
                            type="checkbox"
                            name="snapshot"
                            checked={isFilterChecked('snapshot')}
                            onChange={handleFilterFormChange}
                          />
                          <span className="custom-checkbox__icon"></span>
                          <span className="custom-checkbox__label">
                              Моментальная
                          </span>
                        </label>
                      </div>
                      <div className="custom-checkbox catalog-filter__item">
                        <label>
                          <input
                            type="checkbox"
                            name="collection"
                            checked
                            disabled
                          />
                          <span className="custom-checkbox__icon"></span>
                          <span className="custom-checkbox__label">
                              Коллекционная
                          </span>
                        </label>
                      </div>
                    </fieldset>
                    <fieldset className="catalog-filter__block">
                      <legend className="title title--h5">Уровень</legend>
                      <div className="custom-checkbox catalog-filter__item">
                        <label>
                          <input
                            type="checkbox"
                            name="zero"
                            checked={isFilterChecked('zero')}
                            onChange={handleFilterFormChange}
                          />
                          <span className="custom-checkbox__icon"></span>
                          <span className="custom-checkbox__label">
                              Нулевой
                          </span>
                        </label>
                      </div>
                      <div className="custom-checkbox catalog-filter__item">
                        <label>
                          <input
                            type="checkbox"
                            name="nonprofessional"
                            checked={isFilterChecked('nonprofessional')}
                            onChange={handleFilterFormChange}
                          />
                          <span className="custom-checkbox__icon"></span>
                          <span className="custom-checkbox__label">
                              Любительский
                          </span>
                        </label>
                      </div>
                      <div className="custom-checkbox catalog-filter__item">
                        <label>
                          <input
                            type="checkbox"
                            name="professional"
                            checked={isFilterChecked('professional')}
                            onChange={handleFilterFormChange}
                          />
                          <span className="custom-checkbox__icon"></span>
                          <span className="custom-checkbox__label">
                              Профессиональный
                          </span>
                        </label>
                      </div>
                    </fieldset>
                    <button
                      className="btn catalog-filter__reset-btn"
                      type="reset"
                      onClick={handleResetFilters}
                    >
                        Сбросить фильтры
                    </button>
                  </form>
                </div>
              </div>
              <div className="catalog__content">
                <div className="catalog-sort">
                  <form action="#">
                    <div className="catalog-sort__inner">
                      <p className="title title--h5">Сортировать:</p>
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
                          <label htmlFor="sortPrice">по цене</label>
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
                          <label htmlFor="sortPopular">по популярности</label>
                        </div>
                      </div>
                      <div className="catalog-sort__order">
                        <div className="catalog-sort__btn catalog-sort__btn--up">
                          <input
                            type="radio"
                            id="up"
                            name="sort-icon"
                            aria-label="По возрастанию"
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
                            aria-label="По убыванию"
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
