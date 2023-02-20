import { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategoryName, getFilterName, getKeyByValue, SortingTypes } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks/rtk-hooks';
import { loadMinMaxPrice } from '../../store/api-actions';
import { selectFilters, selectMinMaxPrice, selectPrice } from '../../store/application/application.selectors';
import { updatePrice, updateFilters, Price } from '../../store/application/application.slice';
import { Camera } from '../../types/camera';
import { Filters } from '../../types/filters';

export const FiltersForm = () => {
  const filters = useAppSelector(selectFilters);
  const price = useAppSelector(selectPrice);
  const minMaxPrice = useAppSelector(selectMinMaxPrice);
  const [urlParams, setUrlParams] = useSearchParams();
  const [filtersList, setFiltersList] = useState<string[]>([]);
  const priceFromRef = useRef<HTMLInputElement | null>(null);
  const priceToRef = useRef<HTMLInputElement | null>(null);
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
        addUrlParam(categoryName, filterName);
      }
      if (evt.target.checked === false) {
        data = removeFilter(categoryName, filterName);
        const index = list.indexOf(name);
        if (index > -1) {
          list.splice(index, 1);
        }
        deleteUrlParam(categoryName, filterName);
      }
      setFiltersList(list);
      dispatch(updateFilters(data));
    }
  };

  const isFilterChecked = (name: string) => filtersList.includes(name);

  const updateUrlParam = (key: string, value: string) => {
    const params = new URLSearchParams(urlParams);
    params.set(key, value);
    setUrlParams(params);
  };

  const addUrlParam = (key: string, value: string) => {
    const params = new URLSearchParams(urlParams);
    params.append(key, value);
    setUrlParams(params);
  };

  const deleteUrlParam = (key: string, value: string) => {
    const params = [...urlParams];
    const index = params.findIndex(([paramKey, paramValue]) => paramKey === key && paramValue === value);
    params.splice(index, 1);
    const filteredParams = new URLSearchParams(params);
    setUrlParams(filteredParams);
  };

  const handleResetFilters = () => {
    setFiltersList(() => []);
    dispatch(updateFilters({}));
    dispatch(updatePrice({}));
    setUrlParams([]);
  };

  const handleFromPriceChange = (evt: React.KeyboardEvent) => {
    if (evt.key === 'Enter') {
      const inputPrice = priceFromRef.current?.value;
      const toPrice = priceToRef.current?.value;
      if (minMaxPrice.minPrice && Number(inputPrice) < minMaxPrice.minPrice) {
        if (priceFromRef.current && priceFromRef.current.value) {
          priceFromRef.current.value = minMaxPrice.minPrice.toString();
        }
        setPrice(SortingTypes.PriceUp, minMaxPrice.minPrice.toString());
        return;
      }
      if (inputPrice && toPrice && inputPrice > toPrice) {
        if (priceFromRef.current && priceFromRef.current.value) {
          priceFromRef.current.value = toPrice;
        }
        setPrice(SortingTypes.PriceUp, toPrice);
        return;
      }
      setPrice(SortingTypes.PriceUp, inputPrice ?? '');
    }
  };

  const setPrice = (priceType : string, value: string) => {
    dispatch(updatePrice({
      ...price,
      [priceType]: Number(value),
    }));
    updateUrlParam(SortingTypes.PriceDown, value);
  };

  const handleToPriceChange = (evt: React.KeyboardEvent) => {
    if (evt.key === 'Enter') {
      const inputPrice = priceToRef.current?.value;
      const fromPrice = priceFromRef.current?.value;
      if (minMaxPrice.maxPrice && Number(inputPrice) > minMaxPrice.maxPrice) {
        if (priceToRef.current && priceToRef.current.value) {
          priceToRef.current.value = minMaxPrice.maxPrice.toString();
        }
        setPrice(SortingTypes.PriceDown, minMaxPrice.maxPrice.toString());
        return;
      }
      if (inputPrice && fromPrice && inputPrice < fromPrice) {
        if (priceToRef.current && priceToRef.current.value) {
          priceToRef.current.value = fromPrice;
        }
        setPrice(SortingTypes.PriceDown, fromPrice);
        return;
      }
      setPrice(SortingTypes.PriceDown, inputPrice ?? '');
    }
  };

  const addFilter = <K extends keyof Camera>(name: K, value: Camera[K], targetArray = filters) => {
    let filterList = { ...targetArray } as Filters;
    if (!filterList[name]) {
      filterList = { ...targetArray, [name]: [] };
    }
    (filterList[name] as typeof value[]) = [
      ...(filterList[name] as typeof value[]),
      value,
    ];
    return filterList;
  };

  const removeFilter = <K extends keyof Camera>(name: K, value: Camera[K]) => {
    const filterCategories = { ...filters } as Filters;
    const filterList = [...(filterCategories[name] as typeof value[])];
    const index = filterCategories[name]?.indexOf(value);
    if (index !== undefined && index > -1) {
      (filterList).splice(index, 1);
      (filterCategories[name] as typeof value[]) = filterList;
    }
    return filterCategories;
  };

  const updateFiltersByUrlParams = () => {
    let filtersData = {};
    const priceData: Price = {...price};
    const filterList: string[] = [];
    for (const [key, value] of urlParams.entries()) {
      if (key === SortingTypes.PriceDown || key === SortingTypes.PriceUp) {
        priceData[key as keyof Price] = Number(value);
        continue;
      }
      filtersData = addFilter(key as keyof Camera, value, filtersData);
      const filterKey = getKeyByValue(value);
      if (filterKey) {
        filterList.push(filterKey);
      }
    }
    setFiltersList(filterList);
    dispatch(updateFilters(filtersData));
    dispatch(updatePrice(priceData));
  };

  const hadleDefaultFromPriceValue = () => {
    if (price[SortingTypes.PriceUp]) {
      return price[SortingTypes.PriceUp];
    }
    return minMaxPrice.minPrice ? minMaxPrice.minPrice : '';
  };

  const hadleDefaultToPriceValue = () => {
    if (price[SortingTypes.PriceDown]) {
      return price[SortingTypes.PriceDown];
    }
    return minMaxPrice.maxPrice ? minMaxPrice.maxPrice : '';
  };

  const isDisabled = (filterName: string) => filtersList.includes(filterName);

  useEffect(() => {
    updateFiltersByUrlParams();
  }, []);

  useEffect(() => {
    dispatch(loadMinMaxPrice());
  }, [dispatch]);

  return (
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
                  defaultValue={hadleDefaultFromPriceValue()}
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
                  defaultValue={hadleDefaultToPriceValue()}
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
                disabled={isDisabled('videocamera')}
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
                disabled={isDisabled('photocamera')}
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
              <input
                type="checkbox"
                name="film"
                checked={isFilterChecked('film')}
                onChange={handleFilterFormChange}
                disabled={isDisabled('videocamera')}
              />
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
                disabled={isDisabled('videocamera')}
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
                checked={isFilterChecked('collection')}
                onChange={handleFilterFormChange}
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
  );
};
