import { useRef, useState, useEffect } from 'react';
import { getCategoryName, getFilterName, SortingTypes } from '../../const';
import { useAppDispatch } from '../../hooks/rtk-hooks';
import { Price, updatePrice, updateFilters } from '../../store/application/application.slice';
import { Camera } from '../../types/camera';
import { Filters } from '../../types/filters';

export const FiltersForm = () => {
  const [filtersFormData, setFiltersFormData] = useState<Filters>({});
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

  const isFilterChecked = (name: string) => filtersList.includes(name);

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
    dispatch(updateFilters(filtersFormData));
  }, [dispatch, filtersFormData]);

  useEffect(() => {
    dispatch(updatePrice(priceFilterData));
  }, [dispatch, priceFilterData]);

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
  );
};
