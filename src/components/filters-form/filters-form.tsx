import { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategoryName, getFilterName, getKeyByValue, SortingTypes } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks/rtk-hooks';
import { loadMinMaxPrice } from '../../store/api-actions';
import { selectFilters, selectMinMaxPrice, selectPrice } from '../../store/application/application.selectors';
import { updatePrice, updateFilters } from '../../store/application/application.slice';
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
      }
      if (evt.target.checked === false) {
        data = removeFilter(categoryName, filterName);
        const index = list.indexOf(name);
        if (index > -1) {
          list.splice(index, 1);
        }
      }
      setFiltersList(() => list);
      dispatch(updateFilters(data));
      objectToParams(data);
    }
  };

  const isFilterChecked = (name: string) => filtersList.includes(name);

  const handleResetFilters = () => {
    setFiltersList(() => []);
    dispatch(updateFilters({}));
    dispatch(updatePrice({}));
  };

  const objectToParams = <K extends Filters, T extends keyof K, N extends K[T][]>(filtersSet : K) => {
    const params: [string, string][] = [];
    Object.keys(filtersSet).map((filterCategory) => {
      (filtersSet[filterCategory as T] as N).map((filterValue) => params.push([filterCategory, filterValue as string]));
    });
    const seachParams = new URLSearchParams(params);
    setUrlParams(seachParams);
  };

  const handleFromPriceChange = (evt: React.KeyboardEvent) => {
    if (evt.key === 'Enter') {
      const inputPrice = priceFromRef.current?.value;
      if (minMaxPrice.minPrice && Number(inputPrice) < minMaxPrice.minPrice) {
        if (priceFromRef.current && priceFromRef.current.value) {
          priceFromRef.current.value = minMaxPrice.minPrice.toString();
        }
        dispatch(updatePrice({
          ...price,
          [SortingTypes.PriceUp]: minMaxPrice.minPrice,
        }));
        return;
      }
      dispatch(updatePrice({
        ...price,
        [SortingTypes.PriceUp]: Number(inputPrice),
      }));
    }
  };

  const handleToPriceChange = (evt: React.KeyboardEvent) => {
    if (evt.key === 'Enter') {
      const inputPrice = priceToRef.current?.value;
      if (minMaxPrice.maxPrice && Number(inputPrice) > minMaxPrice.maxPrice) {
        if (priceToRef.current && priceToRef.current.value) {
          priceToRef.current.value = minMaxPrice.maxPrice.toString();
        }
        dispatch(updatePrice({
          ...price,
          [SortingTypes.PriceDown]: minMaxPrice.maxPrice,
        }));
        return;
      }
      dispatch(updatePrice({
        ...price,
        [SortingTypes.PriceDown]: Number(inputPrice),
      }));
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

  const paramsToObject = () => {
    let data = {};
    const filterList: string[] = [];
    for (const [key, value] of urlParams.entries()) {
      data = addFilter(key as keyof Camera, value, data);
      const filterKey = getKeyByValue(value);
      if (filterKey) {
        filterList.push(filterKey);
      }
    }
    setFiltersList(filterList);
    dispatch(updateFilters(data));
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

  const isDisabled = (filterName: string) => filtersList.includes(filterName);

  useEffect(() => {
    paramsToObject();
  }, [urlParams]);

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
                  defaultValue={minMaxPrice.minPrice ? minMaxPrice.minPrice : ''}
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
                  defaultValue={minMaxPrice.maxPrice ? minMaxPrice.maxPrice : ''}
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
                disabled={isDisabled('photocamera')}
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
                disabled={isDisabled('photocamera')}
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
                disabled={isDisabled('videocamera')}
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
