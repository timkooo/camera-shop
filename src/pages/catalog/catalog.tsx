import React, { useEffect, useRef, useState } from 'react'
import { ProductCard } from '../../components/product-card/product-card';
import { useAppDispatch, useAppSelector } from '../../hooks/rtkHooks';
import { loadCamerasWithParams, loadPromo } from '../../store/api-actions';
import { selectCameras, selectCamerasAmount, selectAreCamerasLoading } from '../../store/cameras/cameras.selectors';
import { Camera } from '../../types/camera';
import { Filters2 } from '../../types/filters';
import classNames from 'classnames';
import { Price, Sorting, updateFilters, updateParameters, updatePrice, updateSorting } from '../../store/application/application.slice';
import { AppRoutes, getCategoryName, getFilterName, getSortingCategory } from '../../const';
import { selectParameters, selectPromo, selectSorting } from '../../store/application/application.selectors';
import { Link, useParams } from 'react-router-dom';
import { addToBasket } from '../../store/basket/basket.slice';
import FocusLock from 'react-focus-lock';


export const Catalog = () => {
  const { pageNumber = 1 } = useParams();
  const promo = useAppSelector(selectPromo);
  const areCamerasLoading = useAppSelector(selectAreCamerasLoading);
  const cameras = useAppSelector(selectCameras);
  const parameters = useAppSelector(selectParameters);
  const camerasAmount = useAppSelector(selectCamerasAmount);
  const [ selectedProduct, setSelectedProduct ] = useState<Camera | null>(null);
  const sorting = useAppSelector(selectSorting);
  const [pagesNumber, setPagesNumber] = useState<number>(1);
  const [ filtersFormData, setFiltersFormData ] = useState<Filters2>({});
  const [ sortingFormData, setSortingFormData ] = useState<Sorting>(sorting);
  const [ filtersList, setFiltersList ] = useState<string[]>([]);
  const [ priceFilterData, setPriceFilterData ] = useState<Price>({});
  const priceFromRef = useRef<HTMLInputElement>(null);
  const priceToRef = useRef<HTMLInputElement>(null);
  const camerasLimit = 9;
  const dispatch = useAppDispatch();

  const countPageNumber = () => {
    return Math.ceil(camerasAmount/camerasLimit);
  };

  const productsToShow = () => {
    const start = (Number(pageNumber) - 1) * camerasLimit;
    const end = start + camerasLimit;
    const params = { ... parameters, _start : start.toString(), _end : end.toString()};
    return params;
  };

  useEffect (() => {
    dispatch(updateParameters(productsToShow()));
  }, [dispatch, pageNumber]);

  const handleFilterFormChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } : { name: string; value: string | number } = evt.target;
    const categoryName = getCategoryName(name) as keyof Camera;
    const filterName = getFilterName(name);
    let data = {};
    let list = [ ... filtersList];
    if (evt.target.type === 'checkbox') {
      if (evt.target.checked === true) {
        data = addFilter(categoryName, filterName);
        list = [...list, name];
      }
      if (evt.target.checked === false) {
        console.log("FILTER-NAME", filterName);
        data = removeFilter(categoryName, filterName);
        const index2 = list.indexOf(name as string);
        console.log(index2);
        if (index2 > -1) {
          list.splice(index2, 1);
        }
      }
      console.log("formData", data);
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
      setPriceFilterData({...priceFilterData, price_gte : Number(priceFromRef.current?.value)});
    }
  }

  const handleToPriceChange = (evt: React.KeyboardEvent) => {
    if (evt.key === 'Enter') {
      setPriceFilterData({...priceFilterData, price_lte : Number(priceToRef.current?.value)});
    }
  }

  const handleAddItemToBasket = () => {
    if (selectedProduct) {
      dispatch(addToBasket(selectedProduct));
    }
    setSelectedProduct(null);
  };

  const handleSortingFormChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } : { name: string; value: string } = evt.target;
    const sortingCategory = getSortingCategory(name);
    const sortingData = {... sorting, [sortingCategory] : value};
    setSortingFormData(sortingData);
  };

  const isFilterChecked = (name: string) => {
    return filtersList.includes(name);
  };
   
  const addFilter = <K extends keyof Camera>(name: K, value: Camera[K]) => {
    let filters = { ...filtersFormData } as Filters2;
    if (!filters[name]) {
      filters = { ...filtersFormData, [name]: []};
    }
    (filters[name] as typeof value[]) = [...(filters[name] as typeof value[]), value]
    return filters;
  }

  const removeFilter = <K extends keyof Camera>(name: K, value: Camera[K]) => {
    let filters = { ...filtersFormData } as Filters2;
    let filters2 = [ ...(filters[name] as typeof value[]) ];
    const index = filters[name]?.indexOf(value as Camera[K]);
    if (index !== undefined && index > -1) {
      (filters2 as typeof value[]).splice(index, 1);
      (filters[name] as typeof value[]) = filters2;
    }
    return filters;
  } 

  useEffect(() => {
    dispatch(updatePrice(priceFilterData));
  }, [dispatch, priceFilterData]);

  useEffect(() => {
    dispatch(updateSorting(sortingFormData));
  }, [dispatch, sortingFormData]);

  useEffect(() => {
    setPagesNumber(countPageNumber);
  }, [dispatch, camerasAmount]);

  useEffect(() => {
    dispatch(updateFilters(filtersFormData));
  }, [dispatch, filtersFormData]);

  useEffect(() => {
    dispatch(loadPromo());
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadCamerasWithParams());
  }, [dispatch, filtersFormData, parameters, pageNumber, sortingFormData, priceFilterData]);

  useEffect(() => {
    selectedProduct ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'unset';
  }, [selectedProduct]);

  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.code === 'Escape') {
        setSelectedProduct(null);
      }
    }
    document.addEventListener('keydown', handleEscapeKey)
    return () => document.removeEventListener('keydown', handleEscapeKey)
  }, []);

  if (areCamerasLoading) {
    return <div>LOADING</div>
  }

return (
<React.Fragment>
     <main>
        <div className="banner">
        {promo ? (
          <>
            <picture>
              <source type="image/webp" srcSet={`/${promo.previewImgWebp}, /${promo.previewImgWebp2x}`} /><img src={promo.previewImg} srcSet={`${promo.previewImg2x} 2x`} width="1280" height="280" alt="баннер" />
            </picture>
            <p className="banner__info"><span className="banner__message">Новинка!</span><span className="title title--h1">{promo.name}</span><span className="banner__text">Профессиональная камера от&nbsp;известного производителя</span><Link className="btn" to={`${AppRoutes.Product}/${promo.id}`}>Подробнее</Link></p>
          </>) : (<>
            <picture>
              <source type="image/webp" srcSet="/img/content/banner-bg.webp, /img/content/banner-bg@2x.webp 2x" /><img src="/img/content/banner-bg.jpg" srcSet="/img/content/banner-bg@2x.jpg 2x" width="1280" height="280" alt="баннер" />
            </picture>
            <p className="banner__info"><span className="banner__message">Could not load promo</span></p>
          </>)}
        </div>
        <div className="page-content">
          <div className="breadcrumbs">
            <div className="container">
              <ul className="breadcrumbs__list">
                <li className="breadcrumbs__item"><Link className="breadcrumbs__link" to="/">Главная
                    <svg width="5" height="8" aria-hidden="true">
                      <use xlinkHref="#icon-arrow-mini"></use>
                    </svg></Link>
                </li>
                <li className="breadcrumbs__item"><span className="breadcrumbs__link breadcrumbs__link--active">Каталог</span>
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
                              <input ref={priceFromRef} type="number" name="price" placeholder="от" onKeyDown={handleFromPriceChange} defaultValue={priceFilterData.price_gte} />
                            </label>
                          </div>
                          <div className="custom-input">
                            <label>
                              <input ref={priceToRef} type="number" name="priceUp" placeholder="до" onKeyDown={handleToPriceChange} defaultValue={priceFilterData.price_lte}/>
                            </label>
                          </div>
                        </div>
                      </fieldset>
                      <fieldset className="catalog-filter__block">
                        <legend className="title title--h5">Категория</legend>
                        <div className="custom-checkbox catalog-filter__item">
                          <label>
                            <input type="checkbox" name="photocamera" checked={isFilterChecked('photocamera')} onChange={handleFilterFormChange} /><span className="custom-checkbox__icon"></span><span className="custom-checkbox__label">Фотокамера</span>
                          </label>
                        </div>
                        <div className="custom-checkbox catalog-filter__item">
                          <label>
                            <input type="checkbox" name="videocamera" checked={isFilterChecked('videocamera')} onChange={handleFilterFormChange} /><span className="custom-checkbox__icon"></span><span className="custom-checkbox__label">Видеокамера</span>
                          </label>
                        </div>
                      </fieldset>
                      <fieldset className="catalog-filter__block">
                        <legend className="title title--h5">Тип камеры</legend>
                        <div className="custom-checkbox catalog-filter__item">
                          <label>
                            <input type="checkbox" name="digital" checked={isFilterChecked('digital')} onChange={handleFilterFormChange}/><span className="custom-checkbox__icon"></span><span className="custom-checkbox__label">Цифровая</span>
                          </label>
                        </div>
                        <div className="custom-checkbox catalog-filter__item">
                          <label>
                            <input type="checkbox" name="film" disabled/><span className="custom-checkbox__icon"></span><span className="custom-checkbox__label">Плёночная</span>
                          </label>
                        </div>
                        <div className="custom-checkbox catalog-filter__item">
                          <label>
                            <input type="checkbox" name="snapshot" checked={isFilterChecked('snapshot')} onChange={handleFilterFormChange}/><span className="custom-checkbox__icon"></span><span className="custom-checkbox__label">Моментальная</span>
                          </label>
                        </div>
                        <div className="custom-checkbox catalog-filter__item">
                          <label>
                            <input type="checkbox" name="collection" checked disabled/><span className="custom-checkbox__icon"></span><span className="custom-checkbox__label">Коллекционная</span>
                          </label>
                        </div>
                      </fieldset>
                      <fieldset className="catalog-filter__block">
                        <legend className="title title--h5">Уровень</legend>
                        <div className="custom-checkbox catalog-filter__item">
                          <label>
                            <input type="checkbox" name="zero" checked={isFilterChecked('zero')} onChange={handleFilterFormChange}/><span className="custom-checkbox__icon"></span><span className="custom-checkbox__label">Нулевой</span>
                          </label>
                        </div>
                        <div className="custom-checkbox catalog-filter__item">
                          <label>
                            <input type="checkbox" name="nonprofessional" checked={isFilterChecked('nonprofessional')} onChange={handleFilterFormChange}/><span className="custom-checkbox__icon"></span><span className="custom-checkbox__label">Любительский</span>
                          </label>
                        </div>
                        <div className="custom-checkbox catalog-filter__item">
                          <label>
                            <input type="checkbox" name="professional" checked={isFilterChecked('professional')} onChange={handleFilterFormChange}/><span className="custom-checkbox__icon"></span><span className="custom-checkbox__label">Профессиональный</span>
                          </label>
                        </div>
                      </fieldset>
                      <button className="btn catalog-filter__reset-btn" type="reset" onClick={handleResetFilters}>Сбросить фильтры
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
                            <input type="radio" id="sortPrice" name="sort" value="price" onChange={handleSortingFormChange} checked={sorting._sort === "price"}/>
                            <label htmlFor="sortPrice">по цене</label>
                          </div>
                          <div className="catalog-sort__btn-text">
                            <input type="radio" id="sortPopular" name="sort" value="rating" onChange={handleSortingFormChange} checked={sorting._sort === "rating"}/>
                            <label htmlFor="sortPopular">по популярности</label>
                          </div>
                        </div>
                        <div className="catalog-sort__order">
                          <div className="catalog-sort__btn catalog-sort__btn--up">
                            <input type="radio" id="up" name="sort-icon" aria-label="По возрастанию" value="asc" onChange={handleSortingFormChange} checked={sorting._order === "asc"}/>
                            <label htmlFor="up">
                              <svg width="16" height="14" aria-hidden="true">
                                <use xlinkHref="#icon-sort"></use>
                              </svg>
                            </label>
                          </div>
                          <div className="catalog-sort__btn catalog-sort__btn--down">
                            <input type="radio" id="down" name="sort-icon" aria-label="По убыванию" value="desc" onChange={handleSortingFormChange} checked={sorting._order === "desc"}/>
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
                  <div className="cards catalog__cards">
                    
                    {cameras.map((camera) => <ProductCard key={camera.id} product={camera} onSelectedProductChange={setSelectedProduct}/>)}

                  </div>
                  <div className="pagination">
                    <ul className="pagination__list">
                      <li className="pagination__item"><Link className={classNames("pagination__link", "pagination__link--text", {"visually-hidden" : Number(pageNumber) === 1})}  to={`/catalog/page/${Number(pageNumber) - 1}`}>Назад</Link></li>
                      {Array.from( {length: pagesNumber} ).map((_, index) => (
                         <li key={index} className="pagination__item"><Link className={classNames("pagination__link", {"pagination__link--active" : Number(pageNumber) === index+1 })} to={`/catalog/page/${index + 1}`}>{index + 1}</Link></li>
                      ))}
                      <li className="pagination__item"><Link className={classNames("pagination__link", "pagination__link--text", {"visually-hidden" : Number(pageNumber) === pagesNumber})} to={`/catalog/page/${Number(pageNumber) + 1}`}>Далее</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

    <div className={classNames('modal', {'is-active' : selectedProduct})}>
      <div className="modal__wrapper" onClick={() => setSelectedProduct(null)}>
        <div className="modal__overlay"></div>
        <FocusLock>
        <div className="modal__content" onClick={evt => evt.stopPropagation()}>
          <p className="title title--h4">Добавить товар в корзину</p>
          <div className="basket-item basket-item--short">
            <div className="basket-item__img">
              <picture>
                <source type="image/webp" srcSet="img/content/img9.webp, img/content/img9@2x.webp 2x" /><img src="img/content/img9.jpg" srcSet="img/content/img9@2x.jpg 2x" width="140" height="120" alt="Фотоаппарат «Орлёнок»" />
              </picture>
            </div>
            <div className="basket-item__description">
              <p className="basket-item__title">{selectedProduct?.name}</p>
              <ul className="basket-item__list">
                <li className="basket-item__list-item"><span className="basket-item__article">Артикул:</span> <span className="basket-item__number">O78DFGSD832</span>
                </li>
                <li className="basket-item__list-item">Плёночная фотокамера</li>
                <li className="basket-item__list-item">Любительский уровень</li>
              </ul>
              <p className="basket-item__price"><span className="visually-hidden">Цена:</span>18 970 ₽</p>
            </div>
          </div>
          <div className="modal__buttons">
            
            <button className="btn btn--purple modal__btn modal__btn--fit-width" type="button" onClick={handleAddItemToBasket}>
              <svg width="24" height="16" aria-hidden="true">
                <use xlinkHref="#icon-add-basket"></use>
              </svg>Добавить в корзину
            </button>
          </div>
          <button className="cross-btn" type="button" aria-label="Закрыть попап" onClick={() => setSelectedProduct(null)}>
            <svg width="10" height="10" aria-hidden="true">
              <use xlinkHref="#icon-close"></use>
            </svg>
          </button>
        </div>
        </FocusLock>
      </div>
    </div>

</React.Fragment>
);
};